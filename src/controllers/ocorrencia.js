const con = require('../db')


const cadastrar = (req, res) => {
    const { usuarioId, local, tipoResiduo, nivelRisco, data, status } = req.body;
    const sql = `
        INSERT INTO ocorrencia
        (usuarioId, local, tipoResiduo, nivelRisco, data, status)
        VALUES (?, ?, ?, ?, ?, ?);
    `;
    con.query(sql, [usuarioId, local, tipoResiduo, nivelRisco, data, status], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: 'Erro ao cadastrar ocorrência'
            });
        }
        const novaOcorrencia = {
            id: results.insertId, usuarioId, local, tipoResiduo, nivelRisco, data, status};
        res.status(201).json({
            message: 'Ocorrência cadastrada com sucesso',
            ocorrencia: novaOcorrencia
        });
    });
};

const listar = (req, res) => {
    const sql = 'SELECT * FROM ocorrencia;'
    con.query(sql, (err, results) => {
        if (err) {
            console.error(err)
            res.status(500).json({ error: 'Erro ao buscar resíduos' })
        } else {
            res.json(results)
        }
    })
}

const alterar = (req, res) => {
    const id = Number(req.params.id)
    const chaves = Object.keys(req.body)
    let campos = ''
    const colunas = []
    chaves.forEach((chave) => {
        campos += `${chave} = ?,`
        colunas.push(req.body[chave])
    })
    campos = campos.slice(0, -1) 
    colunas.push(id)
    const sql = `UPDATE ocorrencia SET ${campos} WHERE id = ?;`
    con.query(sql, colunas, (err, results) => {
        if (err) {
            console.error(err)
            res.status(500).json({ erro: 'Erro ao alterar resíduo', msg: err.sqlMessage })
        } else {
            if (results.affectedRows == 1)
                res.json("Registro alterado com sucesso")
            else
                res.status(404).json({ msg: "Nada alerado no banco de dados", erro: results })
        }
    })
}

const excluir = (req, res) => {
    const id = Number(req.params.id)
    const sql = 'DELETE FROM ocorrencia WHERE id = ?;'
    con.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err)
            res.status(500).json({ erro: 'Erro ao excluir resíduo', msg: err.sqlMessage })
        } else {
            if (results.affectedRows == 1)
                res.json("Registro excluído com sucesso")
            else
                res.status(404).json({ msg: "Nada alerado no banco de dados", erro: results })
        }
    })
}

const resumo = (req, res) => {
    const sql1 = 'SELECT COUNT(*) AS total FROM ocorrencia;'
    const sql2 = 'SELECT * FROM ocorrencia;'

    con.query(sql1, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: 'Erro ao buscar resumo das ocorrências'
            })
        }

        const resposta = {};
        resposta.total = results[0].total;

        con.query(sql2, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: 'Erro ao buscar ocorrências'
                })
            }

            resposta.ocorrencias = results

            res.json(resposta)
        })
    })
}

module.exports = {
    cadastrar,
    listar,
    alterar,
    excluir,
    resumo
}