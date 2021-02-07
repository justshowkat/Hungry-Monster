// this function helps reduce call time for html id selector 
const getId = id => document.getElementById(id)

// this html variable holds custom html to push according to our api calls 
let setHtml = ``

// this function run twice, once normally and another time if search input is not found (line: 38, 60)
const alternativeSearch = (input) => {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${input}`)
        .then(res => res.json()).then(data => displayData(data))
}

// this function prepare individual item using search query (line: 40)
const displaySingleRecipe = data => {
    const meal = data.meals.map(item => item)
    
    meal.forEach(item => {
        let mealName = item.strMeal
        let mealImg = item.strMealThumb
        let mealId = item.idMeal
        setHtml += `
        <div class="col-md-4 my-4" id="${mealId}">
                <a href='#' class="card h-100 shadow p-3 mx-3 bg-white custom-card rounded-lg" onclick="showDetails(${mealId})">
                    <img src=${mealImg} class="card-img-top" alt="...">
                    <div class="card-body">
                        <h2 class="card-title fw-bolder">${mealName}</h2>
                    </div>
                </a>
        </div>`
    });
}

// this function runs after fetching data from api 
const displayData = (data) => {
    let meals = data.meals

    if (meals == null) {
        const searchInput = getId('search-input').value.trim()
        const chars = searchInput.split('');
        let searchWith = chars[0]
        alternativeSearch(searchWith)
   } else {
    displaySingleRecipe(data)
   }

   getId('card-group').innerHTML = setHtml
}

// this is a event listener for search button 
getId('search-btn').addEventListener('click', () => {
    const searchInput = getId('search-input').value.trim()
    getId('search-area').style.display = "none"
    getId('reload').style.display = "block"

    if (searchInput.length === 0) {
        getId('error-msg').style.display = "block"
    }
    else if (searchInput.length > 1) {
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInput}`)
        .then(res => res.json()).then(data => displayData(data))
    } else if (searchInput.length === 1) {
        alternativeSearch(searchInput)
    }
})

// this is a event listener for search again button 
getId('reload').addEventListener('click', () => location.reload())

// since this modal or ingredient showcase section is not that big, i put everything into (then) after calling fetch
let showDetails = (id) => {
    getId('modal').style.display = 'block'

    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(res => res.json()).then(data => {
        let food = data.meals[0]
        console.log(data)
        
        console.log(food)

        getId('modal').innerHTML = `
                <div class="card mb-3" style="max-width: 100%;">
                <div class="row g-0">
                <div class="col-md-4">
                    <img src="${food.strMealThumb}" alt="" srcset="" class="card-img-top">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <div className="col-md-5">
                            <h1 id="modal-h1" class='text-center'>${food.strMeal}</h1>
                            <h5>Ingredients</h5>
                            <ul id='ingredient-list'>
                            
                            </ul>
                        </div>
                        <div className="col-md-5">
                            <h3>How to make it? follow this step by step instruction</h3>
                            <h6>${food.strInstructions}</h6>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        `

        // this while loop loop through the ingredient and then push them into the mail ingredient showing template... 
        let i = 1
        
        while ( i != 0) {
            let ingredientstr = `strIngredient${i}`
            if (food[ingredientstr] === '' || !food[ingredientstr]) {
                break
            } else {
                let items = food[`strIngredient${i}`]
                let mesure = food[`strMeasure${i}`]
                
                const li = document.createElement('li')
                li.innerText = `${mesure}${items}`
                console.log(li)
                getId('ingredient-list').appendChild(li)
                i++
            }
        }
    })
}