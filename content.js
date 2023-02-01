const toggleValue = localStorage.getItem("toggleValue");

let twitterScriptObserver = null;

const twitterScript = () => {
  console.log("Twitter script started");
  let body = document.body;
  let views = document.querySelectorAll(
    '[aria-label*="estatísticas do Tweet"]'
  );
  views.forEach((view) => {
    view.parentElement.remove();
  });

  twitterScriptObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      let addedNodes = mutation.addedNodes;

      for (let i = 0; i < addedNodes.length; i++) {
        let node = addedNodes[i];
        let views = node.querySelectorAll(
          '[aria-label*="estatísticas do Tweet"]'
        );
        views.forEach((view) => view.parentElement.remove());
      }
    });
  });
  localStorage.setItem("toggleValue", "checked");
  twitterScriptObserver.observe(body, { childList: true, subtree: true });
};

// Stop script
const stopTwitterScript = () => {
  console.log("Twitter script stopped");
  localStorage.setItem("toggleValue", "unchecked");
  if (twitterScriptObserver) {
    twitterScriptObserver.disconnect();
    twitterScriptObserver = null;
  }
};

if (toggleValue === "checked") {
  twitterScript();
} else {
  stopTwitterScript();
}
