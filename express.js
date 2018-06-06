// Node imports.
const express = require('express');
const app = express();
const request = require('request');
const rp = require('request-promise');

const port = 3001;

// View configuration information.
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Routing.
// All recipes.  Can include a count to limit the amount returned along with any tags.
app.get('/recipes', (req, res) => {
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

// Server listening.
app.listen(port, () => {
    console.log('Server listening on http://localhost:' + port);
});
