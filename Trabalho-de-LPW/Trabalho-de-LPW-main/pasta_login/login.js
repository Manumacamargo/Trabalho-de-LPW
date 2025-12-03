const titulo = document.getElementById("titulo");
const btnAcao = document.getElementById("btnAcao");
const toggle = document.getElementById("toggle");
const mensagem = document.getElementById("mensagem");

let modoLogin = true;

toggle.addEventListener("click", () => {
    modoLogin = !modoLogin;
    if (modoLogin) {
        titulo.textContent = "Login";
        btnAcao.textContent = "Entrar";
        toggle.textContent = "Não tem conta? Cadastre-se";
        mensagem.textContent = "";
    } else {
        titulo.textContent = "Cadastro";
        btnAcao.textContent = "Cadastrar";
        toggle.textContent = "Já tem conta? Fazer login";
        mensagem.textContent = "";
    }
});

function redirecionarPagina() {
    // Sai da pasta_login (..) e entra na pasta_home
    window.location.href = "../pasta_home/index.html"; 
}

btnAcao.addEventListener("click", () => {
    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!usuario || !senha) {
        mensagem.textContent = "Preencha todos os campos!";
        mensagem.style.color = "#854F6C"; // Cor Vinho
        return;
    }

    if (modoLogin) {
        // LOGIN
        const userData = JSON.parse(localStorage.getItem("usuarios")) || {};
        if (userData[usuario] && userData[usuario] === senha) {
            mensagem.style.color = "#2B124C"; // Roxo
            mensagem.textContent = "Login bem-sucedido!";
            setTimeout(() => {
                redirecionarPagina();
            }, 500);
        } else {
            mensagem.style.color = "red";
            mensagem.textContent = "Usuário ou senha incorretos!";
        }
    } else {
        // CADASTRO
        const userData = JSON.parse(localStorage.getItem("usuarios")) || {};
        if (userData[usuario]) {
            mensagem.textContent = "Usuário já existe!";
            return;
        }
        userData[usuario] = senha;
        localStorage.setItem("usuarios", JSON.stringify(userData));
        mensagem.style.color = "green";
        mensagem.textContent = "Cadastro realizado! Faça login.";
        setTimeout(() => {
            modoLogin = true;
            titulo.textContent = "Login";
            btnAcao.textContent = "Entrar";
            toggle.textContent = "Não tem conta? Cadastre-se";
        }, 1000);
    }
});