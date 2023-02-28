// delete the momentarily logged in user avatar
export const deleteAvatar = async (): Promise<{
  [key: string]: boolean | string;
}> => {
  const headers: Headers = new Headers();
  headers.append("Authorization", `Bearer ${localStorage.getItem("JWT")}`);

  const requestOptions: {
    method: string;
    headers: Headers;
  } = { method: "DELETE", headers };

  let response: Response;

  try {
    response = await fetch(
      `${
        process.env.REACT_APP_BASE_URL
          ? process.env.REACT_APP_BASE_URL
          : "http://localhost:3000"
      }/auth/me/avatar-unlink`,
      requestOptions
    );
  } catch (error: any) {
    return { result: false, message: error.message };
  }

  // if unauthorized
  if (response.status === 401)
    return { result: false, message: "Re-authenticate" };

  // if avatar uploaded
  if (response.status === 200)
    return { result: true, message: "Avatar has been deleted" };

  return { result: false, message: response.statusText };
};
