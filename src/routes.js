const express = require("express")
const router = express.Router()

const Usuario = require('./controllers/usuarios')
const Ocorrencia = require('./controllers/ocorrencia')

const rotaInicial = (req, res) => {
    res.json("Back-end Resíduos respondendo")
}

router.get('/',rotaInicial)
router.post('/usuarios/login', Usuario.login)
router.post('/usuarios', Usuario.cadastrar)
router.get('/usuarios', Usuario.listar)
router.put('/usuarios/:id', Usuario.alterar)
router.delete('/usuarios/:id', Usuario.excluir)

router.post('/ocorrencia', Ocorrencia.cadastrar)
router.get('/ocorrencia', Ocorrencia.listar)
router.patch('/ocorrencia/:id', Ocorrencia.alterar)
router.delete('/ocorrencia/:id', Ocorrencia.excluir)
router.get('/ocorrencia/resumo', Ocorrencia.resumo)

module.exports = router