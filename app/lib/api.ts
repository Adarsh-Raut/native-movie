const BASE_URL = "https://api.themoviedb.org/3";
const TMDB_API = "03a96c70bce925ba25c9e5110048bf29";
export const fetchMovies = async (searchTerm: string) => {
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${TMDB_API}&language=en-US&query=${encodeURIComponent(
      searchTerm
    )}&page=1`
  );
  return response.json();
};
