// Node imports.
const express = require('express');
const app = express();
const request = require('request');
const rp = require('request-promise');
const session = require('express-session');
const passport = require('passport')
const bodyParser = require('body-parser');
const util = require('util')
const formatter = require('./utils/formatter')
const cuisines = require('./consts/cuisines.js')
const courses = require('./consts/courses.js')
const measurements = require('./consts/measurements.js')
const cookieParser = require('cookie-parser');
const crypto = require('crypto')

// View configuration information.
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

// Enable body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
    secret: 'super-secret-key-that-cannot-be-guessed',
    resave: true,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(cookieParser())


// Home page.
app.get('/', async (req, res) => {
    res.render('index')
});


app.get('/success', async (req, res) => {
    res.render('recipeSuccess')
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
	headers: { 'Authorization': req.cookies['Authorization'] },
	json: true
    }

    try
    {
	let response = await rp(options);
	res.render('recipes', { recipes: response['recipes'] })
    }
    catch (err)
    {
	if (err.statusCode === 401) {
	    res.render('error', { message: err.message })	    
	}
	if (err.statusCode == 404) {
	    res.render('error', { message: err.error.msg })
	}	
    }
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
app.post('/recipes/search', async (req, res) => {
    var options = {
	method: 'GET',
	uri: 'http://localhost:3000/recipes/search',
	body: {
	    ingredients: req.body.searchParams.split(" "),
	    course: req.body.searchParams.split(" "),
	    submitted_by: req.body.searchParams.split(" "),
	    cuisine: req.body.searchParams.split(" ")
	},
	json: true
    }

    // Run get and wait on promise before rendering.
    try
    {
	let response = await rp(options)
	res.render('recipes', { recipes: response['recipes'] })
    }
    catch (err) {
	if (err.statusCode == 404) {
	    res.render('error', { message: err.error.msg })
	}
    }
});


// Upload a new recipe.
app.get('/recipes/add', (req, res) => {
    res.render('recipeUpload', { cuisines: cuisines, courses: courses, measurements: measurements })
})


// Post for adding a new recipe.
app.post('/recipes/add', async (req, res) => {
    const recipe = {}
    recipe.text_friendly_name = req.body.name
    recipe.ingredients = formatter.formatIngredients(req.body.ingredient, req.body.quantity, req.body.unit)
    recipe.steps = formatter.formatArrayInputs(req.body.steps)
    recipe.course = formatter.formatArrayInputs(req.body.course)
    recipe.prep_time = formatter.formatTime(req.body.prepTime)
    recipe.cook_time = formatter.formatTime(req.body.cookTime)
    recipe.cuisine = formatter.formatArrayInputs(req.body.cuisine)
    recipe.searchable = (req.body.searchable === "true")
    recipe.description = req.body.description
    
    var options = {
	method: 'POST',
	uri: 'http://localhost:3000/recipes/add',
	headers: { 'Authorization': req.cookies['Authorization'] },
	body: recipe,
	json: true
    }

    // Run get and wait on promise before rendering.
    try
    {
	let response = rp(options)
	res.redirect('/success')
    }
    catch (err) {
	if (err.statusCode === 422)
	{
	    res.render('error', { message: err.error.msg })
	}
	else
	{
	}
    }
})


// Filter recipes.
app.get('/recipes/filter', async (req, res) => {
    var options = {
	method: 'GET',
	uri: 'http://localhost:3000/ingredients',
	json: true
    }

    try
    {
	let response = await rp(options);
	res.render('recipeFilter', { cuisines: cuisines, courses: courses, ingredients: response.ingredients })
    }
    catch (err)
    {
	if (err.statusCode === 404)
	{
	    res.render('error', { message: err.error.msg })
	}
    }
    
})


// Post for filtering recipes
app.post('/recipes/filter', async (req, res) => {
    var options = {
	method: 'GET',
	uri: 'http://localhost:3000/recipes/search',
	body: {
	    ingredients: req.body.ingredients,
	    cuisine: req.body.cuisine,
	    course: req.body.course,
	},
	json: true
    }


    try
    {
	let response = await rp(options)
	res.render('recipes', { recipes: response['recipes'] })
    }
    catch (err)
    {
	if (err.statusCode == 404) {
	    res.render('error', { message: err.error.msg })
	}

    }
})

// Recipe by name.
app.get('/recipes/:recipeName', async (req, res) => {
    var options = {
	method: 'GET',
	uri: 'http://localhost:3000/recipes/' + req.params.recipeName,
	json: true
    }

    // Run get and wait on promise before rendering.
    try
    {
	let response = rp(options)
	res.render('singleRecipe', { pageTitle: response['title'], recipe: response['recipe'] })
    }
    catch (err)
    {
	
    }
});


app.get('/login', (req, res) =>{
    res.render('login')
})


// Login.
app.post('/login', async (req, res) => {
    const cipher = crypto.createCipher('aes-128-cbc', 'baseSecret');
    var encryptedPass = cipher.update(req.body.password, 'utf8', 'hex');
    encryptedPass += cipher.final('hex');
    
    var options = {
	method: 'POST',
	uri: 'http://localhost:3000/users/login',
	body: { username: req.body.username, password: encryptedPass },	
	json: true,
    }
    
    // Run get and wait on promise before rendering.
    try
    {
	let response = await rp(options)
	res.cookie('Authorization', 'JWT ' + response['token'])
	res.render('loginSuccess', { message: response['message'] })
    }
    catch (err)
    {
	if (err.statusCode === 401) {
	    res.render('error', { message: err.error.message })
	}
    }
});


module.exports = app;
