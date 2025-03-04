"use client";

import { useEffect, useState } from "react";
import { fetchFilteredRecipes, fetchAllRecipes } from "@/lib/api";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

interface Meal {
  strCategory: string;
  strArea: string;
  strMeal: string;
  strMealThumb: string;
  idMeal: string;
  [key: string]: string | null | undefined;
}

export default function RecipesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);

  // Retrieve selected filters from the URL
  const category = searchParams.get("category") || "";
  const ingredient = searchParams.get("ingredient") || "";
  const country = searchParams.get("country") || "";

  // Dynamic title based on filters
  let title = "All recipes";
  if (category) title = `Recipes in the category: ${category}`;
  if (ingredient) title = `Recipes with the ingredient: ${ingredient}`;
  if (country) title = `Recipes from the country: ${country}`;

  // Load all possible filters (categories, ingredients, countries)
  useEffect(() => {
    async function fetchFilters() {
      setLoading(true);
      const data = await fetchAllRecipes();

      // Ensure data.meals is properly typed
      const meals = data.meals as Meal[];

      // Create unique filter lists
      const uniqueCategories = Array.from(
        new Set(meals.map((meal) => meal.strCategory))
      );
      const uniqueIngredients = Array.from(
        new Set(
          meals.flatMap(
            (meal) =>
              Array.from(
                { length: 20 },
                (_, i) => meal[`strIngredient${i + 1}`]
              ).filter((ingredient) => ingredient) // Фільтрація значень null та undefined
          )
        )
      );
      const uniqueCountries = Array.from(
        new Set(meals.map((meal) => meal.strArea))
      );

      setCategories(uniqueCategories);
      setIngredients(uniqueIngredients as string[]);
      setCountries(uniqueCountries);
      setLoading(false);
    }

    fetchFilters();
  }, []);

  // Load recipes based on selected filters
  useEffect(() => {
    async function fetchRecipes() {
      setLoading(true);
      const data = await fetchFilteredRecipes(category, ingredient, country);

      setRecipes(data.meals || []);
      setLoading(false);
    }

    fetchRecipes();
  }, [category, ingredient, country]);

  // Update URL params based on filter changes
  const updateFilter = (type: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      // If a filter is selected, set it and reset others
      if (type === "category") {
        params.set("category", value);
        params.delete("ingredient");
        params.delete("country");
      } else if (type === "ingredient") {
        params.set("ingredient", value);
        params.delete("category");
        params.delete("country");
      } else if (type === "country") {
        params.set("country", value);
        params.delete("category");
        params.delete("ingredient");
      }
    } else {
      // If value is empty, remove that filter from URL
      params.delete(type);
    }
    router.push(`/recipes?${params.toString()}`);
  };

  // Reset all filters
  const handleResetFilters = () => {
    router.push("/recipes");
  };

  return (
    <div className='container mx-auto p-4'>
      {/* Title */}
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-3xl font-bold'>{title}</h1>
        {(category || ingredient || country) && (
          <button
            onClick={handleResetFilters}
            className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition'
          >
            Reset filter
          </button>
        )}
      </div>

      {/* Filters */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        {/* Category */}
        <select
          value={category}
          onChange={(e) => updateFilter("category", e.target.value)}
          className='p-2 border rounded-md'
        >
          <option value=''>All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat} className='text-gray-900'>
              {cat}
            </option>
          ))}
        </select>

        {/* Ingredient */}
        <select
          value={ingredient}
          onChange={(e) => updateFilter("ingredient", e.target.value)}
          className='p-2 border rounded-md'
        >
          <option value=''>All ingredients</option>
          {ingredients.map((ing) => (
            <option key={ing} value={ing} className='text-gray-900'>
              {ing}
            </option>
          ))}
        </select>

        {/* Country */}
        <select
          value={country}
          onChange={(e) => updateFilter("country", e.target.value)}
          className='p-2 border rounded-md'
        >
          <option value=''>All countries</option>
          {countries.map((c) => (
            <option key={c} value={c} className='text-gray-900'>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Recipe List */}
      {loading ? (
        <p>Loading...</p>
      ) : recipes.length > 0 ? (
        <ul className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {recipes.map((recipe) => (
            <li
              key={recipe.idMeal}
              className='bg-gray-100 p-4 rounded-lg shadow-md'
            >
              <Link href={`/recipes/${recipe.idMeal}`} className='block'>
                <img
                  src={recipe.strMealThumb}
                  alt={recipe.strMeal}
                  className='w-full rounded-lg mb-2'
                />
                <h2 className='text-xl font-semibold text-gray-900'>
                  {recipe.strMeal}
                </h2>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recipes found.</p>
      )}
    </div>
  );
}
