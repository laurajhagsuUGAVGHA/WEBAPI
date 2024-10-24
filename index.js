// const express = require('express');
// const cors = require('cors');
// const app = express();
// const port = 3000;

// const API_KEY = '1234567890abcdef';

// // Middleware para permitir o parsing de JSON nas requisições
// app.use(express.json());

// // Habilita o CORS para todas as rotas
// app.use(cors());

// // Middleware de autenticação de chave de API
// const authenticateAPIKey = (req, res, next) => {
//   const apiKey = req.header('x-api-key');

//   if (!apiKey) {
//     return res.status(401).json({ message: 'Chave de API ausente.' });
//   }

//   if (apiKey !== API_KEY) {
//     return res.status(403).json({ message: 'Chave de API inválida.' });
//   }

//   next();
// };

// // Aplicando o middleware de autenticação
// app.use(authenticateAPIKey);

// // Endpoint para obter uma lista de itens
// app.get('/items', (req, res) => {
//   try {
//     const items = [
//       { id: 1, nome: 'Item 1' },
//       { id: 2, nome: 'Item 2' },
//       { id: 3, nome: 'Item 3' }
//     ];
//     res.status(200).json(items); // Retorna a lista de itens com status 200 (sucesso)
//   } catch (error) {
//     res.status(500).json({ message: 'Erro interno do servidor' }); // Resposta em caso de erro
//   }
// });

// // Endpoint para criar um novo item (mesmo que o frontend não o utilize)
// app.post('/items', (req, res) => {
//   try {
//     const newItem = req.body;
//     // Aqui poderia adicionar a lógica para salvar o item em um banco de dados
//     res.status(201).json(newItem); // Retorna o item criado com status 201 (sucesso)
//   } catch (error) {
//     res.status(500).json({ message: 'Erro ao criar item' }); // Resposta em caso de erro
//   }
// });

// // Inicia o servidor
// app.listen(port, () => {
//   console.log(`Servidor rodando em http://localhost:${port}`);
// });


const express = require('express');
const cors = require('cors');
const crypto = require('crypto'); // Importa o módulo crypto
const app = express();
const port = 3000;

const API_KEY = '1234567890abcdef';

app.use(express.json());
app.use(cors());

const authenticateAPIKey = (req, res, next) => {
  const apiKey = req.header('x-api-key');

  if (!apiKey) {
    return res.status(401).json({ message: 'Chave de API ausente.' });
  }

  if (apiKey !== API_KEY) {
    return res.status(403).json({ message: 'Chave de API inválida.' });
  }

  next();
};

app.use(authenticateAPIKey);

// Função para criptografar a mensagem
app.post('/encrypt', (req, res) => {
  const { message } = req.body;
  console.log('Mensagem recebida para criptografia:', message); // Log da mensagem recebida
  
  if (!message) {
    return res.status(400).json({ message: 'Mensagem ausente.' });
  }

  const key = crypto.randomBytes(32); // Gera uma chave aleatória
  const iv = crypto.randomBytes(16); // Gera um IV aleatório

  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  res.status(200).json({ 
    encryptedData: encrypted, 
    iv: iv.toString('hex'), 
    key: key.toString('hex') 
  });
});

// Função para descriptografar a mensagem
app.post('/decrypt', (req, res) => {
  const { encryptedData, iv, key } = req.body;
  console.log('Dados recebidos para descriptografia:', { encryptedData, iv, key }); // Log dos dados recebidos
  
  if (!encryptedData || !iv || !key) {
    return res.status(400).json({ message: 'Dados ausentes.' });
  }

  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  res.status(200).json({ decryptedMessage: decrypted });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
