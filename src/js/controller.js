import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';


import 'core-js/stable';//polyfilling everything else
import 'regenerator-runtime/runtime';//polyfilling async await
import {async} from 'regenerator-runtime';
// const recipeContainer = document.querySelector('.recipe');

// if(module.hot)
// {
//   module.hot.accept();
// }

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
    resultsView.renderSpinner();
    console.log(resultsView);
    //1)get search query
    const query=searchView.getQuery();
    if(!query) return;


    //2)load search results
    await model.loadSearchResults(query);//this fxn does not return anything but just manipulates state

    //3)render search results
    // console.log(model.state.search.results);
    // resultsView.render(model.state.search.results);//all results are rendered over here
    resultsView.render(model.getSearchResultPage());
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