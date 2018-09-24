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
    document.getElementById("stepDiv").append(newStepElement)
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

    document.getElementById("ingredientDiv").append(newQuantityElement)
    document.getElementById("ingredientDiv").append(newUnitElement)
    for (let i = 0; i < measurements.length; ++i)
    {
	var option = document.createElement("option");
	option.value = measurements[i];
	option.text = measurements[i];
	newUnitElement.appendChild(option);
    }
    document.getElementById("ingredientDiv").append(newIngredientElement)
}

