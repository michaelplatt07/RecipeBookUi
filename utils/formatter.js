exports.formatTime = (unformattedTime) => {
    const formattedTime = {}
    formattedTime.hours = unformattedTime / 60
    formattedTime.minutes = unformattedTime % 60
    return formattedTime
}

exports.formatIngredients = (ingredientList) => {
    let ingredients = []
    ingredientList.split(",").forEach((ingredient) => {
	let ingredientJSON = {}
	ingredientJSON.quantity = ingredient.split(" ")[0]
	ingredientJSON.measurement = ingredient.split(" ")[1]
	ingredientJSON.text_friendly_name = ingredient.split(" ")[2]
	ingredients.push(ingredientJSON)
    })
    return ingredients
}
