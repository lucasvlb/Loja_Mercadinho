document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("floatingInput").value;
    const password = document.getElementById("floatingPassword").value;
    const remember = document.getElementById("checkDefault").checked;

    if (remember) {
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
    } else {
      localStorage.removeItem("email");
      localStorage.removeItem("password");
    }

    alert("Login salvo com sucesso!");
    window.location.href = "./loja.html"; 
  });

  
  const savedEmail = localStorage.getItem("email");
  const savedPassword = localStorage.getItem("password");

  if (savedEmail && savedPassword) {
    document.getElementById("floatingInput").value = savedEmail;
    document.getElementById("floatingPassword").value = savedPassword;
    document.getElementById("checkDefault").checked = true;
  }
});
