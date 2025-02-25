const express = require("express");
const rotas = express();
const Sequelize = require("sequelize");
const cors = require("cors");

rotas.use(cors());
rotas.use(express.json());

const conexaoComBanco = new Sequelize("etec", "root", "", {
    host: "localhost",
    dialect: "mysql",
});

const UnidadeEscolar = conexaoComBanco.define("unidades", {
    curso: { type: Sequelize.STRING },
    unidade: { type: Sequelize.STRING },
});

const syncDatabase = async () => {
    try {
        await UnidadeEscolar.sync({ force: false});
        console.log("Tabelas sincronizadas corretamente.");
    } catch (error) {
        console.error("Erro ao sincronizar as tabelas:", error);
    }
};

rotas.get("/unidades/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const unidade = await UnidadeEscolar.findByPk(id);

        if (unidade) {
            res.status(200).json(unidade);
        } else {
            res.status(404).json({ message: "Unidade não encontrada" });
        }
    } catch (error) {
        console.error("Erro ao buscar a unidade:", error);
        res.status(500).json({ message: "Erro no servidor" });
    }
});

syncDatabase();

rotas.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});

