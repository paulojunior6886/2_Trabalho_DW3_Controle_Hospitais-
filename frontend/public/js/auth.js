// Verifica se o usuário está autenticado
function verificarAutenticacao() {
  const autenticado = document.cookie
    .split(";")
    .some((cookie) => cookie.trim() === "IsLogged=true");

  const token = localStorage.getItem("token");

  if (!autenticado || !token) {
    window.location.replace("/login");
    return false;
  }

  return true;
}

// Armazena os dados após o login
function salvarAutenticacao(token, username) {
  localStorage.setItem("token", token);
  localStorage.setItem("username", username);

  document.cookie = "IsLogged=true; path=/; SameSite=Lax";
}

// Limpa os dados de autenticação
function limparAutenticacao() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");

  document.cookie = "IsLogged=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

// Monta os cabeçalhos das requisições à API
function montarHeadersAutenticacao(headers = {}) {
  const token = localStorage.getItem("token");

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function realizarLogout() {
  limparAutenticacao();
  window.location.replace("/login");
}

// Realiza chamadas à API autenticada com o JWT
async function Api(caminho, opcoes = {}) {
  const backendUrl =
    document.body.dataset.api || "http://localhost:40000";

  const headers = montarHeadersAutenticacao({
    ...(opcoes.headers || {}),
  });

  const resposta = await fetch(backendUrl + caminho, {
    ...opcoes,
    headers: headers,
  });

  const dados = await resposta.json().catch(() => ({}));

  if (dados.auth === false) {
    limparAutenticacao();
    window.location.replace("/login");
    throw new Error(dados.message || "Sessão expirada.");
  }

  if (!resposta.ok || dados.status === "erro") {
    throw new Error(dados.mensagem || dados.message || "Erro na operação.");
  }

  return dados;
}
