// update the currently logged in user basics
export const updateBasics = async (
  form: HTMLFormElement
): Promise<{ [key: string]: boolean | string }> => {
  const headers: Headers = new Headers();
  headers.append("Authorization", `Bearer ${localStorage.getItem("JWT")}`);
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  const body: URLSearchParams = new URLSearchParams();

  const formData: FormData = new FormData(form);

  for (const [key, value] of formData.entries())
    body.append(key, value.toString());

  const requestOptions: {
    method: string;
    headers: Headers;
    body: URLSearchParams;
  } = { method: "PATCH", headers, body };

  let response: Response;

  try {
    response = await fetch(
      `${
        process.env.REACT_APP_BASE_URL
          ? process.env.REACT_APP_BASE_URL
          : "http://localhost:3000"
      }/auth/me/basics`,
      requestOptions
    );
  } catch (error: any) {
    return { result: false, message: error.message };
  }

  // if username already exists
  if (response.status === 409)
    return { result: false, message: "Username already exists" };

  // if unauthorized
  if (response.status === 401)
    return { result: false, message: "Re-authenticate" };

  // if updated
  if (response.status === 200) {
    const { accessToken } = await response.json();

    return {
      result: true,
      message: "Basics updated",
      jwt: accessToken,
    };
  }

  return { result: false, message: response.statusText };
};

// update the currently logged in user password
export const updatePassword = async (
  form: HTMLFormElement
): Promise<{ [key: string]: boolean | string }> => {
  const headers: Headers = new Headers();
  headers.append("Authorization", `Bearer ${localStorage.getItem("JWT")}`);
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  const body: URLSearchParams = new URLSearchParams();

  const formData: FormData = new FormData(form);
  for (const [key, value] of formData.entries())
    body.append(key, value.toString());

  const requestOptions: {
    method: string;
    headers: Headers;
    body: URLSearchParams;
  } = { method: "PATCH", headers, body };

  let response: Response;

  try {
    response = await fetch(
      `${
        process.env.REACT_APP_BASE_URL
          ? process.env.REACT_APP_BASE_URL
          : "http://localhost:3000"
      }/auth/me/pass`,
      requestOptions
    );
  } catch (error: any) {
    return { result: false, message: error.message };
  }

  // if incorrect current password
  if (response.status === 409)
    return { result: false, message: "Incorrect old password" };

  // if unauthorized
  if (response.status === 401)
    return { result: false, message: "Re-authenticate" };

  // if updated
  if (response.status === 200)
    return { result: true, message: "Password updated" };

  return { result: false, message: response.statusText };
};

// update the momentarily logged in user avatar
export const updateAvatar = async (
  form: HTMLFormElement
): Promise<{ [key: string]: boolean | string }> => {
  const headers: Headers = new Headers();
  headers.append("Authorization", `Bearer ${localStorage.getItem("JWT")}`);

  const formData: FormData = new FormData(form);

  const requestOptions: {
    method: string;
    headers: Headers;
    body: FormData;
  } = { method: "PATCH", headers, body: formData };

  let response: Response;

  try {
    response = await fetch(
      `${
        process.env.REACT_APP_BASE_URL
          ? process.env.REACT_APP_BASE_URL
          : "http://localhost:3000"
      }/auth/me/avatar-upload`,
      requestOptions
    );
  } catch (error: any) {
    return { result: false, message: error.message };
  }

  // if unauthorized
  if (response.status === 401)
    return { result: false, message: "Re-authenticate" };

  // if avatar already uploaded
  if (response.status === 409)
    return { result: false, message: "You've already uplodaed the avatar" };

  // if avatar uploaded
  if (response.status === 200) {
    const { path } = await response.json();
    return { result: true, message: "Avatar has been uploaded", path };
  }

  return { result: false, message: response.statusText };
};
