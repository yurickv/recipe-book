const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function fetchAllRecipes() {
  const res = await fetch(`${BASE_URL}/search.php?s=`);
  return res.json();
}

export async function fetchFilteredRecipes(
  category = "",
  ingredient = "",
  country = ""
) {
  let query = "";

  if (category) query = `${BASE_URL}/filter.php?c=${category}`;
  else if (ingredient) query = `${BASE_URL}/filter.php?i=${ingredient}`;
  else if (country) query = `${BASE_URL}/filter.php?a=${country}`;
  else query = `${BASE_URL}/search.php?s=`;

  const res = await fetch(query);
  return res.json();
}

export async function fetchRecipeById(id: string) {
  const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
  return res.json();
}
