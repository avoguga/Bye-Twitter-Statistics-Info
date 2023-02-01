// Start script
let twitterScriptObserver = null;

const twitterScript = () => {
  console.log("Twitter script started");
  let body = document.body;
  let views = document.querySelectorAll('[aria-label*="Exibir estatísticas do Tweet"]');
  views.forEach((view) => {
    view.parentElement.remove();
  });

  twitterScriptObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      let addedNodes = mutation.addedNodes;

      for (let i = 0; i < addedNodes.length; i++) {
        let node = addedNodes[i];
        let views = node.querySelectorAll('[aria-label*="Exibir estatísticas do Tweet"]');
        views.forEach((view) => view.parentElement.remove());
      }
    });
  });

  twitterScriptObserver.observe(body, { childList: true, subtree: true });
};

// Stop script
const stopTwitterScript = () => {
  console.log("Twitter script stopped");
  if (twitterScriptObserver) {
    twitterScriptObserver.disconnect();
    twitterScriptObserver = null;
  }
};
