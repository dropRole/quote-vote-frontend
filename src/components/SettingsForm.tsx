import React, { useRef, useState } from "react";
import { TextButton } from "./TextButton";
import "./settings-form.css";
import { IUser } from "../App";
import defaultAvatar from "../assets/icons/man.png";
import chevron from "../assets/icons/chevron.png";
import { validateForm } from "../helpers/form-validation";
import {
  updatePassword,
  updateAvatar,
  updateBasics,
} from "../services/users/users-patch";
import { deleteAvatar } from "../services/users/users-delete";
import { getAvatar } from "../services/users/users-get";

type settingsForm = "basics" | "pass" | "avatar";

type ValidationResult = {
  valid: boolean;
  validationErrors: { [key: string]: { message: string } };
};

interface ISettingsFormProps {
  user: IUser;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SettingsForm: React.FC<ISettingsFormProps> = ({
  user,
  setUser,
  setModalOpen,
}) => {
  const [formType, setFormType] = useState<settingsForm>("basics");

  const [submissionResult, setSubmissionResult] = useState<string>("");

  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: { message: string };
  }>({});

  const [avatar, setAvatar] = useState<Blob | string>(user.avatar);

  const form: React.RefObject<HTMLFormElement> = useRef<HTMLFormElement>(null);

  const fileRef: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);

  // update basic info of the user
  const updateUserBasics: Function = async (): Promise<void> => {
    const response = await updateBasics(form.current as HTMLFormElement);

    setSubmissionResult(response.message as string);

    // if basics updated
    if (response.result) {
      const formData: FormData = new FormData(form.current as HTMLFormElement);

      setUser({
        email: formData.get("email") as string,
        name: formData.get("name") as string,
        surname: formData.get("surname") as string,
        username: formData.get("username") as string,
        avatar: user.avatar,
      });

      response.jwt && localStorage.setItem("JWT", response.jwt as string);
    }
  };

  // update user password
  const updateUserPassword = async () => {
    const response = await updatePassword(form.current as HTMLFormElement);

    setSubmissionResult(response.message as string);
  };

  // update user avatar
  const updateUserAvatar = async () => {
    const response = await updateAvatar(form.current as HTMLFormElement);

    // if uploaded
    if (response.result) {
      const path = response.path as string;

      const stream: Blob = await getAvatar(path);

      user.avatar = stream;

      setUser(user);

      setAvatar(stream);

      setSubmissionResult(response.message as string);
    }

    fileRef.current && (fileRef.current.files = null);
  };
  return (
    <form
      ref={form}
      id="settings"
      onSubmit={async (e) => {
        e.preventDefault();

        setValidationErrors({});

        const result: ValidationResult = validateForm(form.current);

        // if form valid
        if (result.valid) {
          // if basics update
          if (formType === "basics") updateUserBasics();

          // if pass update
          if (formType === "pass") updateUserPassword();

          // if avatar upload
          if (formType === "avatar") updateUserAvatar();

          return;
        }

        setSubmissionResult("Invalid form");

        setValidationErrors(result.validationErrors);
      }}
    >
      <p>
        Profile <span className="color-primary">settings</span>
      </p>
      <p>
        {formType === "basics" && "Change your profile setting"}
        {formType === "pass" && "Change your password"}
        {formType === "avatar" && "Change your profile avatar"}
      </p>
      {submissionResult && <p id="authResult">{submissionResult}</p>}
      {formType === "basics" && (
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
              defaultValue={user.email}
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
              <input
                id="name"
                type="text"
                name="name"
                defaultValue={user.name}
                required
              />
            </div>
            <div
              className="validation-error"
              data-error={
                validationErrors.surname ? validationErrors.surname.message : ""
              }
            >
              <label htmlFor="surname">Surname</label>
              <input
                id="surname"
                type="text"
                name="surname"
                defaultValue={user.surname}
                required
              />
            </div>
          </div>
          <div
            className="validation-error"
            data-error={
              validationErrors.username ? validationErrors.username.message : ""
            }
          >
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              defaultValue={user.username}
              required
            />
          </div>
          <TextButton
            btn="btn-signup"
            text="Change profile avatar"
            clickAction={() => {
              setFormType("avatar");
              setSubmissionResult("");
            }}
          />
          <TextButton
            btn="btn-warn"
            text="Change password"
            clickAction={() => {
              setFormType("pass");
              setSubmissionResult("");
            }}
          />
        </>
      )}
      {formType === "pass" && (
        <>
          <div
            className="validation-error"
            data-error={
              validationErrors.passCurrent
                ? validationErrors.passCurrent.message
                : ""
            }
          >
            <label htmlFor="passCurrent">Current password</label>
            <input
              id="passCurrent"
              type="password"
              name="passCurrent"
              required
            />
          </div>
          <div
            className="validation-error"
            data-error={
              validationErrors.pass ? validationErrors.pass.message : ""
            }
          >
            <label htmlFor="pass">New password</label>
            <input id="pass" type="password" name="pass" required />
          </div>
          <div
            className="validation-error"
            data-error={
              validationErrors.passConfirm
                ? validationErrors.passConfirm.message
                : ""
            }
          >
            <label htmlFor="passConfirm">Confirm password</label>
            <input
              id="passConfirm"
              type="password"
              name="passConfirm"
              required
            />
          </div>
          <div id="stepBack" onClick={() => setFormType("basics")}>
            <img src={chevron} alt="chevron" />
            <img src={chevron} alt="chevron" />
          </div>
        </>
      )}
      {formType === "avatar" && (
        <>
          <img
            className="avatar"
            src={
              typeof avatar === "string" ? avatar : URL.createObjectURL(avatar)
            }
            alt="avatar"
          />
          {typeof avatar === "string" ? (
            <TextButton
              btn="btn-signup"
              text="Upload new avatar"
              clickAction={() => fileRef.current?.click()}
              preventDefault={true}
            />
          ) : (
            <TextButton
              btn="btn-warn"
              text="Delete avatar"
              clickAction={async () => {
                const response: { [key: string]: boolean | string } =
                  await deleteAvatar();

                // if deleted
                if (response.result) {
                  setUser({
                    email: user.email,
                    name: user.name,
                    surname: user.surname,
                    username: user.username,
                    avatar: defaultAvatar,
                  });

                  setAvatar(defaultAvatar);
                }

                setSubmissionResult(response.message as string);
              }}
              preventDefault={true}
            />
          )}
          <div
            className="validation-error"
            data-error={
              validationErrors.avatar ? validationErrors.avatar.message : ""
            }
          >
            <input
              ref={fileRef}
              type="file"
              name="avatar"
              accept="image/*"
              required
            />
          </div>
          <div
            id="stepBack"
            onClick={() => {
              setFormType("basics");
              setSubmissionResult("");
            }}
          >
            <img src={chevron} alt="chevron" />
            <img src={chevron} alt="chevron" />
          </div>
        </>
      )}
      {(formType !== "avatar" ||
        (formType === "avatar" && typeof avatar !== "object")) && (
        <div>
          <TextButton btn="btn-signup" text="Submit" clickAction={() => {}} />
          <TextButton
            btn="btn-default"
            text="Cancel"
            clickAction={() => {
              setModalOpen(false);
            }}
          />
        </div>
      )}
    </form>
  );
};
