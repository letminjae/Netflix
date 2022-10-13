const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_PATH = "https://api.themoviedb.org/3";

interface ISearchResult {
  id: number;
  name?: string;
  title?: string;
}

export interface IGetSearchKey {
  page: number;
  results: ISearchResult[];
  total_pages: number;
  total_results: number;
}

export async function getSearchKey(keyword: string, type: string) {
  return await (
    await fetch(
      `${BASE_PATH}/search/${type}?api_key=${API_KEY}&query=${keyword}`
    )
  ).json();
}

