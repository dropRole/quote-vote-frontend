// post a new quote
export const postQuote: Function = async (
  form: HTMLFormElement
): Promise<boolean> => {
  const headers: Headers = new Headers();
  headers.append("Authorization", `Bearer ${localStorage.getItem("JWT")}`);
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  const formData: FormData = new FormData(form);

  const body: URLSearchParams = new URLSearchParams();

  for (const [key, value] of formData.entries())
    body.append(key, value.toString());

  const requestOptions: {
    method: string;
    headers: Headers;
    body: URLSearchParams;
  } = {
    method: "POST",
    headers,
    body,
  };

  let response: Response;

  try {
    response = await fetch(
      "http://localhost:3000/quotes/me/myquote",
      requestOptions
    );
  } catch (error) {
    return false;
  }

  // if posted
  if (response.status === 201) return true;

  return false;
};
