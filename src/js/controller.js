import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';


import 'core-js/stable';//polyfilling everything else
import 'regenerator-runtime/runtime';//polyfilling async await
import searchView from './views/searchView.js';
// const recipeContainer = document.querySelector('.recipe');



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
    // alert(err);
    recipeView.renderError();
  }
};

const controlSearchResults=async function()
{

  try{
    //1)get search query
    const query=searchView.getQuery();
    if(!query) return;
    

    //2)load search results
    await model.loadSearchResults(query);//this fxn does not return anything but just manipulates state

    //3)render results
    console.log(model.state.search.results);
  }
  catch(err)
  {
    console.log(err);
  }
};

// controlRecipes();


// window.addEventListener('haschange',controlRecipes);
// window.addEventListener('load',controlRecipes)

const init=function()
{
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
}
init();