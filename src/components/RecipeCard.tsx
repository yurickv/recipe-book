"use client";

import { useRouter } from "next/navigation";

interface RecipeCardProps {
  recipe: {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
  };
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const router = useRouter();

  return (
    <div
      className='border rounded-lg p-4 shadow-lg cursor-pointer hover:shadow-xl transition'
      onClick={() => router.push(`/recipes/${recipe.idMeal}`)}
    >
      <img
        src={recipe.strMealThumb}
        alt={recipe.strMeal}
        className='w-full h-40 object-cover rounded-md'
      />
      <h2 className='text-lg font-semibold mt-2'>{recipe.strMeal}</h2>
    </div>
  );
}
