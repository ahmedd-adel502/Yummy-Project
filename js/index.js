/// <reference path="jquery.min.js"/>

//* HTML elements
let searchLink = document.querySelector("#searchLink");
let categoriesLink = document.querySelector("#categoriesLink");
let areaLink = document.querySelector("#areaLink");
let ingredientsLink = document.querySelector("#ingredientsLink");
let contactLink = document.querySelector("#contactLink");
let openCloseIcon = document.querySelector(".open-close-icon");
let sideNav = document.querySelector("nav");
let htmlContainer = document.querySelector("#htmlContainer");

//^ variables
let navWidth= $("nav").outerWidth()

//~ Functions
closeSideNav()
function closeSideNav(){
       $("nav").animate({
            left:-navWidth
        },500)
    openCloseIcon.classList.add("fa-align-justify")
    openCloseIcon.classList.remove("fa-xmark")
    let links = document.querySelectorAll(".links li");
    $(".links").css(({
         position:"relative"
    }))
    $(".links").animate({
         top:"100px",
         opacity:"0"
    })
    for (let i = 0; i < links.length; i++) {
    $(links[i]).animate({
        top: "50px"
        });
    }
    
    $(".mini-nav").animate({
        left:0
    },500)
}

function openSideNav(){
    $("nav").animate({
        left:0
    },500)
    openCloseIcon.classList.remove("fa-align-justify")
    openCloseIcon.classList.add("fa-xmark")
     $(".mini-nav").animate({
        left:navWidth
    },500)
    setTimeout(()=>{
        let links = document.querySelectorAll(".links li");
        $(".links").css(({
            position:"relative"
        }))
        $(".links").animate({
            top:"0px",
            opacity:"1"
        },250)
        for (let i = 0; i < links.length; i++) {
            $(links[i]).delay(i * 50).animate({
                top: 0
            }, 250);
        }
    },250)
}

async function getMeals(){
    let meal= await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=")
    let response = await meal.json()
    htmlContainer.innerHTML=""
    response.meals.forEach(meal => {
        htmlContainer.innerHTML+=`
        <div class="col-lg-3 meal">
                <div class="inner">
                            <img class="w-100" src="${meal.strMealThumb}" alt="${meal.strMeal}">
                            <div class="inner-overlay px-3">
                                <span class="text-black fw-bold fs-3">${meal.strMeal}</span>
                            </div>
                </div>
        </div>
        `
        $(".meal").css({
            cursor:"pointer"
        })
        $(".meal").on("click",function(e){     
            let currentMealName = e.target.innerText;
            let meal= response.meals.find(meal=>meal.strMeal==currentMealName)
                   
            htmlContainer.innerHTML=""
            htmlContainer.innerHTML+=`
                <div class="col-lg-4">
                    <img class="w-100" src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <span class="meal-name fw-bold fs-3">${meal.strMeal}</span>
                </div>
                <div class="col-lg-8">
                    <h2 class="fw-bold">Instructions</h2>
                    <p class="meal-instructions">${meal.strInstructions}</p>
                    <span class="area d-block fs-3"><strong>Area :</strong> ${meal.strArea}</span>
                    <span class="category d-block fs-3"><strong>Category :</strong> ${meal.strCategory}</span>
                    <span class="recipes d-block fs-3"><strong>Recipes :</strong></span>
                    <ul class="recipes-list list-unstyled ms-2">
                        <li>${meal.strMeasure1} ${meal.strIngredient1}</li>
                        <li>${meal.strMeasure2} ${meal.strIngredient2}</li>
                        <li>${meal.strMeasure3} ${meal.strIngredient3}</li>
                        <li>${meal.strMeasure4} ${meal.strIngredient4}</li>
                    </ul>
                    <span class="tags d-block fs-3 mb-2">Tags :</span>
                    <div class="tag-links">
                        <button class="btn btn-success" onclick="window.open('${meal.strSource}')">Source</button>
                        <button class="btn btn-danger" onclick="window.open('${meal.strYoutube}')">Youtube</button>
                    </div>
                    <button class="back btn btn-primary d-block position-relative bottom-0 mt-2" onclick="getMeals()"><i class="fa-solid fa-arrow-left"></i> Go Back</button>
                </div>
            `
            closeSideNav()
            $(".back").css({
            left:"50%",
            bottom:"50px",
            transform:"translateX(-50%)"
        })
        })
    });
    };
