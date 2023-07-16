export {async} from 'regenerator-runtime';
import {API_URL,RES_PER_PAG, RES_PER_PAGE} from './config.js';
import {getJSON} from './helpers.js';
import recipeView from './views/recipeView.js';

export const state={
    recipe:{},
    search:{
        query:'',
        page:1,
        results:[],
        resultsPerPage:RES_PER_PAGE,
    }
};

export const loadRecipe=async function(id) //fetching data from supercook api
{
    try{
        // const res = await fetch(
        //     `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
        //   );
        const data=await getJSON(`${API_URL}${id}`);
    // console.log(res,data);
    let {recipe}=data.data;
    state.recipe={
        id:recipe.id,
        title:recipe.title,
        publisher:recipe.publisher,
        sourceUrl:recipe.source_url,
        image:recipe.image_url,
        servings:recipe.servings,
        cookingTime:recipe.cooking_time,
        ingredients:recipe.ingredients,
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