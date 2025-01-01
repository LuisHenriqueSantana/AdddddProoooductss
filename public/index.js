const listaProdutos = document.getElementById('listaProdutos');

// Função para carregar e exibir os produtos
async function carregarProdutos() {
  try {
    const response = await fetch('/produtos');
    const produtos = await response.json();
    
    listaProdutos.innerHTML = ''; // Limpa a lista antes de adicionar

    produtos.forEach(produto => {
      const produtoElement = document.createElement('div');
      produtoElement.classList.add('produto');
      
      produtoElement.innerHTML = `
        <h3>${produto.nome}</h3>
        <p>${produto.descricao}</p>
        <p>Preço: R$ ${produto.preco}</p>
        <p>Preço Promocional: R$ ${produto.precoPromocional || 'Não disponível'}</p>
        <p>Peso: ${produto.peso} kg</p>
        <p>Categoria: ${produto.categoria}</p>
        <p>Subcategoria: ${produto.subcategoria}</p>
        <img src="/uploads/${produto.imagem}" alt="${produto.nome}" style="max-width: 200px;">
      `;

      // Adicionar o produto à lista
      listaProdutos.appendChild(produtoElement);
    });
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    alert('Erro ao carregar produtos');
  }
}

// Carregar produtos ao carregar a página
window.onload = carregarProdutos;
