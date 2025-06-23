
const catalogContainer = document.getElementById('product-catalog');
const btnMostrarFiltros = document.getElementById('btnMostrarFiltros');
const sidebar = document.getElementById('sidebarFiltros');
const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');
const checkboxesTamanho = document.querySelectorAll('.size-filter');

const contadorCarrinho = document.getElementById('contadorCarrinho');
const totalCarrinhoSpan = document.getElementById('totalCarrinho');
const modalTotalCarrinho = document.getElementById('modalTotalCarrinho');
const listaCarrinho = document.getElementById('listaCarrinho');

let todosProdutos = [];
let carrinho = [];

// Alterna visibilidade do menu lateral
btnMostrarFiltros.addEventListener('click', () => {
  sidebar.classList.toggle('show');
});

// Atualiza preço em tempo real
priceRange.addEventListener('input', () => {
  priceValue.textContent = priceRange.value;
  aplicarFiltros();
});

// Atualiza produtos ao marcar/desmarcar tamanho
checkboxesTamanho.forEach(checkbox => {
  checkbox.addEventListener('change', aplicarFiltros);
});

// Mostra o modal do carrinho
const modalElement = document.getElementById('modalCarrinho');

modalElement.addEventListener('show.bs.modal', () => {
  atualizarModalCarrinho();

});

// Busca os produtos da API e adiciona tamanhos
async function fetchProducts() {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const products = await response.json();

    todosProdutos = products.map(prod => ({
      ...prod,
      tamanho: ['P', 'M', 'G'][Math.floor(Math.random() * 3)]
    }));

    renderProducts(todosProdutos);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    catalogContainer.innerHTML = '<p>Erro ao carregar produtos. Tente novamente mais tarde.</p>';
  }
}

// Aplica filtros de tamanho e preço
function aplicarFiltros() {
  const tamanhosSelecionados = Array.from(checkboxesTamanho)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  const precoMaximo = parseFloat(priceRange.value);

  const filtrados = todosProdutos.filter(produto => {
    const dentroDoPreco = produto.price <= precoMaximo;
    const dentroDoTamanho = tamanhosSelecionados.length === 0 || tamanhosSelecionados.includes(produto.tamanho);
    return dentroDoPreco && dentroDoTamanho;
  });

  renderProducts(filtrados);
}

// Renderiza produtos na tela
function renderProducts(products) {
  catalogContainer.innerHTML = '';

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'col';
    card.innerHTML = `
      <div class="card shadow-sm h-100">
        <img src="${product.image}" class="bd-placeholder-img card-img-top" style="object-fit: contain; height: 225px;" alt="${product.title}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text">${product.description.substring(0, 100)}...</p>
          <p><strong>Tamanho:</strong> ${product.tamanho}</p>
          <p><strong>Preço:</strong> R$ ${product.price.toFixed(2)}</p>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <button class="btn btn-sm btn-primary btn-comprar" data-id="${product.id}">Comprar</button>
          </div>
        </div>
      </div>
    `;
    catalogContainer.appendChild(card);
  });

  // Adiciona eventos aos botões "Comprar"
  document.querySelectorAll('.btn-comprar').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'));
      const produto = todosProdutos.find(p => p.id === id);
      if (produto) {
        adicionarAoCarrinho(produto);
      }
    });
  });
}

// Adiciona produto ao carrinho
function adicionarAoCarrinho(produto) {
  const existente = carrinho.find(item => item.id === produto.id);
  if (existente) {
    existente.quantidade += 1;
  } else {
    carrinho.push({ ...produto, quantidade: 1 });
  }
  atualizarCarrinho();
}

// Atualiza totais do carrinho (ícone e header)
function atualizarCarrinho() {
  let total = 0;
  let quantidadeTotal = 0;

  carrinho.forEach(item => {
    total += item.price * item.quantidade;
    quantidadeTotal += item.quantidade;
  });

  totalCarrinhoSpan.textContent = total.toFixed(2);
  modalTotalCarrinho.textContent = total.toFixed(2);
  contadorCarrinho.textContent = quantidadeTotal;
}

// Atualiza conteúdo do modal do carrinho
function atualizarModalCarrinho() {
  listaCarrinho.innerHTML = '';

  if (carrinho.length === 0) {
    listaCarrinho.innerHTML = '<p>Seu carrinho está vazio.</p>';
    return;
  }

  carrinho.forEach(item => {
    const div = document.createElement('div');
    div.className = "d-flex justify-content-between align-items-center border-bottom py-2";
    div.innerHTML = `
      <div class="d-flex align-items-center gap-3">
        <img src="${item.image}" alt="${item.title}" width="50">
        <div>
          <strong>${item.title}</strong><br>
          R$ ${item.price.toFixed(2)} x ${item.quantidade}
        </div>
      </div>
      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-sm btn-outline-secondary" onclick="alterarQuantidade(${item.id}, -1)">-</button>
        <span>${item.quantidade}</span>
        <button class="btn btn-sm btn-outline-secondary" onclick="alterarQuantidade(${item.id}, 1)">+</button>
      </div>
    `;
    listaCarrinho.appendChild(div);
  });
}

// Altera quantidade de um item no carrinho
function alterarQuantidade(id, delta) {
  const item = carrinho.find(p => p.id === id);
  if (!item) return;

  item.quantidade += delta;
  if (item.quantidade <= 0) {
    carrinho = carrinho.filter(p => p.id !== id);
  }

  atualizarCarrinho();
  atualizarModalCarrinho();
}

// Inicializa carregamento
fetchProducts();

document.getElementById('inputBusca').addEventListener('input', (e) => {
  const termo = e.target.value.toLowerCase();
  const filtrados = todosProdutos.filter(prod => prod.title.toLowerCase().includes(termo));
  renderProducts(filtrados);
});
