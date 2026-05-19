const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// CORRECTION : On autorise absolument toutes les origines et les entêtes
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const SANDBOX_KEY = process.env.PORTAL_API_KEY;

// Petite route d'accueil pour tester facilement dans Google Chrome
app.get('/', (req, res) => {
    res.send("Le serveur DriveSafe est en ligne et prêt !");
});

// 1. Route d'approbation
app.post('/approve', async (req, res) => {
    const { paymentId } = req.body;
    console.log("Demande d'approbation reçue pour le paiement :", paymentId);
    try {
        const response = await axios.post(
            `https://api.minepi.com/v2/payments/${paymentId}/approve`,
            {},
            { headers: { Authorization: `Key ${SANDBOX_KEY}` } }
        );
        res.json(response.data);
    } catch (error) {
        console.error("Erreur Pi API Approve:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Erreur d'approbation au niveau de Pi" });
    }
});

// 2. Route de finalisation
app.post('/complete', async (req, res) => {
    const { paymentId, txid } = req.body;
    console.log("Demande de finalisation reçue pour le paiement :", paymentId);
    try {
        const response = await axios.post(
            `https://api.minepi.com/v2/payments/${paymentId}/complete`,
            { txid },
            { headers: { Authorization: `Key ${SANDBOX_KEY}` } }
        );
        res.json(response.data);
    } catch (error) {
        console.error("Erreur Pi API Complete:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Erreur de finalisation au niveau de Pi" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur actif sur le port ${PORT}`));
