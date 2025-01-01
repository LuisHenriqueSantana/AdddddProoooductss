const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const app = express();

// Usando a porta fornecida pelo Render ou 3000 como fallback
const port = process.env.PORT || 3000;

// Configuração do armazenamento de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/'); // Caminho para salvar as imagens
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Nome único para cada imagem
  }
});

const upload = multer({ storage });

// Middleware para servir arquivos estáticos
app.use(express.static('public'));
app.use(express.json());

// Rota para obter todos os produtos
app.get('/produtos', (req, res) => {
  fs.readFile('public/produtos.json', (err, data) => {
    if (err) {
      res.status(500).send('Erro ao carregar produtos');
      return;
    }
    res.json(JSON.parse(data));
  });
});

// Rota para adicionar um produto
app.post('/produtos', upload.single('imagem'), (req, res) => {
  const novoProduto = {
    id: Date.now(),
    nome: req.body.nome,
    descricao: req.body.descricao,
    preco: req.body.preco,
    precoPromocional: req.body.precoPromocional,
    peso: req.body.peso,
    categoria: req.body.categoria,
    subcategoria: req.body.subcategoria,
    imagem: req.file ? req.file.filename : null
  };

  fs.readFile('public/produtos.json', (err, data) => {
    if (err) {
      res.status(500).send('Erro ao ler produtos');
      return;
    }

    const produtos = JSON.parse(data);
    produtos.push(novoProduto);

    fs.writeFile('public/produtos.json', JSON.stringify(produtos), (err) => {
      if (err) {
        res.status(500).send('Erro ao salvar produto');
        return;
      }
      res.status(200).send('Produto adicionado com sucesso');
    });
  });
});

// Rota para remover um produto
app.delete('/produtos/:id', (req, res) => {
  const produtoId = parseInt(req.params.id, 10);

  fs.readFile('public/produtos.json', (err, data) => {
    if (err) {
      res.status(500).send('Erro ao ler produtos');
      return;
    }

    let produtos = JSON.parse(data);
    const produtoIndex = produtos.findIndex(produto => produto.id === produtoId);

    if (produtoIndex === -1) {
      return res.status(404).send('Produto não encontrado');
    }

    // Remover imagem associada ao produto, se existir
    const produto = produtos[produtoIndex];
    if (produto.imagem) {
      const imagemPath = path.join(__dirname, 'public', 'uploads', produto.imagem);
      fs.unlink(imagemPath, (err) => {
        if (err) {
          console.error('Erro ao excluir imagem:', err);
        }
      });
    }

    produtos.splice(produtoIndex, 1);

    fs.writeFile('public/produtos.json', JSON.stringify(produtos), (err) => {
      if (err) {
        res.status(500).send('Erro ao remover produto');
        return;
      }
      res.status(200).send('Produto removido com sucesso');
    });
  });
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
