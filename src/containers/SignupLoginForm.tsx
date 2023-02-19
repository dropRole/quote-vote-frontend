import React, { useRef, useState } from "react";
import "./signup-login-form.css";
import defaultAvatar from "../assets/icons/man.png";
import { TextButton } from "../components/TextButton";
import { signup, login } from "../services/users/auth";
import { validateForm } from "../helpers/form-validation";

interface ISignupLoginFormProps {
  state: string;
}

export const SignupLoginForm: React.FC<ISignupLoginFormProps> = ({ state }) => {
  const [authResult, setAuthResult] = useState<string>("");

  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: { message: string };
  }>({});

  const form: React.RefObject<HTMLFormElement> = useRef<HTMLFormElement>(null);

  // perform the signup
  const signupUser: Function = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setValidationErrors({})

    const result: {
      valid: boolean;
      validationErrors: { [key: string]: { message: string } };
    } = validateForm(form.current);

    // if form validated
    if (result.valid)
      if (form.current) {
        // if ref object instantiated
        const response: { [key: string]: boolean | string } = await signup(
          form.current
        );

        setAuthResult(response.message as string);

        // if succeeded
        if (response.result) window.location.href = "/login";

        return;
      }

    setAuthResult("Invalid form");

    setValidationErrors(result.validationErrors);
  };

  // perform the login
  const loginUser: Function = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // if ref object instantiated
    if (form.current) {
      const response: { [key: string]: boolean | string } = await login(
        form.current
      );

      setAuthResult(response.message as string);

      // if user logged in
      if (response.result) {
        localStorage.setItem("JWT", response.jwt as string);

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
      {authResult && <p id="authResult">{authResult}</p>}
      {state === "signup" && (
        <>
          <div
            className="validation-error"
            data-error={
              validationErrors.email ? validationErrors.email.message : ""
            }
          >
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
            <div
              className="validation-error"
              data-error={
                validationErrors.name ? validationErrors.name.message : ""
              }
            >
              <label htmlFor="name">Name</label>
              <input id="name" type="text" name="name" required />
            </div>
            <div
              className="validation-error"
              data-error={
                validationErrors.surname ? validationErrors.surname.message : ""
              }
            >
              <label htmlFor="surname">Surname</label>
              <input id="surname" type="text" name="surname" required />
            </div>
          </div>
        </>
      )}
      <div
        className="validation-error"
        data-error={
          validationErrors.username ? validationErrors.username.message : ""
        }
      >
        <label htmlFor="username">Username</label>
        <input id="username" type="text" name="username" required />
      </div>
      <div
        className="validation-error"
        data-error={validationErrors.pass ? validationErrors.pass.message : ""}
      >
        <label htmlFor="pass">Password</label>
        <input id="pass" type="password" name="pass" required />
      </div>
      {state === "signup" && (
        <>
          <div
            className="validation-error"
            data-error={
              validationErrors.passConfirm
                ? validationErrors.passConfirm.message
                : ""
            }
          >
            <label htmlFor="passConfirm">Cofirm password</label>
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
