const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// Récupération de la clé cachée dans Render
const SANDBOX_KEY = process.env.PORTAL_API_KEY;

// 1. Route d'approbation
app.post('/approve', async (req, res) => {
    const { paymentId } = req.body;
    try {
        const response = await axios.post(
            `https://api.minepi.com/v2/payments/${paymentId}/approve`,
            {},
            { headers: { Authorization: `Key ${SANDBOX_KEY}` } }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Erreur d'approbation" });
    }
});

// 2. Route de finalisation
app.post('/complete', async (req, res) => {
    const { paymentId, txid } = req.body;
    try {
        const response = await axios.post(
            `https://api.minepi.com/v2/payments/${paymentId}/complete`,
            { txid },
            { headers: { Authorization: `Key ${SANDBOX_KEY}` } }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Erreur de finalisation" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur actif sur le port ${PORT}`));
