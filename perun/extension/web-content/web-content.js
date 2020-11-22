if(typeof browser == 'undefined') {
    var browser = chrome
}
const apiUrl = chrome.runtime.getManifest().api
class IpcRequest {
  constructor (name, data) {
    this.name = name
		this.data = data
  }
}

const handleWebContent = () => {
  console.log(document.body)
  fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify({
      msg: 'Hello',
    }),
  }).then(res => {
    return res.json()
  }).then(data => {
    alert(data.msg)
  })
}

if(document && (document.readyState == 'complete' || document.readyState == 'loaded')) {
  handleWebContent()
} else {
  window.addEventListener('DOMContentLoaded', () => {
    handleWebContent()
  })
}
