import { IQuote } from "../../App";

// get random quote
export const getRandomQuote: Function = async (): Promise<IQuote> => {
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

  // if succeeded
  if (response.status === 200) return await response.json();

  return {} as IQuote;
};

// get quotes regarding the given criterions
export const getQuotes: Function = async (
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

  let response: Response;
  try {
    response = await fetch(
      `http://localhost:3000/quotes?search=${search}&author=${author}&limit=${limit}`,
      requestOptions
    );

  } catch (error) {
    return [];
  }

  // if succeeded
  if (response.status === 200) return response.json();

  return [];
};
