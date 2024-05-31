let userName = document.querySelector('.name-value')
let button = document.querySelector('.btn')
const form = document.querySelector('.form');


document.addEventListener('DOMContentLoaded', () => {
  checkToken();
});

button.addEventListener('click',(e)=>{
  let userNameValue = userName.value
  e.preventDefault()
  authenticate(userNameValue);
})




//Função para verificar se o token existe
function checkToken() {
  const token = localStorage.getItem('token');
  if (token) {
    console.log('Token encontrado:', token);
    form.classList.add('on')
  } else {
    console.log('Nenhum token encontrado.');
    form.classList.remove('on')
  }
}

// Função para autenticar e salvar o token do usuário no chrome.storage
async function authenticate(userNameValue) {
  const userData = {
    nome: userNameValue,
  };
  try {
    const response = await fetch('http://localhost:3000/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    if (!response.ok) {
      throw new Error('Erro na resposta da rede');
    }
    const data = await response.json();
    
    // Salvar o token no chrome.storage
    localStorage.setItem('token',data.accessToken)
    chrome.storage.local.set({ 'token': data.accessToken }, () => {
      console.log('Token salvo com sucesso:', data.accessToken);
    });
    form.classList.add('on')
    // Atualizar a interface do usuário, se necessário
  } catch (error) {
    console.error('Erro ao salvar o token:', error);
  }
}






















/*
// Dados que você deseja enviar no corpo da solicitação (formatado como JSON)


// Fazer a solicitação POST para uma URL com os dados no corpo da solicitação
fetch('https://api.example.com/data', {
  method: 'POST', // Método da solicitação
  headers: {
    'Content-Type': 'application/json' // Tipo de conteúdo do corpo da solicitação
  },
  body: JSON.stringify(postData) // Corpo da solicitação (convertido para JSON)
})
.then(response => response.json()) // Converte a resposta para JSON
.then(data => console.log(data)) // Manipula os dados recebidos
.catch(error => console.error('Ocorreu um erro:', error)); // Manipula os erros



localStorage.setItem('userName', userName.value);
// Recupera o valor do Local Storage
const username = localStorage.getItem('userName');
console.log(username); // Exibe o valor no console*/