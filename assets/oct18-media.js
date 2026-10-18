document.addEventListener('click', event => {
  const button = event.target.closest('button[data-official-video]');
  if (!button) return;
  const url = new URL(button.dataset.officialVideo);
  if (url.protocol !== 'https:' || !['www.youtube-nocookie.com','www.youtube.com'].includes(url.hostname) || !url.pathname.startsWith('/embed/')) return;
  const frame = document.createElement('iframe');
  frame.src = url.href;
  frame.title = button.dataset.title || '공식 제공 영상';
  frame.allow = 'accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen';
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  frame.allowFullscreen = true;
  button.replaceWith(frame);
});
