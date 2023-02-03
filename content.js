const toggleValue = localStorage.getItem("toggleValue");
let twitterScriptObserver = null;

const removeTweetViews = () => {
  const views = document.querySelectorAll('[aria-label*="estatísticas do Tweet"]');
  const viewsEn = document.querySelectorAll('[aria-label*="Tweet analytics"]');
  views.forEach(view => view.parentElement.remove());
  viewsEn.forEach(view => view.parentElement.remove());
};

const startTwitterScript = () => {
  console.log("Twitter script started");
  removeTweetViews();
  twitterScriptObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => removeTweetViews());
    });
  });
  localStorage.setItem("toggleValue", "checked");
  twitterScriptObserver.observe(document.body, { childList: true, subtree: true });
};

const stopTwitterScript = () => {
  console.log("Twitter script stopped");
  localStorage.setItem("toggleValue", "unchecked");
  if (twitterScriptObserver) {
    twitterScriptObserver.disconnect();
    twitterScriptObserver = null;
  }
};

if (toggleValue === "checked") {
  startTwitterScript();
} else {
  stopTwitterScript();
}
