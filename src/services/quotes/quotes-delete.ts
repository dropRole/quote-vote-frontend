export const deleteQuote: Function = async (id: string): Promise<boolean> => {
  const headers: Headers = new Headers();
  headers.append("Authorization", `Bearer ${localStorage.getItem("JWT")}`);

  const requestOptions: { method: string; headers: Headers } = {
    method: "DELETE",
    headers,
  };

  let response: Response;

  try {
    response = await fetch(
      `${
        process.env.REACT_APP_BASE_URL
          ? process.env.REACT_APP_BASE_URL
          : "http://localhost:3000"
      }/quotes/me/${id}`,
      requestOptions
    );
  } catch (error) {
    return false;
  }

  // if quote deleted
  if (response.status === 200) return true;

  return false;
};
