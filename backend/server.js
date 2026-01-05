const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

let payments = [
    { id: 1, amount: 500, description: "Payment for invoice #123", date: "2025-12-23" },
    { id: 2, amount: 1500, description: "Payment for invoice #124", date: "2025-12-24" },
    { id: 3, amount: 2500, description: "Payment for invoice #125", date: "2025-12-25" }
]

let nextId = 4;

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        paymentsCount: payments.length 
    });
});

app.get('/api/payments', (req, res) => {
    res.json(payments);
});


app.get('/api/payments/:id', (req, res) => {
    const payment = payments.find(p => p.id === parseInt(req.params.id));
    if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(payment);
});

app.post('/api/payments', (req, res) => {
    const { amount, description } = req.body;

    if (!amount || !description) {
        return res.status(400).json({ error: 'Amount and description are required' });
    }

    const newPayment = {
        id: nextId++,
        amount: parseFloat(amount),
        description,
        date: new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD format
    };

    payments.push(newPayment);
    res.status(201).json(newPayment);
});

app.patch('/api/payments/:id', (req, res) => {
    const paymentId = parseInt(req.params.id);
    const { amount, description } = req.body;

    const paymentIndex = payments.findIndex(p => p.id === paymentId);

    if (paymentIndex === -1) {
        return res.status(404).json({ error: 'Payment not found' });
    }

    if (amount !== undefined) {
        payments[paymentIndex].amount = parseFloat(amount);
    }

    if (description !== undefined) {
        payments[paymentIndex].description = description;
    }

    res.json(payments[paymentIndex]);
});

app.delete('/api/payments/:id', (req, res) => {
    const paymentId = parseInt(req.params.id);
    const initialLength = payments.length;

    payments = payments.filter(p => p.id !== paymentId);

    if (payments.length === initialLength) {
        return res.status(404).json({ error: 'Payment not found' });
    }

    res.status(204).send();
});




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});