const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const cors = require('cors'); // Adicione esta linha

const PORT = process.env.PORT || 3001;


const app = express();
app.use(bodyParser.json());
app.use(cors()); // Adicione esta linha para habilitar o CORS


// Conectar ao banco de dados SQLite (cria o banco se não existir)
const db = new sqlite3.Database('./mydatabase.db');

// Criação da tabela "pedidos" se não existir
db.run(`CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pedido TEXT,
    nome TEXT,
    produto TEXT,
    telefone TEXT
)`);

app.get('/', (req, res) => {
  return res.json("Olá, Mundo!!")
});


// Endpoint para listar todos os pedidos
app.get('/pedidos', (req, res) => {
    db.all('SELECT * FROM pedidos', (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao buscar pedidos' });
        } else {
            res.json(rows);
        }
    });
});

// Endpoint para criar um novo pedido
app.post('/pedidos', (req, res) => {
    const { pedido, nome, produto, telefone } = req.body;
    db.run(
        'INSERT INTO pedidos (pedido, nome, produto, telefone) VALUES (?, ?, ?, ?)',
        [pedido, nome, produto, telefone],
        function (err) {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Erro ao criar pedido' });
            } else {
                res.json({ id: this.lastID, pedido, nome, produto, telefone });
            }
        }
    );
});

// Rota para atualizar um dado existente
app.put('/dados/:id', (req, res) => {
    const id = req.params.id;
    const { pedido, nome, produto, telefone } = req.body;
  
    db.run('UPDATE pedidos SET pedido=?, nome=?, produto=?, telefone=? WHERE id=?', [pedido, nome, produto, telefone, id], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      res.json({ mensagem: 'Dado atualizado com sucesso.' });
    });
  });
  
  // Rota para excluir um dado
  app.delete('/dados/:id', (req, res) => {
    const id = req.params.id;
  
    db.run('DELETE FROM pedidos WHERE id=?', id, function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      res.json({ mensagem: 'Dado excluído com sucesso.' });
    });
  });

  
  app.patch('/dados/:id', (req, res) => {
    const id = req.params.id;
    const { pedido, nome, produto, telefone } = req.body;
  
    db.run('UPDATE pedidos SET pedido=?, nome=?, produto=?, telefone=? WHERE id=?', [pedido, nome, produto, telefone, id], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      res.json({ mensagem: 'Dado atualizado com sucesso.' });
    });
  });

// Inicie o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
