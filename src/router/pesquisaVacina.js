const express = require('express');
const router = express.Router();
const pool = require('../../api.js');
module.exports = router;

router.get('/VACINA/:id_vacina', async (req, res) => {
    const vaccineId = req.params.vaccineId;
    console.log('Recebendo solicitação para obter informações da vacina com ID:', vaccineId);

    try {
        const result = await pool.query('SELECT * FROM VACINA WHERE ID_VACINA = $1', [vaccineId]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao obter informações da vacina no banco de dados:', error);
        res.status(500).json({ error: 'Erro ao obter informações da vacina no banco de dados' });
    }
});