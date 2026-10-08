// One scrollable scene keeps messages and controls in their reading order.
(() => {
  const content = document.getElementById('content');
  const viewport = document.createElement('div');
  viewport.className = 'game-viewport';
  viewport.setAttribute('role', 'region');
  viewport.setAttribute('aria-label', 'Etapa atual do desafio');
  content.before(viewport);
  viewport.append(content);
  new MutationObserver(records => {
    if (records.some(record => record.target === content && record.type === 'childList')) {
      viewport.scrollTop = 0;
    }
  }).observe(content, {childList: true});
  content.addEventListener('focusin', event => {
    const box = viewport.getBoundingClientRect();
    const target = event.target.getBoundingClientRect();
    if (target.top < box.top || target.bottom > box.bottom) {
      event.target.scrollIntoView({block: 'nearest', inline: 'nearest'});
    }
  });
})();
