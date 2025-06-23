document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');

  form.addEventListener('submit', function (event) {
    event.preventDefault(); 

    const dados = {
      nome: document.getElementById('firstName').value,
      sobrenome: document.getElementById('lastName').value,
      usuario: document.getElementById('username').value,
      email: document.getElementById('email').value,
      endereco: document.getElementById('address').value,
      complemento: document.getElementById('address2').value,
      pais: document.getElementById('country').value,
      estado: document.getElementById('state').value,
      cep: document.getElementById('zip').value,
      enderecoEntregaIgual: document.getElementById('same-address').checked,
      salvarInfo: document.getElementById('save-info').checked,
      pagamento: document.querySelector('input[name="paymentMethod"]:checked').id,
      nomeCartao: document.getElementById('cc-name').value,
      numeroCartao: document.getElementById('cc-number').value,
      validade: document.getElementById('cc-expiration').value,
      cvv: document.getElementById('cc-cvv').value
    };

    
    localStorage.setItem('dadosPagamento', JSON.stringify(dados));

    alert("Compra Efetuada com sucesso!");
        form.reset();
        botao.disabled = true;

  });
});
