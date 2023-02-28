// update a given quote
export const updateQuote: Function = async (
  form: HTMLFormElement
): Promise<boolean> => {
  const headers: Headers = new Headers();
  headers.append("Authorization", `Bearer ${localStorage.getItem("JWT")}`);
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  const formData: FormData = new FormData(form);

  const body: URLSearchParams = new URLSearchParams();

  for (const [key, value] of formData.entries()) {
    // if id field
    if (key !== "id") body.append(key, value.toString());
  }

  const requestOptions: {
    method: string;
    headers: Headers;
    body: URLSearchParams;
  } = {
    method: "PATCH",
    headers,
    body,
  };

  let response: Response;

  try {
    response = await fetch(
      `${
        process.env.REACT_APP_BASE_URL
          ? process.env.REACT_APP_BASE_URL
          : "http://localhost:3000"
      }/quotes/me/myquote/${formData.get("id")}`,
      requestOptions
    );
  } catch (error) {
    return false;
  }

  // if posted
  if (response.status === 200) return true;

  return false;
};
