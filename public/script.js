// Função para carregar produtos e exibir na página
window.onload = function() {
  // Fazendo a requisição para buscar os produtos no servidor
  fetch('/produtos')
    .then(response => response.json())
    .then(produtos => {
      const listaProdutos = document.getElementById('produtos-lista');
      listaProdutos.innerHTML = ''; // Limpa a lista antes de adicionar os produtos

      // Adiciona cada produto à lista na página
      produtos.forEach(produto => {
        const produtoDiv = document.createElement('div');
        produtoDiv.classList.add('produto');
        produtoDiv.innerHTML = `
          <h2>${produto.nome}</h2>
          <p>${produto.descricao}</p>
          ${produto.imagem ? `<img src="${produto.imagem}" alt="${produto.nome}" width="100">` : ''}
          <button onclick="removerProduto(${produto.id})">Remover</button>
        `;
        listaProdutos.appendChild(produtoDiv);
      });
    })
    .catch(error => {
      console.error('Erro ao carregar produtos:', error);
    });
};

// Função para remover um produto
function removerProduto(produtoId) {
  // Fazendo a requisição para remover o produto do servidor
  fetch(`/produtos/${produtoId}`, {
    method: 'DELETE',
  })
  .then(response => {
    if (response.ok) {
      alert('Produto removido com sucesso!');
      window.location.reload(); // Recarrega a página para atualizar a lista de produtos
    } else {
      throw new Error('Erro ao remover produto');
    }
  })
  .catch(error => {
    alert('Erro: ' + error.message);
  });
}

// Função para adicionar um produto
function adicionarProduto(event) {
  event.preventDefault(); // Previne o comportamento padrão de envio do formulário

  const nome = document.getElementById('nome').value;
  const descricao = document.getElementById('descricao').value;
  const imagem = document.getElementById('imagem').files[0];

  const formData = new FormData();
  formData.append('nome', nome);
  formData.append('descricao', descricao);
  if (imagem) {
    formData.append('imagem', imagem);
  }

  // Fazendo a requisição para adicionar um novo produto
  fetch('/produtos', {
    method: 'POST',
    body: formData,
  })
  .then(response => response.json())
  .then(produto => {
    alert('Produto enviado com sucesso!');
    window.location.reload(); // Recarrega a página para exibir o novo produto
  })
  .catch(error => {
    alert('Erro: ' + error.message);
  });
}
