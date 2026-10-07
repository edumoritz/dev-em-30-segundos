// Flow long rounds into viewport-sized columns with explicit page navigation.
(() => {
  const content = document.getElementById('content');
  const viewport = document.createElement('div');
  viewport.className = 'game-viewport';
  content.before(viewport);
  viewport.append(content);
  const navigation = document.createElement('nav');
  navigation.className = 'game-pagination';
  navigation.setAttribute('aria-label', 'Páginas desta etapa');
  navigation.innerHTML = '<button class="quiet" id="previousPage">Anterior</button><span class="page-count" aria-live="polite"></span><button class="quiet" id="nextPage">Próxima</button>';
  viewport.after(navigation);
  const previous = navigation.querySelector('#previousPage');
  const next = navigation.querySelector('#nextPage');
  const count = navigation.querySelector('.page-count');
  let page = 0, pages = 1, stride = 0, frame;
  function showPage(value) {
    page = Math.max(0, Math.min(value, pages - 1));
    content.style.transform = `translateX(${-page * stride}px)`;
    previous.disabled = page === 0;
    next.disabled = page === pages - 1;
    count.textContent = `${page + 1} / ${pages}`;
  }
  function layout() {
    if (!viewport.clientWidth || !viewport.clientHeight) return;
    // Reserve navigation space consistently, avoiding pagination/height loops.
    const width = viewport.clientWidth;
    stride = width + 32;
    content.style.setProperty('--page-width', `${width}px`);
    content.style.transform = 'none';
    pages = Math.max(1, Math.ceil((content.scrollWidth + 32) / stride));
    navigation.hidden = pages === 1;
    // Showing navigation can reduce the column height and create more pages.
    pages = Math.max(1, Math.ceil((content.scrollWidth + 32) / stride));
    showPage(page);
    const focused = document.activeElement;
    if (content.contains(focused)) reveal(focused);
  }
  function schedule(reset = false) {
    if (reset) page = 0;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(layout);
  }
  function reveal(element) {
    if (!stride) return;
    const offset = element.getBoundingClientRect().left - content.getBoundingClientRect().left;
    showPage(Math.floor(Math.max(0, offset) / stride));
  }
  previous.onclick = () => showPage(page - 1);
  next.onclick = () => showPage(page + 1);
  content.addEventListener('focusin', event => reveal(event.target));
  new MutationObserver(records => schedule(records.some(record => record.target === content))).observe(content, {childList: true, subtree: true});
  new MutationObserver(() => schedule(true)).observe(document.getElementById('game'), {attributes: true, attributeFilter: ['hidden']});
  new ResizeObserver(() => schedule()).observe(viewport);
  content.addEventListener('load', () => schedule(), true);
  window.addEventListener('resize', () => schedule());
  schedule();
})();
