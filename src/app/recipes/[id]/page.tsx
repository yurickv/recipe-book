import { fetchRecipeById, fetchFilteredRecipes } from "@/lib/api";
import Link from "next/link";

export default async function RecipeDetail({
  params,
}: {
  params: { id: string };
}) {
  const { meals } = await fetchRecipeById(params.id);
  const recipe = meals?.[0];

  if (!recipe) return <p>Recipe not found</p>;

  // Extract ingredients dynamically
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    if (ingredient) ingredients.push(ingredient);
  }

  // Fetch other recipes from the same category for the sidebar
  const categoryRecipesData = await fetchFilteredRecipes(
    recipe.strCategory,
    "",
    ""
  );
  const categoryRecipes = categoryRecipesData?.meals || [];

  return (
    <div className='container mx-auto p-4 flex flex-col md:flex-row'>
      {/* Left Column - Recipe Details */}
      <div className='md:w-3/4'>
        <div className='flex flex-col md:flex-row gap-6'>
          {/* Recipe Image */}
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            className='w-full md:w-1/3 rounded-lg shadow-lg'
          />

          {/* Recipe Name & Country */}
          <div className='text-center md:text-left flex-1'>
            <h1 className='text-3xl font-bold'>{recipe.strMeal}</h1>
            <Link
              href={`/recipes?country=${recipe.strArea}`}
              className='text-blue-500 hover:underline text-lg'
            >
              {recipe.strArea}
            </Link>
          </div>
        </div>

        {/* Recipe Instructions */}
        <div className='mt-6'>
          <h2 className='text-xl font-semibold mb-2'>Instructions</h2>
          <p className='whitespace-pre-line'>{recipe.strInstructions}</p>
        </div>

        {/* Recipe Ingredients */}
        <div className='mt-6'>
          <h2 className='text-xl font-semibold mb-2'>Ingredients</h2>
          <ul className='grid grid-cols-2 md:grid-cols-3 gap-2'>
            {ingredients.map((ingredient) => (
              <li key={ingredient}>
                <Link
                  href={`/recipes?ingredient=${ingredient}`}
                  className='text-blue-500 hover:underline'
                >
                  {ingredient}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Sidebar - Category Recipes */}
      <aside className='md:w-1/4 mt-6 md:mt-0 md:pl-6'>
        <h2 className='text-xl font-semibold mb-3'>
          More {recipe.strCategory} Recipes
        </h2>
        <ul className='space-y-3'>
          {categoryRecipes.map((categoryRecipe: any) => (
            <li key={categoryRecipe.idMeal}>
              <Link
                href={`/recipes/${categoryRecipe.idMeal}`}
                className='block bg-gray-100 p-3 rounded-lg shadow-md hover:bg-gray-200 text-gray-800'
              >
                {categoryRecipe.strMeal}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
