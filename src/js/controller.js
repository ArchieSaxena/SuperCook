import * as model from './model.js';
import recipeView from './views/recipeView.js';


import 'core-js/stable';//polyfilling everything else
import 'regenerator-runtime/runtime';//polyfilling async await
const recipeContainer = document.querySelector('.recipe');



// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

console.log('TEST');

const controlRecipes=async function()
{
  try{
    const id = window.location.hash.slice(1); 
    console.log("print id");
    console.log(id);
    if (!id) return;
    recipeView.renderSpinner(); //loading animation until we fetch the data

    // recipeView.renderSpinner();
    //loading recipe
    await model.loadRecipe(id)//it will return promise so will need to await //recipe loaded here and will be stored inside state
    const {recipe}=model.state;
    
     //loading animation 


    //rendering recipe
    recipeView.render(model.state.recipe)
    
    
  }
  catch(err)
  {
    alert(err);
  }
};
controlRecipes();

['hashchange','load'].forEach(ev=>window.addEventListener(ev,controlRecipes));
// window.addEventListener('haschange',controlRecipes);
// window.addEventListener('load',controlRecipes)