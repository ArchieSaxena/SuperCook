import * as model from './model.js';
import { MODAL_CLOSE_SEC} from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';


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

    resultsView.update(model.getSearchResultPage());
    bookmarksView.update(model.state.bookmarks);

    await model.loadRecipe(id)//it will return promise so will need to await //recipe loaded here and will be stored inside state
    const {recipe}=model.state;
    
     //loading animation 

    
    //rendering recipe
    recipeView.render(model.state.recipe)
    

    // controlServings();
    
    
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


    //Render the initial pagination button
    paginationView.render(model.state.search);

    
  }
  catch(err)
  {
    console.log(err);
  }

};

// controlRecipes();


// window.addEventListener('haschange',controlRecipes);
// window.addEventListener('load',controlRecipes)

const controlPagination=function(gotoPage)//only when page is clicked
{
  console.log(gotoPage);
    //render new search results
    resultsView.render(model.getSearchResultPage(gotoPage));


    //Render the new pagination button
    paginationView.render(model.state.search)
}

const controlServings=function(newServings)
{
  //Update the recipe Servings in the state
  model.updateServings(newServings);  

  // recipeView.render(model.state.recipe);
  //Update the view as well that will be seen to user(RecipeView)
  recipeView.update(model.state.recipe);
}

const controlAddBookmark=function()
{
  //1)Add/remove BookMark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  console.log(model.state.recipe);

  //2)Update recipe View
  recipeView.update(model.state.recipe);

  //3)Render Bookmark
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks=function()
{
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe=async function(newRecipe)
{
  try
  {
    console.log(newRecipe);

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render recipe
    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage();
    //close form window
    setTimeout(function(){
      addRecipeView.toggleWindow()},MODAL_CLOSE_SEC*1000)
  }
  
  catch(err)
  {
    console.error('errr');
    addRecipeView.renderError(err.message);
  }
}
const init=function()
{
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe); //publisher subscriber

  
}
init();