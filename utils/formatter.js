exports.formatTime = (unformattedTime) => {
    const formattedTime = {}
    formattedTime.hours = Math.round(unformattedTime / 60)
    formattedTime.minutes = Math.round(unformattedTime % 60)
    return formattedTime
}

exports.formatIngredients = (ingredientList, quantityList, unitList) => {
    let ingredients = []
    if (ingredientList.constructor === Array && ingredientList.length > 1) {
	ingredientList.forEach((ingredient, index) => {
	    let ingredientJSON = {}
	    ingredientJSON.quantity = quantityList[index]
	    ingredientJSON.measurement = unitList[index] === 'undefined' ? '' : unitList[index]
	    ingredientJSON.text_friendly_name = ingredientList[index]
	    ingredients.push(ingredientJSON)
	})
    }
    else {
	let ingredientJSON = {}
	ingredientJSON.quantity = quantityList
	ingredientJSON.measurement = typeof unitList === 'undefined' ? '' : unitList
	ingredientJSON.text_friendly_name = ingredientList
	ingredients.push(ingredientJSON)
    }
    
    return ingredients    
}
