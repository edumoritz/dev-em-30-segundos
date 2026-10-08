'use strict';
// Browser voice notes: fixed scripts, no server requests or recorded assets.
const clientVoice = (() => {
  const supported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  const synth = supported ? window.speechSynthesis : null;
  const heard = new Set();
  let current = null, timeout = null, playing = false, muted = false;
  const notes = {
    shop: 'Ficou ótimo! Agora consegue deixar igual à Amazon? Mas pode manter simples.',
    mugs: 'Ô, cliquei em comprar uma caneca e apareceram duas no carrinho. Se cobrar duas, é bug. Se cobrar uma, eu gostei.',
    delivered: 'Já te indiquei pra um amigo. Falei que você faz baratinho e aceita qualquer alteração.'
  };
  function update() {
    document.querySelectorAll('[data-voice-note]').forEach(button => {
      const active = playing && current?.key === button.dataset.voiceNote;
      button.textContent = !supported ? 'Voz indisponível neste navegador' : muted ? 'Som desligado' : active ? 'Parar áudio' : 'Ouvir áudio do cliente';
      button.disabled = !supported || muted;
      button.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('.voice-status').forEach(status => {
      status.textContent = playing ? 'Reproduzindo · cronômetro pausado' : 'Voz do navegador · texto abaixo';
    });
  }
  function stop() {
    const old = current;
    current = null;
    playing = false;
    clearTimeout(timeout);
    if (old) { old.utterance.onend = null; old.utterance.onerror = null; }
    if (supported && old) synth.cancel();
    update();
  }
  function play(key) {
    if (!supported || muted || document.hidden) return;
    if (playing && current?.key === key) { stop(); return; }
    stop();
    const utterance = new window.SpeechSynthesisUtterance(notes[key]);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.08;
    const voices = synth.getVoices();
    utterance.voice = voices.find(voice => /^pt[-_]BR$/i.test(voice.lang)) || voices.find(voice => /^pt\b/i.test(voice.lang)) || null;
    current = { key, utterance };
    playing = true;
    heard.add(key);
    const complete = () => { if (current?.utterance === utterance) stop(); };
    utterance.onend = complete;
    utterance.onerror = complete;
    // A missing voice service must never hold the game clock indefinitely.
    timeout = setTimeout(complete, 20000);
    update();
    try { synth.speak(utterance); } catch { complete(); }
  }
  function mount(container, key, autoplay = true) {
    container.replaceChildren();
    if (!notes[key]) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.voiceNote = key;
    button.onclick = () => play(key);
    const status = document.createElement('small');
    status.className = 'voice-status';
    const transcript = document.createElement('p');
    transcript.className = 'voice-transcript';
    transcript.textContent = notes[key];
    container.append(button, status, transcript);
    update();
    if (autoplay && !heard.has(key)) play(key);
  }
  return {
    mount, stop,
    reset() { stop(); heard.clear(); },
    setMuted(value) { muted = value; if (muted) stop(); update(); },
    get playing() { return playing; }
  };
})();
