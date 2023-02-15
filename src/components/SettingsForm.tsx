import React, { useRef, useState } from "react";
import { TextButton } from "./TextButton";
import "./settings-form.css";
import { IUser } from "../App";
import defaultAvatar from "../assets/icons/man.png";
import chevron from "../assets/icons/chevron.png";
import {
  validateForm,
  triggerValidationErrors,
} from "../helpers/form-validation";
import {
  updatePassword,
  updateAvatar,
  updateBasics,
} from "../services/users/users-patch";
import { deleteAvatar } from "../services/users/users-delete";
import { getAvatar } from "../services/users/users-get";

type settingsForm = "basics" | "pass" | "avatar";

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

  const [avatar, setAvatar] = useState<Blob | string>(user.avatar);

  const form: React.RefObject<HTMLFormElement> = useRef<HTMLFormElement>(null);

  const fileRef: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);

  // update basic info of the user
  const updateUserBasics: Function = async (response: {
    [key: string]: boolean | string;
  }): Promise<void> => {
    response = await updateBasics(form.current as HTMLFormElement);

    // if username already exists
    if (!response.result)
      triggerValidationErrors(form, [
        {
          field: "username",
          message: "Username already exists",
        },
      ]);

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

    exposeSubmissionResult(response.message as string);
  };

  // update user password
  const updateUserPassword = async (response: {
    [key: string]: boolean | string;
  }) => {
    response = await updatePassword(form.current as HTMLFormElement);

    // if incorrect password
    if (!response.result)
      triggerValidationErrors(form, [
        {
          field: "passCurrent",
          message: "Incorrect password",
        },
      ]);

    exposeSubmissionResult(response.message as string);
  };

  // update user avatar
  const updateUserAvatar = async (response: {
    [key: string]: boolean | string;
  }) => {
    response = await updateAvatar(form.current as HTMLFormElement);

    // if uploaded
    if (response.result) {
      const path = response.path as string;

      const stream: Blob = await getAvatar(path);

      user.avatar = stream;

      setUser(user);

      setAvatar(stream);
    }

    exposeSubmissionResult(response.message as string);
  };

  const exposeSubmissionResult = (message: string) => {
    // if ref object instantiated
    if (form.current) {
      form.current.querySelector("div")?.classList.add("signup-login-result");

      // if accessable
      (form.current.querySelector("div") as HTMLElement).dataset.result =
        message as string;
    }
  };
  return (
    <form
      ref={form}
      id="settings"
      onSubmit={async (e) => {
        e.preventDefault();

        // if form validated
        if (validateForm(form)) {
          // if ref object instantiated
          if (form.current) {
            let response: { [key: string]: boolean | string } = {};

            // if basics update
            if (formType === "basics") updateUserBasics(response);

            // if pass update
            if (formType === "pass") updateUserPassword(response);

            // if avatar upload
            if (formType === "avatar") updateUserAvatar(response);
          }
        }
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
      {formType === "basics" && (
        <>
          <div>
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
            <div>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                name="name"
                defaultValue={user.name}
                required
              />
            </div>
            <div>
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
          <div>
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
            clickAction={() => setFormType("avatar")}
          />
          <TextButton
            btn="btn-warn"
            text="Change password"
            clickAction={() => setFormType("pass")}
          />
        </>
      )}
      {formType === "pass" && (
        <>
          <div>
            <label htmlFor="passCurrent">Current password</label>
            <input
              id="passCurrent"
              type="password"
              name="passCurrent"
              required
            />
          </div>
          <div>
            <label htmlFor="pass">New password</label>
            <input id="pass" type="password" name="pass" required />
          </div>
          <div>
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
          <div></div>
          <img
            className="avatar"
            src={
              typeof avatar === "string" ? avatar : URL.createObjectURL(avatar)
            }
            alt="avatar"
          />
          <TextButton
            btn={typeof avatar === "string" ? "btn-signup" : "btn-warn"}
            text={
              typeof avatar === "string" ? "Upload new avatar" : "Delete avatar"
            }
            clickAction={
              typeof avatar === "string"
                ? () => fileRef.current?.click()
                : async () => {
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

                    exposeSubmissionResult(response.message as string);
                  }
            }
          />
          <div>
            <input
              ref={fileRef}
              type="file"
              name="avatar"
              accept="image/*"
              required
            />
          </div>
          <div id="stepBack" onClick={() => setFormType("basics")}>
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
