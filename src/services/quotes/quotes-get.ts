import { IQuote } from "../../App";

// get random quote
export const getRandomQuote = async (): Promise<IQuote> => {
  const headers: Headers = new Headers();
  headers.append("Authorization", `Bearer ${localStorage.getItem("JWT")}`);

  const requestOptions: { method: string; headers: Headers } = {
    method: "GET",
    headers,
  };

  let response: Response;
  try {
    response = await fetch(
      "http://localhost:3000/quotes/rand/one",
      requestOptions
    );
  } catch (error) {
    return {} as IQuote;
  }

  // if unauthorized
  if (response.status === 401) return {} as IQuote;

  return response.json();
};

// get quotes regarding the given criterions
export const getQuotes = async (
  search: string,
  author: string,
  limit: number
): Promise<IQuote[]> => {
  const requestOptions: { method: string; headers: Headers } = {
    method: "GET",
    headers: new Headers(),
  };

  localStorage.getItem("JWT") &&
    requestOptions.headers.append(
      "Authorization",
      `Bearer ${localStorage.getItem("JWT")}`
    );

  let quotes: IQuote[], response: Response;
  try {
    response = await fetch(
      `http://localhost:3000/quotes?search=${search}&author=${author}&limit=${limit}`,
      requestOptions
    );

    quotes = await response.json();
  } catch (error) {
    return [];
  }

  // if unauthorized
  if (response.status === 401) return [];

  return quotes;
};