getMeals()


function searchPage() {
    searchLink.addEventListener("click", () => {
        htmlContainer.innerHTML = `
            <section class="search">
                <div class="container mb-4">
                    <div class="input-group">
                        <input id="searchByName" type="text" class="form-control me-3" placeholder="Search by Name" aria-label="Search">
                        <input id="searchByLetter" type="text" maxlength="1" class="form-control" placeholder="Search by First Letter" aria-label="Search">
                    </div>
                </div>
                <div id="searchResults" class="row g-3"></div>
            </section>
        `;
        
        closeSideNav()
        let nameInput = document.querySelector("#searchByName");
        let letterInput = document.querySelector("#searchByLetter");
        let resultsContainer = document.querySelector("#searchResults");

        nameInput.addEventListener("input", () => {
            let name = nameInput.value;
            if (name !== "") {
                searchMeals(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
            } else {
                resultsContainer.innerHTML = "";
            }
        });

        letterInput.addEventListener("input", () => {
            let letter = letterInput.value.charAt(0);
            if (letter !== "") {
                searchMeals(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
            } else {
                resultsContainer.innerHTML = "";
            }
        });

        async function searchMeals(url) {
            try {
                const res = await fetch(url);
                const data = await res.json();
                resultsContainer.innerHTML = "";

                if (!data.meals) {
                    resultsContainer.innerHTML = `<h4 class="text-center text-danger">No meals found!</h4>`;
                    return;
                }

                data.meals.forEach(meal => {
                    resultsContainer.innerHTML += `
                        <div class="col-lg-3 meal">
                            <div class="inner">
                                <img class="w-100" src="${meal.strMealThumb}" alt="${meal.strMeal}">
                                <div class="inner-overlay px-3">
                                    <span class="text-black fw-bold fs-3">${meal.strMeal}</span>
                                </div>
                            </div>
                        </div>
                    `;
                });
                 resultsContainer.innerHTML +=`
                    <div class="container d-flex justify-content-center mt-5">
                         <button class="back btn btn-primary d-block position-relative" onclick="goHome()"><i class="fa-solid fa-arrow-left"></i> Home</button>
                    </div>
                 `

                 $(".meal").css({ cursor: "pointer" });
                    $(".meal").on("click", function (e) {
                        let currentMealName = e.target.innerText;
                        getMealDetails(currentMealName);
                        
                    });
            } catch (err) {
                console.error(err);
                resultsContainer.innerHTML = `<h4 class="text-center text-danger">Something went wrong!</h4>`;
            }
        }
    });
}
searchPage()
function goHome(){
    window.location.href="index.html"
}
async function categories(){
    let mealCategories = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    let data = await mealCategories.json();
    htmlContainer.innerHTML="";
    data.categories.forEach(category => {
        let shortDesc=category.strCategoryDescription.slice(0,120)+"...";
         htmlContainer.innerHTML+=`
                <div class="col-lg-3 category">
                    <div class="inner p-3">
                        <img class="w-100" src="${category.strCategoryThumb}" alt="${category.strCategory}">
                        <div class="inner-overlay px-3">
                            <span class="text-black fw-bold fs-3">${category.strCategory}</span>
                            <p class="category-description text-black">${shortDesc}</p>
                        </div>
                    </div>
                </div>`
    });
    htmlContainer.innerHTML+=`
             <div class="container d-flex justify-content-center mt-5">
                 <button class="back btn btn-primary d-block position-relative" onclick="goHome()"><i class="fa-solid fa-arrow-left"></i> Home</button>
            </div>
           `
    closeSideNav()
    $(".category").css({cursor:"pointer"})
    $(".category").on("click",function(){
        let currentCategory =this.querySelector("span").textContent;            
        getMealsByCategory(currentCategory)
    })
}
async function getMealsByCategory(category){
            let categoryDishes= await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
            let mealsOfCategory = await categoryDishes.json();
    
            htmlContainer.innerHTML="";
            mealsOfCategory.meals.forEach(meal => {
                 htmlContainer.innerHTML+=`
                 <div class="col-lg-3 meals-categories">
                        <div class="inner">
                            <img class="w-100" src="${meal.strMealThumb}" alt="${meal.strMeal}">
                            <div class="inner-overlay px-3">
                                <span class="text-black fw-bold fs-4">${meal.strMeal}</span>
                            </div>
                        </div>
                </div>
            `
           });
           htmlContainer.innerHTML+=`
             <div class="container d-flex justify-content-center mt-5">
                 <button class="back btn btn-primary d-block position-relative" onclick="categories()"><i class="fa-solid fa-arrow-left"></i> Previous Page</button>
            </div>
           `
           closeSideNav()
           $(".meals-categories").css({cursor:"pointer"});
             $(".meals-categories").on("click", async function () {
                 let mealName = this.querySelector("span").textContent;
                await getMealDetails(mealName);
             });
        }
async function getMealDetails(mealName) {
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`);
    let data = await res.json();
    let meal = data.meals[0];

    htmlContainer.innerHTML = `
        <div class="col-lg-4">
            <img class="w-100" src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <span class="meal-name fw-bold fs-3">${meal.strMeal}</span>
        </div>
        <div class="col-lg-8">
            <h2 class="fw-bold">Instructions</h2>
            <p class="meal-instructions">${meal.strInstructions}</p>
            <span class="area d-block fs-3"><strong>Area :</strong> ${meal.strArea}</span>
            <span class="category d-block fs-3"><strong>Category :</strong> ${meal.strCategory}</span>
            <span class="recipes d-block fs-3"><strong>Recipes :</strong></span>
            <ul class="recipes-list list-unstyled ms-2">
                <li>${meal.strMeasure1} ${meal.strIngredient1}</li>
                <li>${meal.strMeasure2} ${meal.strIngredient2}</li>
                <li>${meal.strMeasure3} ${meal.strIngredient3}</li>
                <li>${meal.strMeasure4} ${meal.strIngredient4}</li>
            </ul>
            <span class="tags d-block fs-3 mb-2">Tags :</span>
            <div class="tag-links">
                <button class="btn btn-success" onclick="window.open('${meal.strSource}')">Source</button>
                <button class="btn btn-danger" onclick="window.open('${meal.strYoutube}')">Youtube</button>
            </div>
            <button class="back btn btn-primary d-block position-relative" onclick="getMealsByCategory('${meal.strCategory}')"><i class="fa-solid fa-arrow-left"></i> Previous Page</button>
        </div>
    `;
    closeSideNav()
    $(".back").css({
        left: "50%",
        bottom: "-20px",
    });
}

async function getAllAreas(){
    let areas = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    let response = await areas.json();
    htmlContainer.innerHTML = "";
    response.meals.forEach(area => {
        htmlContainer.innerHTML += `
             <div class="col-md-3">
                        <div class="area-inner text-center">
                            <i class="fa-solid fa-house-laptop fa-4x"></i>
                            <h3 class="area-name">${area.strArea}</h3>
                        </div>
             </div>
        `;
    });
     htmlContainer.innerHTML+=`
                    <div class="container d-flex justify-content-center mt-5">
                         <button class="back btn btn-primary d-block position-relative" onclick="goHome()"><i class="fa-solid fa-arrow-left"></i> Home</button>
                    </div>
                     `
    closeSideNav()
    $(".area-inner").css({
        cursor: "pointer",
        width:"fit-content",
        margin:"auto"
    });
     async function getMealsByArea(area){
        let meals = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
        let response = await meals.json();
        htmlContainer.innerHTML = "";
        response.meals.forEach(meal => {
            htmlContainer.innerHTML += `
                <div class="col-lg-3 meal">
                    <div class="inner">
                        <img class="w-100" src="${meal.strMealThumb}" alt="${meal.strMeal}">
                        <div class="inner-overlay px-3">
                            <span class="text-black fw-bold fs-3">${meal.strMeal}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        closeSideNav()
        htmlContainer.innerHTML += `
            <div class="container d-flex justify-content-center mt-5">
                 <button class="back btn btn-primary d-block position-relative" onclick="getAllAreas()"><i class="fa-solid fa-arrow-left"></i> Previous Page</button>
            </div>
            `;
        $(".meal").css({cursor:"pointer"});
        $(".meal").on("click",function(e){
            let currentMealName = e.target.innerText;
            getMealDetails(currentMealName);
        })
    }
    $(".area-inner").on("click",function(){
        let currentArea = this.querySelector(".area-name").textContent;
        getMealsByArea(currentArea)
    })
}

async function getAllIngredients(){
    let allIngredients = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    let response = await allIngredients.json();
    let miniResponse = response.meals.slice(0,20);
    htmlContainer.innerHTML = "";
    miniResponse.forEach(ingredient => {
        let ingredientShortDesc = ingredient.strDescription ? ingredient.strDescription.slice(0, 100) + "..." : "No description available";
        htmlContainer.innerHTML += `
             <div class="col-md-3">
                        <div class="ingredient-inner text-center">
                            <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                            <h3 class="ingredient-name">${ingredient.strIngredient}</h3>
                            <p class="ingredient-description">${ingredientShortDesc}</p>
                        </div>
            </div>
        `;
    });
    closeSideNav()
    $(".ingredient-inner").css({
        cursor: "pointer",
        width:"fit-content",
        margin:"auto"
    });
    async function getMealsByIngredient(ingredient){
        let mealsByIngredient = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
        let response = await mealsByIngredient.json();
        htmlContainer.innerHTML="";
        response.meals.forEach(ingredient => {
            htmlContainer.innerHTML += `
                <div class="col-lg-3 meal">
                    <div class="inner meal-ingredient">
                        <img class="w-100" src="${ingredient.strMealThumb}" alt="${ingredient.strMeal}">
                        <div class="inner-overlay px-3">
                            <span class="text-black fw-bold fs-3 ingredient-name">${ingredient.strMeal}</span>
                        </div>
                    </div>
                </div>
            `;
        });

        closeSideNav()
         htmlContainer.innerHTML += `
            <div class="container d-flex justify-content-center mt-5">
                 <button class="back btn btn-primary d-block position-relative" onclick="getAllIngredients()"><i class="fa-solid fa-arrow-left"></i> Previous Page</button>
            </div>
            `;
            $(".meal-ingredient").css({cursor:"pointer"});
            $(".meal-ingredient").on("click",function(e){
                let currentMealName = e.target.innerText;
                getMealDetails(currentMealName);
            })
    }
    $(".ingredient-inner").on("click",function(){
        let currentIngredient = this.querySelector(".ingredient-name").textContent;
        getMealsByIngredient(currentIngredient)
    })
}

function getContact(){
    htmlContainer.innerHTML="";
    htmlContainer.innerHTML=`
        <section class="contact min-vh-100 d-flex justify-content-center align-items-center">
            <div class="container">
                <div class="form-content d-flex justify-content-center">
                    <form>
                        <div class="row g-4">
                            <div class="col-md-6">
                                <div class="name-input">
                                    <input type="text" class="form-control" placeholder="Enter Your Name">
                                    <div class="invalid-feedback d-none">Please Enter a Valid Name</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="email-input">
                                    <input type="email" class="form-control" placeholder="Enter Your Email">
                                    <div class="invalid-feedback d-none">Please Enter a Valid Email</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="phone-input">
                                    <input type="tel" class="form-control" placeholder="Enter Your Phone">
                                    <div class="invalid-feedback d-none">Please Enter a Valid Phone</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="age-input">
                                    <input type="number" class="form-control" placeholder="Enter Your Age">
                                    <div class="invalid-feedback d-none">Please enter a Valid Age</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="password-input">
                                    <input type="password" class="form-control" placeholder="Enter Your Password">
                                    <div class="invalid-feedback d-none">Please Enter valid password *Minimum eight characters, at least one letter and one number*</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="repassword-input">
                                    <input type="password" class="form-control" placeholder="Retype Password">
                                    <div class="invalid-feedback d-none">Passwords are not the same</div>
                                </div>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-outline-danger mt-3 mx-auto d-block" disabled id="submit">Submit</button>
                    </form>
                </div>
            </div>
        </section>
    `
    closeSideNav()
     //! Regex
    let nameRegex = /^[A-Za-z\s]{3,}$/;
    let emailRegex=/^[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}\.(com|net|org)$/;
    let phoneRegex =/^[0][0-9]{10}$/;
    let ageRegex= /^(1[89]|[2-9]\d)$/;
    let passwordRegex=/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/



    let nameInput = document.querySelector(".name-input input");
    let emailInput = document.querySelector(".email-input input");
    let phoneInput = document.querySelector(".phone-input input");
    let ageInput = document.querySelector(".age-input input");
    let passwordInput = document.querySelector(".password-input input");
    let rePasswordInput = document.querySelector(".repassword-input input");
    let submitBtn= document.querySelector("#submit");

   function checkContact() {
    let nameValid = validateContact(nameRegex, nameInput);
    let emailValid = validateContact(emailRegex, emailInput);
    let phoneValid = validateContact(phoneRegex, phoneInput);
    let ageValid = validateContact(ageRegex, ageInput);
    let passwordValid = validateContact(passwordRegex, passwordInput);
    let rePasswordValid = passwordInput.value === rePasswordInput.value && passwordInput.value !== "";
    let rePassFeedback = rePasswordInput.nextElementSibling;
    if (rePasswordInput.value === "") {
        rePassFeedback.classList.add("d-none");
        rePasswordInput.classList.remove("is-invalid", "is-valid");
    } else if (rePasswordValid) {
        rePasswordInput.classList.remove("is-invalid");
        rePasswordInput.classList.add("is-valid");
        rePassFeedback.classList.add("d-none");
    } else {
        rePasswordInput.classList.remove("is-valid");
        rePasswordInput.classList.add("is-invalid");
        rePassFeedback.classList.remove("d-none");
    }

    if (nameValid && emailValid && phoneValid && ageValid && passwordValid && rePasswordValid) {
        submitBtn.removeAttribute("disabled");
        submitBtn.addEventListener("click", () => {
            setTimeout(() => {
                window.location.href = "index.html";
            },250)
        })
    } else {
        submitBtn.setAttribute("disabled", "disabled");
    }
}

    nameInput.addEventListener("input",checkContact);
    emailInput.addEventListener("input",checkContact);
    phoneInput.addEventListener("input",checkContact);
    ageInput.addEventListener("input",checkContact);
    passwordInput.addEventListener("input",checkContact);
    rePasswordInput.addEventListener("input",checkContact);
}
function validateContact(regex, element) {
    let isValid = regex.test(element.value);
    let feedback = element.nextElementSibling;

    if (element.value === "") {
        feedback.classList.add("d-none");
        element.classList.remove("is-invalid", "is-valid");
        return false;
    }

    if (isValid) {
        element.classList.remove("is-invalid");
        element.classList.add("is-valid");
        feedback.classList.add("d-none");
    } else {
        element.classList.remove("is-valid");
        element.classList.add("is-invalid");
        feedback.classList.remove("d-none");
    }

    return isValid;
}

//! events
openCloseIcon.addEventListener("click",()=>{
        if(openCloseIcon.classList.contains("fa-align-justify")){
            openSideNav()
        }else{
            closeSideNav()
        }
    })


areaLink.addEventListener("click",()=>{
    getAllAreas()
})
categoriesLink.addEventListener("click",()=>{
    categories()
})
ingredientsLink.addEventListener("click",()=>{
    getAllIngredients()
})

contactLink.addEventListener("click",()=>{
    getContact()
})

$(function(){
    $(".loading-screen").fadeOut(1000,function(){
        $("body").css("overflow","auto")
        $(".loading-screen").remove()
        $(".loader").fadeOut(1000,function(){
            $(".loader").remove()
        });
    });  
})

