// Load third-party video only after an explicit reader click; keep the source link visible.
document.addEventListener('click', event => {
  const button = event.target instanceof Element ? event.target.closest('.oct24-video-play') : null;
  if (!button) return;
  const panel = button.closest('.oct24-video[data-video-id]');
  const id = panel?.dataset.videoId;
  if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) return;
  const frame = document.createElement('iframe');
  frame.src = `https://www.youtube-nocookie.com/embed/${id}`;
  frame.title = panel.dataset.videoTitle || 'YouTube 원본 영상';
  frame.width = '560';
  frame.height = '315';
  frame.allow = 'encrypted-media; picture-in-picture; fullscreen';
  frame.allowFullscreen = true;
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  button.replaceWith(frame);
});
