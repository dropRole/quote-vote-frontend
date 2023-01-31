import { useRef } from "react";
import { TextButton } from "./TextButton";
import "./nav.css";
import logo from "../assets/icons/logo-orange.png";
import { HamburgerButton } from "./HamburgerButton";
import { AddButton } from "./AddButton";
import chevron from "../assets/icons/chevron.png";
import colouredChevron from "../assets/icons/chevron-coloured.png";

interface INavProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  username: string;
  avatar: Blob | string;
}

export const Nav: React.FC<INavProps> = ({
  collapsed,
  setCollapsed,
  username,
  avatar,
}) => {
  const nav: React.RefObject<HTMLElement> = useRef<HTMLElement>(null);

  const toolbar: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const hamBtn: React.RefObject<HTMLButtonElement> =
    useRef<HTMLButtonElement>(null);

  const addBtn: React.RefObject<HTMLButtonElement> =
    useRef<HTMLButtonElement>(null);

  const pInscription: React.RefObject<HTMLParagraphElement> =
    useRef<HTMLParagraphElement>(null);

  // controls navbar collapsing setup
  const collapseNavbar: Function = () => {
    setTimeout(() => {
      // if nav ref instantiated
      if (nav.current) {
        nav.current.style.flexDirection = !collapsed ? "column" : "row";
        nav.current
          .querySelector("div#inscription")
          ?.classList.toggle("flex-basis-10");
        nav.current
          .querySelector("div#inscription")
          ?.classList.toggle("flex-basis-100");
      }

      // if toolbar ref instantiated
      if (toolbar.current)
        toolbar.current.querySelectorAll("div").forEach((el) => {
          el.classList.toggle("d-flex");
        });
    }, 350);

    // if hamBtn ref instantiated
    if (hamBtn.current)
      !collapsed
        ? hamBtn.current.classList.add("btn-hamburger-open")
        : hamBtn.current.classList.remove("btn-hamburger-open");

    // if pInscription ref instantiated
    if (pInscription.current)
      !collapsed
        ? (pInscription.current.style.opacity = "0")
        : (pInscription.current.style.opacity = "1");

    // if addBtn ref instantiated
    if (addBtn.current)
      !collapsed
        ? (addBtn.current.style.opacity = "0")
        : (addBtn.current.style.opacity = "1");

    // if toolbar ref instantiated
    if (toolbar.current)
      toolbar.current.querySelectorAll("div").forEach((el) => {
        el.classList.toggle("opacity-1");
      });

    setCollapsed(!collapsed);

    return;
  };
  return (
    <nav ref={nav}>
      <div
        id="inscription"
        className={!localStorage.getItem("JWT") ? "flex-basis-100" : ""}
      >
        <HamburgerButton domRef={hamBtn} clickAction={collapseNavbar} />
        <p ref={pInscription} onClick={() => (window.location.pathname = "/")}>
          Quote vote <img src={logo} alt="logo"></img>
        </p>
      </div>
      <div id="toolbar" ref={toolbar}>
        {localStorage.getItem("JWT") ? (
          <>
            <AddButton domRef={addBtn} clickAction={Function} />
            <div id="profileAvatar">
              <img
                src={
                  typeof avatar === "string"
                    ? avatar
                    : URL.createObjectURL(avatar)
                }
                className="avatar"
                alt="avatar"
              />
              {username}
            </div>
            <div>
              <span>Home</span>
              <img src={chevron} className="right-chevron" alt=">" />
            </div>
            <div>
              <span>Settings</span>
              <img src={chevron} className="right-chevron" alt=">" />
            </div>
            <div
              onClick={() => {
                localStorage.removeItem("JWT");

                window.location.pathname = "/login";
              }}
            >
              <span className="color-primary">Logout</span>
              <img src={colouredChevron} className="right-chevron" alt=">" />
            </div>
          </>
        ) : (
          <>
            {window.location.pathname !== "/signup" && (
              <div className="justify-center">
                <TextButton
                  btn="btn-text btn-signup"
                  text="Sign up"
                  clickAction={() => (window.location.pathname = "/signup")}
                />
              </div>
            )}
            {window.location.pathname !== "/login" && (
              <div className="justify-center">
                <TextButton
                  btn="btn-text btn-outline"
                  text="Login"
                  clickAction={() => (window.location.pathname = "/login")}
                />
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
};
