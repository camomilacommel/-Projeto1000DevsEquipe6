const express = require('express');

//importa a conexao com o banco
const pool = require('../../api.js');

//inicializa o express
const rotaCampanha = express.Router();

/*rota para listar todos as campanhas*/
rotaCampanha.get('/', async (req, res) => {
    
    console.log("=> endpoint /campanha requisitado");
    
    try {
        //executa a consulta o banco de dados
        const consulta = await pool.query('SELECT * FROM CAMPANHA'); 
        
        //retorna o status HTTP 200 com os dados obtidos do banco 
        res.status(200).send(consulta.rows);
    } catch (error) {  
        //em caso de qualquer erro apresenta a descricao do erro
        console.log(error); 
        //retorna o status HTPP 400 com a mensagem de erro customizada
        res.status(404).json({mensagem: 'Erro ao executar a consulta.'});
    }
})


/*rota de pesquisa de campanha por data*/
rotaCampanha.get('/:date', async (req, res) => {
    //obtem o parametro
    const date = req.params.date;

    console.log(`=> endpoint /campanha/${date} requisitado`);

    try {
        const campanha = await pool.query('SELECT * FROM campanha WHERE $1 BETWEEN data_inicio AND Data_fim', [date]);

        //verifica se retornou alguma linha do banco de dados
        if (campanha.rowCount > 0){
            //se retornou devolve os dados com o status 200
            res.status(200).send(campanha.rows);
        } else {
            //caso nao retorne nenhuma linha o id nao existe
            res.status(404).json({mensagem: 'Campanha nao encontrada.'})
        }
    } catch (error) {    
        console.log(error);
        res.status(404).json({mensagem: 'Erro ao executar a consulta.'});
    }

})


/*rota para adicionar uma campanha*/
rotaCampanha.post('/add',async (req, res) => {
    console.log(`=> endpoint /campanha/add/ requisitado`);

    //obtem os dados no corpo da requisicao HTTP
    const campanha = req.body;

    try {
        //verifica se esta faltando algum campo obrigatorio
        if (!campanha || !campanha.descricao || !campanha.data_inicio || !campanha.data_fim) {
            res.status(400).json({mensagem: 'Parametros incompletos.'})
        } else {
            //campo ok, monta o SQL

            const result = await pool.query(
              'INSERT INTO campanha ID_CAMPANHA, DESCRICAO, DATA_INICIO, DATA_FIM) VALUES ($1, $2, $3, $4) RETURNING *',
            [campanha.id_campanha, campanha.descricao, campanha.data_inicio, campanha.data_fim]
            );
                
            if (result.rowCount > 0) {
                res.status(201).json({mensagem: 'Campanha cadastrada com sucesso.'});
            } else {
                res.status(400).json({mensagem: 'Erro ao inserir campanha.'});
            }
        }
    } catch (error) {  
        console.log(error);
        res.status(404).json({mensagem: 'Erro ao executar a insercao.'});
    }
})

/*rota para para atualizar uma campanha por id*/
rotaCampanha.put('/update/:id',async (req, res) => {
    const id = req.params.id;
    const campanhaEdit = req.body;

    console.log(`=> endpoint /campanha/update/${id} requisitado`);

    //para montarmos o sql dinamicamente com os campos que vieram do formulario
    //usamos o Object.Keys para obter o nome dos campos do formulario
    const campos = Object.keys(campanhaEdit);
    
    //usamos o Object.Keys para obter os valores dos campos do formulario
    const valores = Object.values(campanhaEdit);
    
    //montamos a clausula set do sql com o nome dos campos
    const sqlSetString = campos.map((field, index) => 
                                        `${field} = $${index + 1}`
                                    ).join(', ');

    console.log(`   Campos recebidos: ${campos}`);
    console.log(`   Valores recebidos: ${valores}`);
    console.log(`   Clausula SET: ${sqlSetString}`);
    
    try{
        const result = await pool.query(
            `UPDATE campanha SET ${sqlSetString} WHERE id_campanha = $${campos.length + 1}`,
            [...valores, Number(id)]
        );

        if (result.rowCount > 0){
            res.status(201).json({mensagem: 'Campanha atualizada com sucesso.'})
        } else {
            res.status(404).json({mensagem: 'Campanha nao encontrada.'});
        }
    } catch (error) {  
        console.log(error);
        res.status(404).json({mensagem: 'Erro ao executar a atualizacao.'});
    }
})


// Rota para excluir uma vacina de uma campanha
rotaCampanha.delete('/delete/:idCampanha/:idVacina', async (req, res) => {
    try {
        const idCampanha = req.params.idCampanha;
        const idVacina = req.params.idVacina;

        const result = await pool.query('DELETE FROM CAMPANHAVACINA WHERE ID_CAMPANHA = $1 AND ID_VACINA = $2 RETURNING *', [
        idCampanha,
        idVacina,
        ]);

        if (result.rows.length === 0) {
        res.status(404).json({ message: 'Vacina não encontrada na campanha.' });
        } else {
        res.status(200).json({ message: 'Vacina excluída com sucesso da campanha.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor.' });
    }
});

//exporta a rota para permitir a importacao em outros arquivos
module.exports = rotaCampanha; 
