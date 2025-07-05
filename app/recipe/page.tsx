"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation"; // Import useSearchParams AND useRouter
import Navbar from "../components/Navbar"; // Adjust path as necessary
import Card from "../components/Card"; // Adjust path as necessary

// Base URL for the MealDB API
const MEALDB_BASE_URL = "https://www.themealdb.com/api/json/v1/1/";

interface Recipe {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube: string;
  // Dynamically add strIngredientX and strMeasureX properties
  strIngredient1?: string;
  strIngredient2?: string;
  strIngredient3?: string;
  strIngredient4?: string;
  strIngredient5?: string;
  strIngredient6?: string;
  strIngredient7?: string;
  strIngredient8?: string;
  strIngredient9?: string;
  strIngredient10?: string;
  strIngredient11?: string;
  strIngredient12?: string;
  strIngredient13?: string;
  strIngredient14?: string;
  strIngredient15?: string;
  strIngredient16?: string;
  strIngredient17?: string;
  strIngredient18?: string;
  strIngredient19?: string;
  strIngredient20?: string;
  strMeasure1?: string;
  strMeasure2?: string;
  strMeasure3?: string;
  strMeasure4?: string;
  strMeasure5?: string;
  strMeasure6?: string;
  strMeasure7?: string;
  strMeasure8?: string;
  strMeasure9?: string;
  strMeasure10?: string;
  strMeasure11?: string;
  strMeasure12?: string;
  strMeasure13?: string;
  strMeasure14?: string;
  strMeasure15?: string;
  strMeasure16?: string;
  strMeasure17?: string;
  strMeasure18?: string;
  strMeasure19?: string;
  strMeasure20?: string;
}

export default function Recipe() {
  const searchParams = useSearchParams();
  const router = useRouter(); // Initialize useRouter
  const mealName = searchParams.get("name"); // Get the meal name from the URL query parameter

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      if (!mealName) {
        setError("Nama resep tidak ditemukan di URL.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch recipe details by name
        const url = `${MEALDB_BASE_URL}search.php?s=${mealName}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.meals && data.meals.length > 0) {
          setRecipe(data.meals[0]); // Take the first result
        } else {
          setRecipe(null);
          setError(`Resep dengan nama "${mealName}" tidak ditemukan.`);
        }
      } catch (err) {
        console.error("Gagal mengambil detail resep:", err);
        setError("Gagal memuat detail resep. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [mealName]); // Re-run effect if mealName changes

  // Function to extract ingredients and measures
  const getIngredients = (recipe: Recipe) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      // MealDB API supports up to 20 ingredients
      // Access properties using bracket notation, now type-safe due to optional properties
      const ingredient = recipe[`strIngredient${i}` as keyof Recipe];
      const measure = recipe[`strMeasure${i}` as keyof Recipe];
      if (
        ingredient &&
        typeof ingredient === "string" &&
        ingredient.trim() !== ""
      ) {
        ingredients.push(
          `${
            measure && typeof measure === "string" ? measure.trim() : ""
          } ${ingredient.trim()}`
        );
      }
    }
    return ingredients;
  };

  // Handler for "Back to Recipes" button
  const handleBackToRecipes = () => {
    router.push("/menu"); // Navigate back to the home page (root URL)
  };

  return (
    <>
      <Navbar />
      <Card>
        <div className="flex flex-col min-h-[calc(100vh-150px)] p-4">
          {loading && (
            <p className="text-center text-lg mt-4">Memuat detail resep...</p>
          )}
          {error && <p className="text-center text-red-500 mt-4">{error}</p>}

          {!loading && !error && !recipe && (
            <p className="text-center text-gray-700 mt-4">
              Resep tidak ditemukan.
            </p>
          )}

          {!loading && !error && recipe && (
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 text-center">
                {recipe.strMeal}
              </h1>
              <p className="text-gray-600 text-md mb-4 text-center">
                Kategori:{" "}
                <span className="font-medium">{recipe.strCategory}</span>
              </p>

              {recipe.strMealThumb && (
                <div className="relative w-full h-64 md:h-96 mb-6 rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                  />
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-slate-700 mb-3">
                  Bahan-bahan:
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {getIngredients(recipe).map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-slate-700 mb-3">
                  Instruksi:
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {recipe.strInstructions}
                </p>
              </div>

              {recipe.strYoutube && (
                <div className="text-center mt-6">
                  <a
                    href={recipe.strYoutube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5 mr-2"
                    >
                      <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm4.5 10.5l-6 4.5V5.5l6 4.5z" />
                    </svg>
                    Tonton Video Resep di YouTube
                  </a>
                </div>
              )}

              {/* Back to Recipes Button */}
              <div className="text-center mt-8">
                <button
                  onClick={handleBackToRecipes}
                  className="inline-flex items-center justify-center bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      fillRule="evenodd"
                      d="M17.778 9.222a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0l-7.25-7.25a.75.75 0 0 1 1.06-1.06L9.25 14.44V2.5a.75.75 0 0 1 1.5 0v11.94l5.972-5.972a.75.75 0 0 1 1.06 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Kembali ke Daftar Resep
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
