/* Public pageviews and site visitors. Preview traffic must not inflate totals. */
(() => {
  'use strict';
  function init() {
    const local = ['localhost', '127.0.0.1', '::1', '[::1]'].includes(location.hostname) || location.protocol === 'file:';
    ['page_pv', 'site_pv', 'site_uv'].forEach(kind => {
      const container = document.getElementById('busuanzi_container_' + kind);
      const value = document.getElementById('busuanzi_value_' + kind);
      if (!container || !value) return;
      value.textContent = '—'; container.style.display = 'inline';
      container.title = local ? '本地预览不计数；发布后显示真实统计。' : '统计正在加载；横线表示暂未取得数据。';
    });
    if (local) return;
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
    document.head.appendChild(script);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
