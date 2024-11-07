const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// Create a new item
router.post('/', async (req, res) => {
    const { name } = req.body;
    const item = await Item.create({ name });
    req.io.emit('itemAdded', item); // Emit socket event
    res.json(item);
});

// Get all items
router.get('/', async (req, res) => {
    const items = await Item.findAll();
    res.json(items);
});

// Update an item
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const item = await Item.findByPk(id);
    if (item) {
        item.name = name;
        await item.save();
        req.io.emit('itemUpdated', item); // Emit socket event
        res.json(item);
    } else {
        res.status(404).send('Item not found');
    }
});

// Delete an item
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const item = await Item.findByPk(id);
    if (item) {
        await item.destroy();
        req.io.emit('itemDeleted', id); // Emit socket event
        res.sendStatus(204);
    } else {
        res.status(404).send('Item not found');
    }
});

module.exports = router;
