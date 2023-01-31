import defaultAvatar from "../../assets/icons/man.png";

// get user basic info
export const getUserInfo = async (): Promise<{
  username: string;
  name: string;
  surname: string;
  email: string;
  avatar: string;
}> => {
  const headers: Headers = new Headers();
  headers.append("Authorization", `Bearer ${localStorage.getItem("JWT")}`);

  const requestOptions: { method: string; headers: Headers } = {
    method: "GET",
    headers,
  };

  let response: Response,
    user: {
      username: string;
      name: string;
      surname: string;
      email: string;
      avatar: string;
    };
  try {
    response = await fetch("http://localhost:3000/auth/me", requestOptions);
  } catch (error) {
    return { username: "", name: "", surname: "", email: "", avatar: "" };
  }

  // if unauthorized
  if (response.status === 401)
    return { username: "", name: "", surname: "", email: "", avatar: "" };

  user = await response.json();

  return user;
};

// stream user avatar
export const getUserAvatar = async (path: string): Promise<Blob | string> => {
  const headers: Headers = new Headers();
  headers.append("Content-Type", "image/*");

  const requestOptions: { method: string; headers: Headers } = {
    method: "GET",
    headers,
  };

  let response: Response;
  try {
    response = await fetch(
      `http://localhost:3000/auth/me/avatar?path=${path}`,
      requestOptions
    );
  } catch (error) {
    return defaultAvatar;
  }

  // if unauthorized
  if (response.status === 401) return defaultAvatar;

  return await response.blob();
};
