(() => {
  "use strict";

  const article = document.querySelector("article.article");

  if (!article) {
    return;
  }

  const pageUrl = `${window.location.origin}${window.location.pathname}`;
  const pageTitle = document.querySelector("h1")?.textContent?.trim() || document.title;
  const pageDescription = document.querySelector('meta[name="description"]')?.content?.trim() || "";

  function createButton({ className, label, mark, action }) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `share-button ${className}`;
    button.dataset.shareAction = action;
    button.setAttribute("aria-label", label);
    button.innerHTML = `<span class="share-button__mark" aria-hidden="true">${mark}</span><span>${label}</span>`;
    return button;
  }

  function ensureShareSection(comments) {
    if (article.querySelector(".article-share")) {
      return;
    }

    const section = document.createElement("section");
    section.className = "article-share";
    section.setAttribute("aria-labelledby", "article-share-title");

    const copy = document.createElement("div");
    copy.className = "article-share__copy";
    copy.innerHTML = `
      <p class="eyebrow">Share this article</p>
      <h2 id="article-share-title">이 글을 다른 사람과 나누기</h2>
      <p>Facebook은 바로 열립니다. 카카오톡과 Instagram은 휴대폰 공유 메뉴에서 앱을 선택하거나 복사한 링크를 붙여넣을 수 있습니다.</p>
    `;

    const actions = document.createElement("div");
    actions.className = "share-actions";
    actions.append(
      createButton({ className: "share-button--kakao", label: "카카오톡", mark: "K", action: "kakao" }),
      createButton({ className: "share-button--facebook", label: "Facebook", mark: "f", action: "facebook" }),
      createButton({ className: "share-button--instagram", label: "Instagram", mark: "◎", action: "instagram" }),
      createButton({ className: "share-button--copy", label: "링크 복사", mark: "↗", action: "copy" }),
    );

    const status = document.createElement("p");
    status.className = "share-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");

    section.append(copy, actions, status);

    if (comments) {
      comments.before(section);
    } else {
      article.append(section);
    }
  }

  function ensureComments() {
    let comments = article.querySelector(".comments-shell");

    if (!comments) {
      comments = document.createElement("section");
      comments.className = "comments-shell";
      comments.setAttribute("aria-labelledby", "comments-title");
      comments.innerHTML = `
        <p class="eyebrow">Comments</p>
        <h2 id="comments-title">댓글</h2>
      `;
      article.append(comments);
    }

    if (!comments.querySelector(".comments-note")) {
      const note = document.createElement("p");
      note.className = "comments-note";
      note.innerHTML = "현재 댓글 작성에는 <strong>GitHub 로그인</strong>이 필요합니다. 카카오 로그인 댓글은 별도 계정·저장 시스템을 연결하면 제공할 수 있습니다.";
      comments.querySelector("h2")?.after(note);
    }

    if (!comments.querySelector('script[src*="utteranc.es"]') && !comments.querySelector(".utterances")) {
      const script = document.createElement("script");
      script.src = "https://utteranc.es/client.js";
      script.setAttribute("repo", "korea333333-web/korea333333-web.github.io");
      script.setAttribute("issue-term", "pathname");
      script.setAttribute("theme", "github-light");
      script.setAttribute("crossorigin", "anonymous");
      script.async = true;
      comments.append(script);
    }

    return comments;
  }

  async function copyLink(status, message = "링크를 복사했습니다.") {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(pageUrl);
      } else {
        const input = document.createElement("textarea");
        input.value = pageUrl;
        input.setAttribute("readonly", "");
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.append(input);
        input.select();
        document.execCommand("copy");
        input.remove();
      }
      status.textContent = message;
    } catch {
      status.textContent = "링크 복사에 실패했습니다. 브라우저 주소를 직접 복사해 주세요.";
    }
  }

  async function openNativeShare(preferredApp, status) {
    if (!navigator.share) {
      await copyLink(status, `링크를 복사했습니다. ${preferredApp}에 붙여넣어 주세요.`);
      return;
    }

    try {
      await navigator.share({
        title: pageTitle,
        text: pageDescription,
        url: pageUrl,
      });
      status.textContent = `${preferredApp}을 포함한 휴대폰 공유 메뉴를 열었습니다.`;
    } catch (error) {
      if (error?.name !== "AbortError") {
        await copyLink(status, `공유 메뉴를 열지 못해 링크를 복사했습니다. ${preferredApp}에 붙여넣어 주세요.`);
      }
    }
  }

  function openFacebook(status) {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
    const popup = window.open(shareUrl, "facebook-share", "width=680,height=720,noopener,noreferrer");

    if (popup) {
      popup.opener = null;
      status.textContent = "Facebook 공유 창을 열었습니다.";
    } else {
      status.textContent = "팝업이 차단됐습니다. 링크 복사 버튼을 이용해 주세요.";
    }
  }

  const comments = ensureComments();
  ensureShareSection(comments);

  const shareSection = article.querySelector(".article-share");
  const status = shareSection?.querySelector(".share-status");

  shareSection?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-share-action]");

    if (!button || !status) {
      return;
    }

    const action = button.dataset.shareAction;

    if (action === "facebook") {
      openFacebook(status);
    } else if (action === "copy") {
      await copyLink(status);
    } else if (action === "kakao") {
      await openNativeShare("카카오톡", status);
    } else if (action === "instagram") {
      await openNativeShare("Instagram", status);
    }
  });
})();
