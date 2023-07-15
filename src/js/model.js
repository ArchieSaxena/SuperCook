export {async} from 'regenerator-runtime';
import {API_URL} from './config.js';
import {getJSON} from './helpers.js';

export const state={
    recipe:{},
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
        console.error(`err`);
    }
}