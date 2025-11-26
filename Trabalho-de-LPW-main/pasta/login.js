const titulo = document.getElementById("titulo");
    const btnAcao = document.getElementById("btnAcao");
    const toggle = document.getElementById("toggle");
    const mensagem = document.getElementById("mensagem");

    let modoLogin = true; // true = login | false = cadastro

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
      window.location.href = "index.html"; // Substitua pelo URL da página desejada
    }

    btnAcao.addEventListener("click", () => {
      const usuario = document.getElementById("usuario").value.trim();
      const senha = document.getElementById("senha").value.trim();

      if (!usuario || !senha) {
        mensagem.textContent = "Preencha todos os campos!";
        return;
      } 

      if (modoLogin) {
        // LOGIN
        const userData = JSON.parse(localStorage.getItem("usuarios")) || {};
        if (userData[usuario] && userData[usuario] === senha) {
          mensagem.style.color = "#0f0";
          mensagem.textContent = "Login bem-sucedido!";
          setTimeout(() => {
            alert("Bem-vindo, " + usuario + "!");
          }, 500);

          redirecionarPagina();

        }
        
        else {
          mensagem.style.color = "#ff8080";
          mensagem.textContent = "Usuário ou senha incorretos!";
        }
      }
      
      else {
        // CADASTRO
        const userData = JSON.parse(localStorage.getItem("usuarios")) || {};
        if (userData[usuario]) {
          mensagem.textContent = "Usuário já existe!";
          return;
        }
        userData[usuario] = senha;
        localStorage.setItem("usuarios", JSON.stringify(userData));
        mensagem.style.color = "#0f0";
        mensagem.textContent = "Cadastro realizado! Faça login.";
        setTimeout(() => {
          modoLogin = true;
          titulo.textContent = "Login";
          btnAcao.textContent = "Entrar";
          toggle.textContent = "Não tem conta? Cadastre-se";
        }, 500);
      }
    });