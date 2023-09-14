var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var client = require('../redis.js');

router.get('/', async (req, res) => {
	try {
		// let Array = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/drinks.json')));
		const Array = await client.get(req.originalUrl);
		if (Array !== null) {
			return res.status(200).json({ statuscode: 200, drinks: JSON.parse(Array) });
		} else {
			return res.status(200).json({ statuscode: 200, drinks: [] });
		}
	} catch (err) {
		return res.status(500).json({ statuscode: 500, error: err.message });
	}
});

router.get('/:id', async (req, res) => {
	// let Array = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/drinks.json')));
	let Array = await client.get('/drinks');
	let filteredArray;
	Array = JSON.parse(Array);
	if (Array !== null) {
		filteredArray = Array.filter((x) => x.id == req.params.id);
	}
	if (filteredArray <= 0) {
		return res.status(404).send({ statuscode: 404, error: 'Drink not found' });
	} else {
		return res.status(200).send({ statuscode: 200, drink: filteredArray });
	}
});

router.post('/', jsonParser, async (req, res) => {
	// let Array = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/drinks.json')));
	let Array = await client.get(req.originalUrl);
	if (Array == null) Array = [];
	let { name, ingredients, description } = req.body;

	if (name != null && ingredients != null && description != null) {
		let newDrink = {
			id: Array.length + 1,
			name: name,
			description: description,
			ingredients: ingredients,
		};
		Array.push(newDrink);
		// fs.writeFileSync(path.resolve(__dirname, '../data/drinks.json'), JSON.stringify(Array));
		await client.set(req.originalUrl, JSON.stringify(Array));
		res.status(200).json({ statuscode: 200, message: 'New drink added successfully' });
	} else {
		res.status(400).json({ statuscode: 400, error: 'Not all the properties have been provided' });
	}
});

router.delete('/:id', async (req, res) => {
	// let Array = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/drinks.json')));
	let Array = await client.get('/drinks');
	Array = JSON.parse(Array);

	let removeDrink = Array.find((x) => x.id == req.params.id);
	if (removeDrink != null) {
		Array = Array.filter((x) => x.id != req.params.id);
		await client.set('/drinks', JSON.stringify(Array));
		// fs.writeFileSync(path.resolve(__dirname, '../data/drinks.json'), JSON.stringify(Array));
		res.status(200).json({ statuscode: 200, message: 'Drink has been removed successfully' });
	} else {
		res.status(400).json({ statuscode: 400, error: 'Drink not found' });
	}
});

module.exports = router;

