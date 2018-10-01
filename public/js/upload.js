// TODO(map) : Figure out to call this in programatically because I don't care to look it up yet
const measurements = [
    "",
    "tsp",
    "Tbsp",
    "c",
    "q",
    "lb",
    "oz"
]

function addNewStep() {
    var newStepElement = document.createElement("input")
    newStepElement.type = "text"
    newStepElement.name = "steps"
    newStepElement.className = "step-input"

    var deleteStepButton = document.createElement("button")
    deleteStepButton.type = "button"
    deleteStepButton.onclick = () => removeStep(deleteStepButton)
    deleteStepButton.className = "remove-item-button"
    deleteStepButton.innerHTML = "DELETE"

    var stepDiv = document.createElement("div")

    stepDiv.append(newStepElement)
    stepDiv.append(deleteStepButton)
    
    document.getElementById("stepDiv").append(stepDiv)
}

function addNewIngredient() {
    var newQuantityElement = document.createElement("input")
    newQuantityElement.type = "text"
    newQuantityElement.name = "quantity"
    newQuantityElement.className = "quantity-input"

    var newUnitElement = document.createElement("select")
    newUnitElement.name = "unit"
    newUnitElement.className = "measurement-input"

    var newIngredientElement = document.createElement("input")
    newIngredientElement.type = "text"
    newIngredientElement.name = "ingredient"
    newIngredientElement.className = "ingredient-input"

    var deleteIngredientButton = document.createElement("button")
    deleteIngredientButton.type = "button"
    deleteIngredientButton.onclick = () => removeIngredient(deleteIngredientButton)
    deleteIngredientButton.className = "remove-item-button"
    deleteIngredientButton.innerHTML = "DELETE"
    
    var ingredientDiv = document.createElement("div")
    
    ingredientDiv.append(newQuantityElement)
    ingredientDiv.append(newUnitElement)
    for (let i = 0; i < measurements.length; ++i)
    {
	var option = document.createElement("option");
	option.value = measurements[i];
	option.text = measurements[i];
	newUnitElement.appendChild(option);
    }
    ingredientDiv.append(newIngredientElement)
    ingredientDiv.append(deleteIngredientButton)

    document.getElementById("ingredientDiv").append(ingredientDiv)
}

function removeStep(elem) {
    var divToRemove = elem.parentElement
    document.getElementById("stepDiv").removeChild(divToRemove);
}

function removeIngredient(elem) {
    var divToRemove = elem.parentElement
    document.getElementById("ingredientDiv").removeChild(divToRemove);
}
