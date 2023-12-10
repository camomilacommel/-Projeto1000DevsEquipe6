const express = require('express');
const rotaPaciente = require('./router/paciente.js');
const rotaVacinas = require('./router/pesquisaVacina.js');
const bodyParser = require('body-parser');
const rotaVacina = require('./router/vacina.js');

const app = express();
app.use(bodyParser.json());

app.use(express.json());

app.use('/paciente', rotaPaciente);
app.use('/vacina', rotaVacina);
app.use('/pesquisaVacina', rotaVacinas)

const port = 3000;

app.listen(port, () => {
    console.log("Running");
})
