const express = require('express');

const app = express();
const router = require("./routes/api");

app.use(express.json());
app.use(router);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT || 3000}`);
});