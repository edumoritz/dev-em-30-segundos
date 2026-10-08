(() => {
  const SUPABASE_URL = 'https://popnenmckbolhohbqrsg.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvcG5lbm1ja2JvbGhvaGJxcnNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzODIzNjcsImV4cCI6MjEwNDk1ODM2N30.GuiapJFe6z_iCWPN4cw1_hSYa4Xm6Iuj5bQMA9TxbaE';
  const ENDPOINT = SUPABASE_URL + '/functions/v1/prototype-game-metrics';
  const id = () => crypto.randomUUID?.() || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16);
  });
  const get = (storageName, key) => {
    try {
      const storage = window[storageName];
      let value = storage.getItem(key);
      if (!value) { value = id(); storage.setItem(key, value); }
      return value;
    } catch { return id(); }
  };
  const visitorId = get('localStorage', 'espi-visitor-v1');
  const sessionId = get('sessionStorage', 'espi-session-v1');
  const path = location.pathname;
  const page = path.endsWith('/entrega.html') ? 'delivery' : 'original';
  const dashboard = path.endsWith('/metrics.html');

  function send(payload, extraHeaders = {}) {
    try {
      return fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
          Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
          ...extraHeaders
        },
        body: JSON.stringify(payload),
        mode: 'cors',
        credentials: 'omit',
        cache: 'no-store',
        keepalive: true
      }).catch(() => {});
    } catch { return Promise.resolve(); }
  }

  window.Metrics = {
    newPlayId: id,
    start(game, playId) { send({ action: 'collect', type: 'game_start', game, playId, visitorId, sessionId, page, path }); },
    finish(game, playId) { if (playId) send({ action: 'collect', type: 'game_finish', game, playId, visitorId, sessionId, page, path }); },
    report(days, adminToken) {
      return fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
          Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
          'x-dashboard-token': adminToken
        },
        body: JSON.stringify({ action: 'report', days }),
        mode: 'cors',
        credentials: 'omit',
        cache: 'no-store'
      }).then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Não foi possível carregar as métricas.');
        return data;
      });
    }
  };

  if (!dashboard) {
    send({ action: 'collect', type: 'page_view', visitorId, sessionId, page, path });
    const heartbeat = () => {
      if (!document.hidden) send({ action: 'collect', type: 'heartbeat', visitorId, sessionId, page, path });
    };
    setInterval(heartbeat, 30_000);
    document.addEventListener('visibilitychange', heartbeat);
  }
})();

