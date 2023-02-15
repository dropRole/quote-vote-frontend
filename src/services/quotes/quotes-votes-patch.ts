// up or down vote on the given quote
export const voteOnQuote: Function = async (
  id: string,
  vote: boolean
): Promise<boolean> => {
  const headers: Headers = new Headers();
  headers.append("Authorization", `Bearer ${localStorage.getItem("JWT")}`);

  const requestOptions: { method: string, headers: Headers } = {
    method: "PATCH",
    headers: headers,
  };

  let response: Response;
  try {
    response = await fetch(
      `http://localhost:3000/quotes/${id}/${vote ? "upvote" : "downvote"}`,
      requestOptions
    );
  } catch (error) {
    return false;
  }

  // if request succeeded
  if (response.status === 200) return true;

  return false;
};