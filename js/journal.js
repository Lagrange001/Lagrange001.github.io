/* Load Waline only when its section approaches the viewport. */
(() => {
  'use strict';
  const configElement = document.getElementById('journal-waline-config');
  if (!configElement) return;
  const config = JSON.parse(configElement.textContent);
  const status = document.getElementById('journal-comment-status');
  const retry = document.getElementById('journal-comment-retry');
  let loading = false;
  let ready = false;
  let clientPromise;

  function loadClient() {
    if (window.Waline) return Promise.resolve();
    if (clientPromise) return clientPromise;
    const base = config.assetBase.replace(/\/$/, '') + '/';
    if (!document.querySelector('link[data-journal-waline]')) {
      const css = document.createElement('link');
      css.rel = 'stylesheet'; css.href = base + 'waline.css'; css.dataset.journalWaline = '';
      document.head.appendChild(css);
    }
    clientPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const timer = setTimeout(() => { script.remove(); reject(new Error('Client timeout')); }, 15000);
      script.src = base + 'waline.js'; script.async = true;
      script.onload = () => { clearTimeout(timer); window.Waline ? resolve() : reject(new Error('Client unavailable')); };
      script.onerror = () => { clearTimeout(timer); script.remove(); reject(new Error('Client unavailable')); };
      document.head.appendChild(script);
    }).catch(error => { clientPromise = null; throw error; });
    return clientPromise;
  }

  async function connect() {
    if (loading || ready) return;
    loading = true; retry.hidden = true; status.hidden = false;
    status.textContent = '正在连接留言区…';
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
      const endpoint = new URL(config.options.serverURL.replace(/\/$/, '') + '/api/comment');
      endpoint.search = new URLSearchParams({ path: window.location.pathname, pageSize: '1', page: '1', lang: 'zh-CN' });
      const response = await fetch(endpoint, { signal: controller.signal, credentials: 'omit' });
      const data = await response.json();
      if (!response.ok || data.errno !== 0) throw new Error('Comment server unavailable');
      clearTimeout(timer);
      await loadClient();
      window.Waline.init({ ...config.options, el: '#waline', path: window.location.pathname,
        locale: { placeholder: '欢迎留下你的想法。昵称必填，邮箱仅用于回复通知（选填）。' } });
      ready = true; status.hidden = true;
    } catch (_) {
      status.textContent = '留言服务暂时无法连接，请稍后重试。';
      retry.hidden = false;
    } finally { clearTimeout(timer); loading = false; }
  }
  retry.addEventListener('click', connect);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); connect(); }
    }, { rootMargin: '400px' });
    observer.observe(document.getElementById('comments'));
  } else { connect(); }
})();
