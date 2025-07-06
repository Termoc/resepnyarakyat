import React from "react";

/**
 * A reusable SearchInput component with an icon, input field, and a search button.
 * It uses Tailwind CSS for styling.
 */

interface SearchbarProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  // ADD THIS: A function to be called when the search button is clicked.
  onSubmit: () => void;
}

const Searchbar: React.FC<SearchbarProps> = ({
  search,
  setSearch,
  onSubmit,
}) => {
  // Handler function to update state on input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  // Handler for form submission (e.g., pressing Enter)
  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent page reload
    onSubmit(); // Call the function from props
  };

  return (
    <div className="items-center flex justify-center">
      <form
        className="w-full min-w-[200px] flex justify-center items-center p-5"
        onSubmit={handleFormSubmit} // Use a form for better accessibility (allows Enter key)
      >
        <div className="relative flex justify-center items-center w-full max-w-lg">
          {/* Search Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute w-5 h-5 top-1/2 -translate-y-1/2 left-3 text-slate-500"
          >
            <path
              fillRule="evenodd"
              d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
              clipRule="evenodd"
            />
          </svg>

          {/* Input Field */}
          <input
            type="text"
            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            placeholder="Search for a meal..."
            value={search}
            onChange={handleInputChange}
          />

          {/* Search Button - NOW a submit button */}
          <button
            className="rounded-md bg-[#EA2F14] py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:third-bgs focus:shadow-none active:fourth-bgs hover:second-bgs active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
            type="submit" // Change type to "submit"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default Searchbar;
