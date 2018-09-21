function addNewStep() {
    var newStepElement = document.createElement("input")
    newStepElement.type = "text"
    newStepElement.name = "steps"
    document.getElementById("stepDiv").append(newStepElement)
}

function addNewIngredient() {
    var newQuantityElement = document.createElement("input")
    newQuantityElement.type = "text"
    newQuantityElement.name = "quantity"
    var newUnitElement = document.createElement("input")
    newUnitElement.type = "text"
    newUnitElement.name = "unit"
    var newIngredientElement = document.createElement("input")
    newIngredientElement.type = "text"
    newIngredientElement.name = "ingredient"
    document.getElementById("ingredientDiv").append(newQuantityElement)
    document.getElementById("ingredientDiv").append(newUnitElement)
    document.getElementById("ingredientDiv").append(newIngredientElement)
}

