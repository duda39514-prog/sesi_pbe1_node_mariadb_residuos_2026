const con = require('../db')

const login = (req, res) => {
    try {
        if (!req.body){
            res.status(400).json("Informe email e senha no corpo da requisição").end();
            return
        }
        const { email, senha } = req.body
        if (email == undefined || senha == undefined){
            res.status(400).json("Informe email e senha").end();
            return
        }
        const sql = 'SELECT id, nome, email FROM usuario WHERE email = ? AND senha = password(?);'
        con.query(sql, [email, senha], (err, results) => {
            if (err) {
                console.error(err)
                res.status(500).json({ erro: 'Erro ao listar usuários' })
            } else {
                if (results.length == 0) {
                    res.status(404).json("Acesso negado, credenciais inválidas")
                } else {
                    res.json(results)
                }
            }
        })
    } catch (e) {
        res.status(500).json({ erro: 'Erro ao conectar com o banco de dados' })
    }
}

const cadastrar = (req, res) => {
    const { nome, email, senha } = req.body
    try {
        const sql = 'INSERT INTO usuario (nome, email, senha) VALUES (?, ?, password(?));'
        con.query(sql, [nome, email, senha], (err, results) => {
            if (err) {
                console.error(err)
                res.status(500).json({ error: 'Erro ao cadastrar usuário' })
            } else {
                const novoUsuario = req.body
                novoUsuario.id = results.insertId
                res.status(201).json({ message: 'Usuário cadastrado com sucesso', user: novoUsuario })
            }
        })
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Erro ao cadastrar usuário', details: 'Informe { nome, email, senha }' })
    }
}

const listar = (req, res) => {
    const sql = 'SELECT * FROM usuario;'
    con.query(sql, (err, results) => {
        if (err) {
            console.error(err)
            res.status(500).json({ error: 'Erro ao buscar usuários' })
        } else {
            res.json(results)
        }
    })
}

const alterar = (req, res) => {
    const { nome, email, senha } = req.body
    try {
        const sql = 'UPDATE usuario SET nome = ?, email = ?, senha = password(?) WHERE id = ?;'
        con.query(sql, [nome, email, senha, Number(req.params.id)], (err, results) => {
            if (err) {
                console.error(err)
                res.status(500).json({ error: 'Erro ao alterar usuário' })
            } else {
                const novoUsuario = req.body
                novoUsuario.id = Number(req.params.id)
                res.status(202).json({ message: 'Usuário alterado com sucesso', user: novoUsuario })
            }
        })
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Erro ao alterar usuário', details: 'Informe { nome, email, senha }' })
    }
}

const excluir = (req, res) => {
    const id = Number(req.params.id)
    const sql = 'DELETE FROM usuario WHERE id = ?;'
    con.query(sql, [id], (err, results) => {
        if (err) {
            if (err.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(409).json({
                    erro: 'Não foi possível excluir o usuário',
                    msg: 'Este usuário possui ocorrências registradas.'
                })
            }
            console.error(err)
            return res.status(500).json({
                erro: 'Erro ao excluir usuário',
                msg: err.sqlMessage
            })
        }
        if (results.affectedRows === 1) {
            res.json('Registro excluído com sucesso')
        } else {
            res.status(404).json({
                msg: 'Usuário não encontrado'
            })
        }
    })
}

module.exports = {
    login,
    cadastrar,
    listar,
    alterar,
    excluir
}