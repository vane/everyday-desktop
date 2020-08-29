if(typeof browser == "undefined") {
    var browser = chrome;
}

const handleWebContent = () => {
  console.log(document.body);
}

if(document && (document.readyState == "complete" || document.readyState == "loaded")) {
  handleWebContent();
} else {
  window.addEventListener('DOMContentLoaded', function () {
    handleWebContent();
  });
}
