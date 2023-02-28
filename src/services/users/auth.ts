// request a user signup
export const signup: Function = async (
  form: HTMLFormElement
): Promise<{ [key: string]: boolean | string } | undefined> => {
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
    response = await fetch(
      `${
        process.env.REACT_APP_BASE_URL
          ? process.env.REACT_APP_BASE_URL
          : "http://localhost:3000"
      }/auth/signup`,
      requestOptions
    );
  } catch (error: any) {
    return { result: false, message: error };
  }

  // if username already exists
  if (response.status === 409)
    return { result: false, message: "Username already exists" };

  // if signed up
  if (response.status === 201) return { result: true, message: "Signed up" };
};

// request a user login
export const login: Function = async (
  form: HTMLFormElement
): Promise<{ [key: string]: boolean | string } | undefined> => {
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
    response = await fetch(
      `${
        process.env.REACT_APP_BASE_URL
          ? process.env.REACT_APP_BASE_URL
          : "http://localhost:3000"
      }/auth/login`,
      requestOptions
    );
  } catch (error: any) {
    return { result: false, message: error.message };
  }

  // if not found
  if (response.status === 400 || response.status === 401)
    return { result: false, message: "Check your credentials" };

  // if logged in
  if (response.status === 201) {
    const { accessToken } = await response.json();

    return {
      result: true,
      message: "Loged in",
      jwt: accessToken,
    };
  }
};
