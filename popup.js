// Start script

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

const toggleCheckbox = document.querySelector("#toggle-checkbox");
const message = document.querySelector("#message");

toggleCheckbox.addEventListener("change", async function () {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (toggleCheckbox.checked) {
    message.textContent = "Bye";

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: twitterScript,
    });
  } else {
    message.textContent = "Hello again";
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: stopTwitterScript,
    });
  }
});

// Check the saved value from local storage
const toggleValue = localStorage.getItem("toggleValue");
if (toggleValue === "checked") {
  toggleCheckbox.checked = true;
  message.textContent = "Bye";
} else {
  toggleCheckbox.checked = false;
  message.textContent = "Hello again";
}

// Check if the tab is loaded and if the checkbox is checked

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  console.log(tabs[0].status)
  if (tabs[0].status === "complete" && toggleValue === "checked") {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: twitterScript,
    });
  }
});