require('dotenv').config();

const express = require('express');
const expressProxy = require('express-http-proxy');
const cors = require('cors');
const { createServer } = require('http');

const app = express();
const server = createServer(app);

app.use(cors());

app.use('/auth', expressProxy(process.env.AUTH_URL));
app.use('/ml', expressProxy(process.env.ML_URL));


const PORT = process.env.GATEWAY_PORT || 5000;

server.listen(PORT, () => {
    console.log(`Gateway listening on port ${PORT}`);
});
