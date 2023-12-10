const express = require('express');
const router = express.Router();
const pool = require('../db');

// Rota para cadastrar uma aplicação de vacina
router.post('/cadastro', async (req, res) => {
  try {
    const { idPaciente, idVacina, dataAplicacao } = req.body;

    const result = await pool.query(
      'INSERT INTO VACINA_APLICADA (ID_PACIENTE, ID_VACINA, DATA_APLICACAO) VALUES ($1, $2, $3) RETURNING *',
      [idPaciente, idVacina, dataAplicacao]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

// Rota para consultar as vacinas de um paciente
router.get('/consulta/:idPaciente', async (req, res) => {
  try {
    const idPaciente = req.params.idPaciente;

    const result = await pool.query('SELECT * FROM VACINA_APLICADA WHERE ID_PACIENTE = $1', [idPaciente]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

// Rota para excluir uma aplicação de vacina
router.delete('/exclusao/:idPaciente/:idVacina', async (req, res) => {
  try {
    const idPaciente = req.params.idPaciente;
    const idVacina = req.params.idVacina;

    const result = await pool.query('DELETE FROM VACINA_APLICADA WHERE ID_PACIENTE = $1 AND ID_VACINA = $2 RETURNING *', [
      idPaciente,
      idVacina,
    ]);

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Aplicação de vacina não encontrada.' });
    } else {
      res.status(200).json({ message: 'Aplicação de vacina excluída com sucesso.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

// Desafio de criar apresentação gráfica dos resultados da vacinação
    //Rota para Gráfico de Barras: Quantidade de Vacinas Aplicadas por Tipo
    app.get('/grafico-barras', async (req, res) => {
      try {
        const result = await pool.query(`
          SELECT V.VACINA, COUNT(*) AS QUANTIDADE
          FROM VACINAAPLICADA VA
          JOIN VACINA V ON VA.ID_VACINA = V.ID_VACINA
          GROUP BY V.VACINA
          ORDER BY QUANTIDADE DESC
        `);
    
        res.json(result.rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    });

module.exports = router;
