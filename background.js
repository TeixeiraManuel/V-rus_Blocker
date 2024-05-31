// Variável para armazenar a URL e o tipo de URL
let siteUrl = '';
let previousUrl = '';
let tipeUrl = null;
let tokenExists = false; // Inicialmente, assumimos que o token não existe

// Função para obter dados do armazenamento local
function obterDadosDoLocalStorage(chave) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(chave, (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result[chave] || null); // Use null como padrão se a chave não for encontrada
      }
    });
  });
}

// Função para definir dados no armazenamento local
function definirDadosNoLocalStorage(chave, valor) {
  return new Promise((resolve, reject) => {
    let data = {};
    data[chave] = valor;
    chrome.storage.local.set(data, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

// Verificar se o token existe ao iniciar a extensão
async function inicializar() {
  try {
    const token = await obterDadosDoLocalStorage('token');
    if (token) {
      tokenExists = true; // Se o token existe, definimos como true
      console.log('Token encontrado na inicialização:', token);
    }
  } catch (error) {
    console.error('Erro ao verificar se o token existe:', error);
  }
}

inicializar();

// Listener para o evento onBeforeNavigate
chrome.webNavigation.onBeforeNavigate.addListener(async function(details) {
  // Armazenar a URL do site
  previousUrl = siteUrl;
  siteUrl = details.url;

  // Ignorar URLs específicas e páginas internas do Chrome
  const ignoredUrls = [
    "https://www.bing.com/chrome/newtab",
    "chrome://extensions/",
    "chrome://new-tab-page-third-party/",
    "popup/security.html",
    "popup/alert.html"
  ];

  if (ignoredUrls.some(ignoredUrl => siteUrl.startsWith(ignoredUrl))) {
    return;
  } else {
    try {
      // Verificar se a URL já foi verificada
      let verificados = await obterDadosDoLocalStorage('verificados') || [];
      if (!verificados.includes(siteUrl)) {
        // Adicionar a URL à lista de verificadas
        verificados.push(siteUrl);
        await definirDadosNoLocalStorage('verificados', verificados);

        // Armazenar a URL capturada no chrome.storage.local
        await definirDadosNoLocalStorage('siteUrl', siteUrl);

        // Armazenar a URL anterior no chrome.storage.local
        await definirDadosNoLocalStorage('previousUrl', previousUrl);

        // Se o token existe, verificar a URL e redirecionar
        if (tokenExists) {
          const token = await obterDadosDoLocalStorage('token');
          if (token) {
            console.log('Token encontrado:', token);
            // Verificar a URL e redirecionar
            await verifyUrl(token);
            if (tipeUrl == 0) {
              return
            } else {
              chrome.tabs.update(details.tabId, { url: 'popup/alert.html' });
            }
          } else {
            console.log('Token vazio.');
          }
        }
      }
    } catch (error) {
      console.error('Erro ao processar URL:', error);
    }
  }
  console.log("URL:", siteUrl);
});

// Listener para o evento onCommitted para lidar com a navegação
chrome.webNavigation.onCommitted.addListener(async function(details) {
  if (details.transitionType === 'back_forward') {
    const previousUrl = await obterDadosDoLocalStorage('previousUrl');
    if (previousUrl && details.url === previousUrl) {
      console.log('Usuário navegou de volta para a URL anterior:', previousUrl);
      // Remover a URL anterior da lista de verificados para evitar redirecionamento contínuo
      let verificados = await obterDadosDoLocalStorage('verificados') || [];
      verificados = verificados.filter(url => url !== previousUrl);
      await definirDadosNoLocalStorage('verificados', verificados);
    }
  }
});

// Listener para mensagens da extensão
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  // Verificar se a mensagem é para obter a URL do site
  if (message.getSiteUrl) {
    // Enviar a URL do site
    sendResponse({ siteUrl: siteUrl });
  }

  // Verificar se a mensagem é para continuar navegação
  if (message.continueNavigation) {
    let verificados = await obterDadosDoLocalStorage('verificados') || [];
    // Adicionar a URL à lista de verificadas
    if (!verificados.includes(message.url)) {
      verificados.push(message.url);
      await definirDadosNoLocalStorage('verificados', verificados);
    }
    // Redirecionar para a URL original
    chrome.tabs.update(sender.tab.id, { url: message.url });
  }
});

// Função para verificar a URL
async function verifyUrl(value) {
  let linkData = {
    accessToken: value,
    nome: 'default',
    url: siteUrl
  };    
  try {
    let response = await fetch('http://localhost:3000/sites/cadastrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(linkData)
    });
    if (!response.ok) {
      throw new Error('Erro na resposta da rede');
    }
    const data = await response.json();
    tipeUrl = data.seguro;
  } catch (error) {
    console.error('Erro ao verificar URL:', error);
  }
}
