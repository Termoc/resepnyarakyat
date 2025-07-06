"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation"; // Import useRouter and useSearchParams

import Navbar from "../components/Navbar";
import Searchbar from "../components/Searchbar";
import Card from "../components/Card";

// Base URL for the MealDB API
const MEALDB_BASE_URL = "https://www.themealdb.com/api/json/v1/1/";

interface Recipe {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube: string;
}

export default function Menu() {
  const router = useRouter(); // Initialize useRouter
  const searchParams = useSearchParams(); // Initialize useSearchParams

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState<string>(""); // State for the search input value
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  // Initialize currentPage from URL param 'page' or default to 1
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const itemsPerPage = 9; // Display 9 recipes per page (3x3 grid)

  // Function to fetch recipes based on a given search term
  // If no term is provided, it fetches all meals by iterating through the alphabet.
  const fetchRecipes = useCallback(async (term: string) => {
    setLoading(true);
    setError(null);
    setRecipes([]); // Clear previous recipes before new fetch

    let fetchedMeals: Recipe[] = [];

    if (term) {
      // If a search term is provided, fetch specific meals by name
      const url = `${MEALDB_BASE_URL}search.php?s=${term}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.meals) {
          fetchedMeals = data.meals;
        }
      } catch (err) {
        console.error("Gagal mengambil resep untuk istilah:", term, err);
        setError("Gagal memuat resep untuk pencarian Anda.");
      }
    } else {
      // If no search term, fetch all meals by iterating through the alphabet
      // This can be slow as it makes 26 API calls.
      const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
      const fetchPromises = alphabet.map(async (letter) => {
        const url = `${MEALDB_BASE_URL}search.php?f=${letter}`;
        try {
          const response = await fetch(url);
          if (!response.ok) {
            // Log warning but don't stop the whole process if one letter fails
            console.warn(
              `Gagal mengambil resep untuk huruf ${letter}: ${response.status}`
            );
            return [];
          }
          const data = await response.json();
          return data && data.meals ? data.meals : [];
        } catch (err) {
          console.error(`Gagal mengambil resep untuk huruf ${letter}:`, err);
          return [];
        }
      });

      try {
        const allResults = await Promise.all(fetchPromises);
        // Flatten the array of arrays and remove duplicates using a Map
        const uniqueMeals = new Map<string, Recipe>();
        allResults.forEach((mealsArray) => {
          mealsArray.forEach((meal: Recipe) => {
            uniqueMeals.set(meal.idMeal, meal); // Use idMeal as key for uniqueness
          });
        });
        fetchedMeals = Array.from(uniqueMeals.values());
      } catch (err) {
        console.error("Gagal mengambil semua resep berdasarkan alfabet:", err);
        setError("Gagal memuat semua resep. Silakan coba lagi nanti.");
      }
    }

    setRecipes(fetchedMeals);
    setLoading(false);
  }, []); // Empty dependency array means this function is created once

  // useEffect to read the search term and page number from the URL on component mount
  // and whenever the URL's search parameters change.
  useEffect(() => {
    const searchTermFromUrl = searchParams.get("s") || ""; // Get 's' parameter from URL
    const pageFromUrl = parseInt(searchParams.get("page") || "1", 10); // Get 'page' parameter from URL

    setSearch(searchTermFromUrl); // Update the input field with the URL term
    setCurrentPage(pageFromUrl); // Set current page from URL

    fetchRecipes(searchTermFromUrl); // Fetch recipes based on the URL term
  }, [searchParams, fetchRecipes]); // Re-run when searchParams or fetchRecipes changes

  // Handler for when the search button is clicked or Enter is pressed in the Searchbar
  const handleSearchSubmit = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (search) {
      newSearchParams.set("s", search); // Set the 's' parameter if search term exists
    } else {
      newSearchParams.delete("s"); // Remove the 's' parameter if search term is empty
    }
    newSearchParams.set("page", "1"); // Reset page to 1 on new search
    // Update the URL without a full page reload
    router.push(`/menu?${newSearchParams.toString()}`);
  };

  // Pagination Logic
  const indexOfLastRecipe = currentPage * itemsPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - itemsPerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(recipes.length / itemsPerPage);

  const updatePageInUrl = (newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("page", newPage.toString());
    router.push(`/menu?${newSearchParams.toString()}`);
  };

  const handleNextPage = () => {
    const newPage = Math.min(currentPage + 1, totalPages);
    setCurrentPage(newPage);
    updatePageInUrl(newPage);
  };

  const handlePrevPage = () => {
    const newPage = Math.max(currentPage - 1, 1);
    setCurrentPage(newPage);
    updatePageInUrl(newPage);
  };

  // Handler for clicking on a recipe card
  const handleRecipeClick = (mealName: string) => {
    // Encode the meal name to handle spaces and special characters in URL
    router.push(`/recipe?name=${encodeURIComponent(mealName)}`);
  };

  return (
    <>
      <Navbar />
      {/* Pass the search state, setSearch function, and the new onSubmit handler */}
      <Searchbar
        search={search}
        setSearch={setSearch}
        onSubmit={handleSearchSubmit}
      />

      <Card>
        {/* Wrap all content inside Card with a flex column to push pagination to the bottom */}
        <div className="flex flex-col min-h-[calc(100vh-150px)]">
          {" "}
          {/* min-h ensures content area is tall enough */}
          {loading && (
            <p className="text-center text-lg mt-4">Memuat resep...</p>
          )}
          {error && <p className="text-center text-red-500 mt-4">{error}</p>}
          {!loading &&
            !error &&
            recipes.length === 0 &&
            searchParams.get("s") && (
              <p className="text-center text-gray-700 mt-4">
                Tidak ada resep ditemukan untuk {searchParams.get("s")}.
              </p>
            )}
          {!loading &&
            !error &&
            recipes.length === 0 &&
            !searchParams.get("s") && (
              <p className="text-center text-gray-700 mt-4">
                Tidak ada resep yang dimuat. Silakan coba lagi atau mulai
                pencarian!
              </p>
            )}
          {/* Recipe grid - add flex-grow to make it expand and push pagination down */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 mx-auto min-w-200 max-w-300 flex-grow">
            {currentRecipes.map(
              (
                recipe // Use currentRecipes for mapping
              ) => (
                <div
                  key={recipe.idMeal}
                  className="rounded-lg shadow-lg hover:-translate-y-1 hover:shadow-xl hover:fourth-bgs ease duration-300 overflow-hidden flex flex-col cursor-pointer " // Added cursor-pointer
                  onClick={() => handleRecipeClick(recipe.strMeal)} // Add onClick handler
                >
                  {recipe.strMealThumb && (
                    <div className="relative w-full h-48">
                      <Image
                        src={recipe.strMealThumb}
                        alt={recipe.strMeal}
                        fill
                        style={{ objectFit: "cover" }}
                        className="rounded-t-lg"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">
                      {recipe.strMeal}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Kategori:{" "}
                      <span className="font-medium">{recipe.strCategory}</span>
                    </p>
                    <div className="mt-auto">
                      {recipe.strYoutube && (
                        <a
                          href={recipe.strYoutube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
                          onClick={(e) => e.stopPropagation()} // Prevent card click from triggering when clicking YouTube link
                        >
                          Tonton di YouTube
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-4 h-4 ml-1"
                          >
                            <path d="M4.5 3A1.5 1.5 0 0 0 3 4.5v11A1.5 1.5 0 0 0 4.5 17h11a1.5 1.5 0 0 0 1.5-1.5v-7A.75.75 0 0 0 16.5 8h-2.75a.75.75 0 0 1-.75-.75V4.5A1.5 1.5 0 0 0 12.25 3H4.5ZM16.5 9.75h-2.75a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 0 .75.75h2.75A.75.75 0 0 0 17.25 13V10.5a.75.75 0 0 0-.75-.75Zm-6-1.5a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75V11a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75V8.25Z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
          {/* Pagination Controls - Added pb-8 for bottom padding */}
          {!loading && !error && recipes.length > 0 && (
            <div className="flex justify-center items-center mt-8 space-x-4 pb-8">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="rounded-md bg-[#EA2F14] py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-[#FB9E3A] focus:shadow-none active:bg-[#FCEF91] hover:bg-[#E6521F] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              >
                Sebelumnya
              </button>
              <span className="text-lg font-medium text-slate-700">
                Halaman {currentPage} dari {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="rounded-md bg-[#EA2F14] py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-[#FB9E3A] focus:shadow-none active:bg-[#FCEF91] hover:bg-[#E6521F] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              >
                Berikutnya
              </button>
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
