(() => {
  'use strict';
  for (const button of document.querySelectorAll('.prompt-copy[data-copy]')) {
    const target = document.querySelector(button.dataset.copy);
    if (!target) continue;
    const status = document.createElement('span');
    status.className = 'copy-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    (button.closest('.prompt-box,.prompt-block') || button.parentElement).append(status);
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(target.textContent);
        status.textContent = '입력문을 복사했습니다. Gemini 입력창에 붙여 넣으세요.';
      } catch {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(target);
        selection.removeAllRanges();
        selection.addRange(range);
        status.textContent = '자동 복사가 제한되어 글을 선택했습니다. Ctrl+C 또는 길게 눌러 복사하세요.';
      }
    });
  }
})();
