export {async} from 'regenerator-runtime';
import {API_URL,TIME_OUT,RES_PER_PAGE,KEY} from './config.js';
import {getJSON,sendJSON} from './helpers.js';
import recipeView from './views/recipeView.js';

export const state={
    recipe:{},
    search:{
        query:'',
        page:1,
        results:[],
        resultsPerPage:RES_PER_PAGE,
    },
    bookmarks:[],
};
const createRecipeObject=function(data)
{
    const {recipe}=data.data;
    return {
        id:recipe.id,
        title:recipe.title,
        publisher:recipe.publisher,
        sourceUrl:recipe.source_url,
        image:recipe.image_url,
        servings:recipe.servings,
        cookingTime:recipe.cooking_time,
        ingredients:recipe.ingredients,
        ...(recipe.key && {key:recipe.key}), //short circuiting
        //key:recipe.key
    };
}
export const loadRecipe=async function(id) //fetching data from supercook api
{
    try{
        // const res = await fetch(
        //     `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
        //   );
        const data=await getJSON(`${API_URL}${id}`);
    // console.log(res,data);
    state.recipe=createRecipeObject(data);
    if(state.bookmarks.some(bookmark=>bookmark.id===id))
    {
        state.recipe.bookmarkes=true; 
    }
    else{
        state.recipe.bookmarked=false;
    }
    console.log(state.recipe);
    }
    catch(err)
    {
        //we need to display the error not in the console
        console.error(`err`);
        throw err;
    }
}

export const loadSearchResults=async function(query)
{
    try{
        //fetch api and convert into json
        state.search.query=query;
        const data=await getJSON(`${API_URL}?search=${query}`);
        console.log(data);

        state.search.results=data.data.recipes.map(rec=>{
            return{
                id:rec.id,
                title:rec.title,
                publisher:rec.publisher,
                image:rec.image_url,
            };
        });
        state.search.page=1;
        // console.log(state.search.results);
    }
    catch(err)
    {
        console.log(`${err}`);
        throw err;
    }
}


export const getSearchResultPage=function(page=state.search.page)
{

    state.search.page=page;
    const start=(page-1)*state.search.resultsPerPage;//0;
    const end= (page)*state.search.resultsPerPage; //9;
    return state.search.results.slice(start,end);
}

export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ing => {
      ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
      //newQt = oldQty*newServings/oldServings
    });
    state.recipe.servings = newServings;
  };

//store data whenever we add or delete bookmark
const persistBookmarks=function(recipe)
{
    localStorage.setItem('bookmarks',JSON.stringify(state.bookmarks));
}
export const addBookmark=function(recipe)
{
    //add bookmark
    state.bookmarks.push(recipe);

    //mark current recipe as bookmarked
    if(recipe.id===state.recipe.id)
    {
        state.recipe.bookmarked=true;
    }
    persistBookmarks();

}

export const deleteBookmark=function(id)
{
    //delete bookmark
    const index=state.bookmarks.findIndex(el=>el.id===id);
    state.bookmarks.splice(index,1);

    //mark current recipe as not bookmarked
    if(id===state.recipe.id)
    {
        state.recipe.bookmarked=false;
    }
    persistBookmarks();
};

const init=function()
{
    const storage=localStorage.getItem('bookmarks');
    if(storage) state.bookmarks=JSON.parse(storage);//string back to object
}

init();
console.log(state.bookmarks);


const clearBookmarks=function()
{
    localStorage.clear('bookmarks');
}
clearBookmarks();

//send data to API
export const uploadRecipe=async function(newRecipe)
{
    try{
        console.log(Object.entries(newRecipe));
        const ingredients=Object.entries(newRecipe).filter(entry=>entry[0].startsWith('ingredient') && entry[1]!=='').map(ing=>{
            const ingArr=ing[1].replaceAll(' ','').split(',');
            if(ingArr.length!==3) throw new Error('Wrong ingredient format! Please use the correct format');
            const [quantity,unit,description]=ingArr;
            return {quantity:quantity? +quantity:null,unit,description};
        });//converting it into object
        
        console.log(ingredients);

        const recipe={
            title:newRecipe.title,
            source_url:newRecipe.sourceUrl,
            image_url:newRecipe.image,
            publisher:newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        }
        console.log(recipe);
        const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
        console.log(data);
        state.recipe=createRecipeObject(data);
        addBookmark(state.recipe);

    }
    catch(err)
    {
        throw err;
    }
    
};