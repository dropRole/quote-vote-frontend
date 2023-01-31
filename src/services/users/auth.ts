// request a user signup
export const signup = async (
  form: HTMLFormElement
): Promise<{ status: number; message: string }> => {
  const headers: Headers = new Headers();
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  const formData: FormData = new FormData(form);

  const body: URLSearchParams = new URLSearchParams();

  for (const [key, value] of formData.entries()) {
    // if not pass confirmation field
    if (key !== "passConfirm") body.append(key, value.toString());
  }

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
    response = await fetch("http://localhost:3000/auth/signup", requestOptions);
  } catch (error: any) {
    return { status: 500, message: error };
  }

  // if username already exists
  if (response.status === 409)
    return { status: 409, message: "Username already exists" };

  return { status: response.status, message: "Signed up" };
};

// request a user login
export const login = async (
  form: HTMLFormElement
): Promise<{ status: number; message: string; jwt: string }> => {
  const headers: Headers = new Headers();
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  const formData: FormData = new FormData(form);

  const body: URLSearchParams = new URLSearchParams();

  for (const [key, value] of formData.entries()) {
    body.append(key, value.toString());
  }

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
    response = await fetch("http://localhost:3000/auth/login", requestOptions);
  } catch (error: any) {
    return { status: 500, message: error.message, jwt: "" };
  }

  // if not found
  if (response.status === 400 || response.status === 401)
    return { status: 404, message: "Check your credentials", jwt: "" };

  const { accessToken } = await response.json();
  
  return {
    status: response.status,
    message: "Logged in",
    jwt: accessToken,
  };
};
