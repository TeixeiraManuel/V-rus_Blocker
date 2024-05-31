/*Este código será executado quando o popup.html for aberto

//// Atualiza o elemento de exibição da URL com a URL atual
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var currentUrl = tabs[0].url;
    var currentTile = tabs[0].title;
    document.getElementById('urlDisplay').textContent += currentUrl +currentTile;
  });
  */