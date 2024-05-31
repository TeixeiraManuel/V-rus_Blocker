/*
document.addEventListener('DOMContentLoaded', function() {
  const button = document.getElementById('continue-button');

  // Função para obter dados do armazenamento local
  function obterDadosDoLocalStorage(chave) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(chave, (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result[chave] || null); // Use null as default if key not found
        }
      });
    });
  }

  // Obter a URL capturada
  obterDadosDoLocalStorage('siteUrl').then((siteUrl) => {
    if (siteUrl) {
      // Adicionar evento de clique ao botão
      button.addEventListener('click', () => {
        // Enviar mensagem ao background script para continuar a navegação
        chrome.runtime.sendMessage({ continueNavigation: true, url: siteUrl });
      });
    }
  }).catch((error) => {
    console.error('Erro ao obter a URL:', error);
  });
});

*/