// Node imports.
const express = require('express');
const app = express();
const request = require('request');
const rp = require('request-promise');
const bodyParser = require('body-parser');
const util = require('util')
const formatter = require('./utils/formatter')
const cuisines = require('./consts/cuisines.js')
const courses = require('./consts/courses.js')

// View configuration information.
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

// Enable body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))


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


// Search for a recipe with any given key words.
app.get('/recipes/search', (req, res) => {
    res.render('recipeSearch')
});


// Post request to get back recipes.
app.post('/recipes/search', (req, res) => {
    const searchParams = req.body.searchParams.split(" ").join("+")
    var queryString = util.format('?ingredients=%s' +
				  '&course=%s' +
				  '&submitted_by=%s' +
				  '&cuisine=%s', searchParams, searchParams, searchParams, searchParams);
    
    var options = {
	method: 'GET',
	uri: 'http://localhost:3000/recipes/search' + queryString,
	json: true
    }

    // Run get and wait on promise before rendering.
    rp(options, (req, res) => {
    }).then((response) => {
	res.render('recipes', { recipes: response['recipes'] })
    }).catch((err) => {
	if (err.statusCode == 404) {
	    res.render('error', { message: err.error.msg })
	}
    });
});


// Upload a new recipe.
app.get('/recipes/add', (req, res) => {
    res.render('recipeUpload', { cuisines: cuisines, courses: courses })
})


// Post for adding a new recipe.
app.post('/recipes/add', (req, res) => {
    const recipe = {}
    recipe.text_friendly_name = req.body.name
    recipe.ingredients = formatter.formatIngredients(req.body.ingredient, req.body.quantity, req.body.unit)
    recipe.steps = req.body.steps
    console.log(req.body.course)
    recipe.course = req.body.course
    recipe.prep_time = formatter.formatTime(req.body.prepTime)
    recipe.cook_time = formatter.formatTime(req.body.cookTime)
    recipe.cuisine = req.body.cuisine
    recipe.searchable = (req.body.searchable === "true")
    recipe.description = req.body.description

    var options = {
	method: 'POST',
	uri: 'http://localhost:3000/recipes/add',
	body: recipe,
	json: true
    }

    // Run get and wait on promise before rendering.
    rp(options, (req, res) => {
    }).then((response) => {
	res.render('index')
    }).catch((err) => {
	if (err.statusCode === 422)
	{
	    console.log(err.error.msg)
	    res.render('error', { message: err.error.msg })
	}
	else
	{
	}
    });
})


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
