document.getElementById('produtoForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evitar o envio padrão do formulário
  
    const formData = new FormData(this); // Cria FormData com os dados do formulário
  
    try {
      const response = await fetch('https://adddddprooooductss.onrender.com/produtos', {
        method: 'POST',
        body: formData
      });
  
      if (response.ok) {
        alert('Produto adicionado com sucesso');
        this.reset(); // Limpa os campos do formulário
        listarProdutos(); // Atualiza a lista de produtos
      } else {
        alert('Erro ao adicionar produto');
      }
    } catch (error) {
      console.error('Erro ao enviar produto:', error);
      alert('Erro ao adicionar produto');
    }
  });
  
  // Função para listar os produtos cadastrados
  async function listarProdutos() {
    try {
      const response = await fetch('/produtos');
      const produtos = await response.json();
      
      const listaProdutos = document.getElementById('listaProdutos');
      listaProdutos.innerHTML = ''; // Limpa a lista antes de adicionar novos produtos
  
      produtos.forEach(produto => {
        const divProduto = document.createElement('div');
        divProduto.classList.add('produto');
  
        divProduto.innerHTML = `
          <img src="/uploads/${produto.imagem}" alt="${produto.nome}" width="100">
          <h3>${produto.nome}</h3>
          <p>${produto.descricao}</p>
          <p>Preço: R$ ${produto.preco}</p>
          <p>Preço Promocional: R$ ${produto.precoPromocional}</p>
          <p>Peso: ${produto.peso} kg</p>
          <p>Categoria: ${produto.categoria}</p>
          <p>Subcategoria: ${produto.subcategoria}</p>
          <button onclick="removerProduto(${produto.id})">Remover</button>
        `;
        
        listaProdutos.appendChild(divProduto);
      });
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
    }
  }
  
  // Função para remover produto
  async function removerProduto(id) {
    const confirmar = confirm('Tem certeza que deseja remover este produto?');
  
    if (confirmar) {
      try {
        const response = await fetch(`/produtos/${id}`, {
          method: 'DELETE'
        });
  
        if (response.ok) {
          alert('Produto removido com sucesso');
          listarProdutos(); // Atualiza a lista de produtos após a remoção
        } else {
          alert('Erro ao remover produto');
        }
      } catch (error) {
        console.error('Erro ao remover produto:', error);
        alert('Erro ao remover produto');
      }
    }
  }
  
  // Inicializa a lista de produtos
  listarProdutos();
  