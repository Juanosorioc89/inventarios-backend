const express = require('express');
const { getConnetion } = require('./db/connect-mongo');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT;
const host = '0.0.0.0';

app.use(cors());

getConnetion();

app.use(express.json());
app.use('/usuario', require('./router/usuario'));
app.use('/marca', require('./router/marca'));
app.use('/tipoEquipo', require('./router/tipoEquipo'));
app.use('/estadoEquipo', require('./router/estadoEquipo'));
app.use('/inventario', require ('./router/inventario'));
app.use('/auth', require ('./router/auth'));

app.listen(port, host, () => {
    console.log(`Example app listening on port ${port}`)
});
