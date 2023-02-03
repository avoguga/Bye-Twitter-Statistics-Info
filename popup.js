let twitterScriptObserver = null;

const getToggleValue = () => {
  return localStorage.getItem("toggleValue");
};

const setToggleCheckedItem = () => {
  localStorage.setItem("toggleValue", "checked");
};

const setToggleUncheckedItem = () => {
  localStorage.setItem("toggleValue", "unchecked");
};

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
  twitterScriptObserver.observe(document.body, { childList: true, subtree: true });
};

const stopTwitterScript = () => {
  console.log("Twitter script stopped");
  if (twitterScriptObserver) {
    twitterScriptObserver.disconnect();
    twitterScriptObserver = null;
  }
};


const toggleCheckbox = document.querySelector("#toggle-checkbox");
const message = document.querySelector("#message");

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  toggleCheckbox.addEventListener("change", async function () {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (toggleCheckbox.checked) {
      message.textContent = "Bye";

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: startTwitterScript,
      });
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: setToggleCheckedItem,
      });
    } else {
      message.textContent = "Hello again";
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: stopTwitterScript,
      });
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: setToggleUncheckedItem,
      });
    }
  });

  chrome.scripting
    .executeScript({
      target: { tabId: tabs[0].id },
      function: getToggleValue,
    })
    .then((result) => {
      const toggleValue = result[0].result;
      if (toggleValue === "checked") {
        toggleCheckbox.checked = true;
        message.textContent = "Bye";
      } else {
        toggleCheckbox.checked = false;
        message.textContent = "Hello again";
      }
    });
});
