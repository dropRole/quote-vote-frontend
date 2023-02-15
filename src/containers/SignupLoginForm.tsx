import React, { useRef } from "react";
import "./signup-login-form.css";
import defaultAvatar from "../assets/icons/man.png";
import { TextButton } from "../components/TextButton";
import { signup, login } from "../services/users/auth";
import {
  validateForm,
  triggerValidationErrors,
} from "../helpers/form-validation";

interface ISignupLoginFormProps {
  state: string;
}

export const SignupLoginForm: React.FC<ISignupLoginFormProps> = ({ state }) => {
  const form: React.RefObject<HTMLFormElement> = useRef<HTMLFormElement>(null);

  // perform the signup
  const signupUser: Function = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // if form validated
    if (validateForm(form)) {
      // if ref object instantiated
      if (form.current) {
        const response: { status: number; message: string } = await signup(
          form.current
        );

        // if username already exists
        if (response.status === 409)
          triggerValidationErrors(form, [
            {
              field: "username",
              message: "Username already exists",
            },
          ]);

        form.current.querySelector("div")?.classList.add("signup-login-result");

        // if accessable
        (form.current.querySelector("div") as HTMLElement).dataset.result =
          response.message;

        // if succeeded
        if (response.status === 201) window.location.href = "/login";
      }
    }
  };

  // perform the login
  const loginUser: Function = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // if ref object instantiated
    if (form.current) {
      const response: { status: number; message: string; jwt: string } =
        await login(form.current);

      if (form.current.querySelector("div")) {
        form.current.querySelector("div")?.classList.add("signup-login-result");

        // if accessable
        (form.current.querySelector("div") as HTMLElement).dataset.result =
          response.message;
      }

      // if user logged in
      if (response.status === 201) {
        localStorage.setItem("JWT", response.jwt);

        window.location.href = "/";
      }
    }
  };

  return (
    <form
      ref={form}
      onSubmit={(e) => (state === "signup" ? signupUser(e) : loginUser(e))}
    >
      <p className="text-center">
        {state === "signup" ? (
          <>
            What's your <span className="color-primary">name?</span>
          </>
        ) : (
          <>
            Welcome <span className="color-primary">back!</span>
          </>
        )}
      </p>
      <p className="text-center">
        {state === "signup" ? (
          <>Your name will appear on quotes and your public profle.</>
        ) : (
          <>
            Thank you for coming back. Hope you have a good day and inspire
            others.
          </>
        )}
      </p>
      {state === "signup" && (
        <img src={defaultAvatar} className="form-avatar" alt="avatar" />
      )}
      {state === "signup" && (
        <>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="valid email"
              required
            />
          </div>
          <div id="fullnameGroup">
            <div>
              <label htmlFor="name">Name</label>
              <input id="name" type="text" name="name" required />
            </div>
            <div>
              <label htmlFor="surname">Surname</label>
              <input id="surname" type="text" name="surname" required />
            </div>
          </div>
        </>
      )}
      <div>
        <label htmlFor="username">Username</label>
        <input id="username" type="text" name="username" required />
      </div>
      <div>
        <label htmlFor="pass">Password</label>
        <input id="pass" type="password" name="pass" required />
      </div>
      {state === "signup" && (
        <>
          <div>
            <label htmlFor="passConfirm">Confrim password</label>
            <input
              id="passConfirm"
              type="password"
              name="passConfirm"
              required
            />
          </div>
        </>
      )}
      <TextButton
        btn={`btn-text ${state === "signup" ? "btn-signup" : "btn-outline"}`}
        text={state === "signup" ? "Signup" : "Login"}
        clickAction={() => {}}
      />
      <p id="accountQuestion">
        <span>
          {state === "signup"
            ? "Already have an account?"
            : "Don't have an account?"}
        </span>
        <span
          className="color-primary"
          onClick={() =>
            state === "signup"
              ? (window.location.href = "/login")
              : (window.location.href = "/signup")
          }
        >
          {state === "signup" ? "Login" : "Signup"}
        </span>
      </p>
    </form>
  );
};
