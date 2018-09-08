// Node imports.
const express = require('express');
const app = express();
const request = require('request');
const rp = require('request-promise');

// View configuration information.
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');


// Home page.
app.get('/', async (req, res) => {
    res.render('index')
});


/**
 * --------------------------
 * |     RECIPE ROUTING     |
 * --------------------------
 */
/**
 * ----------------
 * |     GETS     |
 * ----------------
 */
// All recipes
app.get('/recipes', async (req, res) => {
    var options = {
	method: 'GET',
	uri: 'http://localhost:3000/recipes',
	json: true
    }

    let response = await rp(options);
    res.render('recipes', { recipes: response['recipes'] })
});


// Recipe by ID
app.get('/recipes/id/:id?', async (req, res) => {
    var options = {
	method: 'GET',
	uri: 'http://localhost:3000/recipes/id/' + req.params.id,
	json: true
    }

    let response = await rp(options);
    res.render('singleRecipe', { title: response['title'], recipe: response['recipe'] })
});


// Randome recipe
app.get('/recipes/random', async (req, res) => {
    var options = {
	method: 'GET',
	uri: 'http://localhost:3000/recipes/random',
	json: true
    }

    let response = await rp(options);
    res.render('singleRecipe', { title: response['title'], recipe: response['recipe'] })
})

// Routing.
// All recipes.  Can include a count to limit the amount returned along with any tags.
app.get('/recipes/search', (req, res) => {
    var queryString = ''
    for (key in req.query)
    {
	for (i = 0; i < req.query[key].length; ++i)
	{
	    queryString += key + '=' + req.query[key][i] + "&";
	}
    }
    
    var options = {
	method: 'GET',
	uri: 'http://localhost:3000/recipes?' + queryString,
	json: true
    }

    // Run get and wait on promise before rendering.
    rp(options, (req, res) => {
    }).then((response) => {
	res.render('recipes', { pageTitle: response['title'], recipes: response['recipes'] })
    });
});

// Recipe by name.
app.get('/recipes/:recipeName', (req, res) => {
    var options = {
	method: 'GET',
	uri: 'http://localhost:3000/recipes/' + req.params.recipeName,
	json: true
    }

    // Run get and wait on promise before rendering.
    rp(options, (req, res) => {
    }).then((response) => {
	res.render('singleRecipe', { pageTitle: response['title'], recipe: response['recipe'] })
    });
});

module.exports = app;
