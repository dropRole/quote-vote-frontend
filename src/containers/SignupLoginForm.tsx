import React, { useRef } from "react";
import "./signup-login-form.css";
import defaultAvatar from "../assets/icons/man.png";
import { TextButton } from "../components/TextButton";
import { signup, login } from "../services/users/auth";

interface ISignupLoginFormProps {
  state: string;
}

export const SignupLoginForm: React.FC<ISignupLoginFormProps> = ({ state }) => {
  const form: React.RefObject<HTMLFormElement> = useRef<HTMLFormElement>(null);

  const triggerValidationErrors: Function = (
    validationErrors: { field: string; message: string }[]
  ) => {
    validationErrors.forEach((validationError) => {
      // if object ref is instantiated
      if (form.current) {
        const field = form.current.querySelector(
          `input[name="${validationError.field}"]`
        ) as HTMLInputElement;

        // if field has parent element
        if (field.parentElement) {
          field.parentElement.className = "validation-error";
          field.parentElement.dataset.error = `* ${validationError.message}`;
        }
      }
    });
  };

  // validate the signup form
  const validateSignupForm: Function = (): boolean => {
    let validationErrors: { field: string; message: string }[] = [];

    // if object ref instantiated
    if (form.current) {
      const fields = form.current.querySelectorAll("input");
      fields.forEach((field) => {
        switch (field.name) {
          case "email":
            field.value.length > 64 &&
              validationErrors.push({
                field: "email",
                message: "Email shouldn't be longer than 64 chars",
              });
            break;

          case "name":
            field.value.length > 13 &&
              validationErrors.push({
                field: "name",
                message: "Name shouldn't be longer than 13 chars",
              });
            break;

          case "surname":
            field.value.length > 20 &&
              validationErrors.push({
                field: "surname",
                message: "Surname shouldn't be longer than 20 chars",
              });
            break;

          case "username":
            field.value.length < 4 &&
              validationErrors.push({
                field: "username",
                message: "Username must be at least 4 chars long",
              });

            field.value.length > 20 &&
              validationErrors.push({
                field: "username",
                message: "Username shouldn't be longer than 20 chars",
              });
            break;

          case "pass":
            let message: string = "";
            field.value.length < 8 &&
              (message = message + "Password must be at least 8 chars long");

            field.value.length > 32 &&
              (message =
                message + "\r\n Password shouldn't be longer than 32 chars");

            !/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(
              field.value
            ) &&
              (message =
                message +
                "\r\n Password must contain small and, at least one, capital and special chars");

            // if there's an error
            message.length &&
              validationErrors.push({ field: "pass", message: message });

            break;

          case "passConfirm":
            field.value !==
              (
                form.current?.querySelector(
                  "input[name='pass']"
                ) as HTMLInputElement
              ).value &&
              validationErrors.push({
                field: "passConfirm",
                message: "Passwords must match",
              });
        }
      });
    }

    form.current?.querySelectorAll("input").forEach((input) => {
      // if input has parent element
      if (input.parentElement) {
        input.parentElement?.classList.remove("validation-error");
        input.parentElement.dataset.error = "";
      }
    });

    // if no validation errors
    if (!validationErrors.length) return true;

    triggerValidationErrors(validationErrors);

    return false;
  };

  // perform the signup
  const signupUser: Function = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // if form validated
    if (validateSignupForm()) {
      // if ref object instantiated
      if (form.current) {
        const response: { status: number; message: string } = await signup(
          form.current
        );

        // if username already exists
        if (response.status === 409)
          triggerValidationErrors([
            {
              field: "username",
              message: "Username already exists",
            },
          ]);

        if (form.current.querySelector("div")) {
          form.current
            .querySelector("div")
            ?.classList.add("signup-login-result");

          // if accessable
          (form.current.querySelector("div") as HTMLElement).dataset.result =
            response.message;
        }

        // if succeeded
        if (response.status === 201) window.location.pathname = "/login";
      }
    }
  };

  // perform the login
  const loginUser: Function = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // if ref object instantiated
    if (form.current) {
      const response: { status: number; message: string, jwt: string } = await login(
        form.current
      );

      if (form.current.querySelector("div")) {
        form.current.querySelector("div")?.classList.add("signup-login-result");

        // if accessable
        (form.current.querySelector("div") as HTMLElement).dataset.result =
          response.message;
      }

      // if user logged in
      if (response.status === 201) {
        console.log(response.jwt)
        localStorage.setItem('JWT', response.jwt)

        window.location.pathname = "/";
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
          onClick={() => state === "signup" ? window.location.pathname = "/login" : window.location.pathname = '/signup'}
        >
          {state === "signup" ? "Login" : "Signup"}
        </span>
      </p>
    </form>
  );
};
