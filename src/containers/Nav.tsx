import { useEffect, useState } from "react";
import { TextButton } from "../components/TextButton";
import "./nav.css";
import logo from "../assets/icons/logo-orange.png";
import { HamburgerButton } from "../components/HamburgerButton";
import { AddButton } from "../components/AddButton";
import chevron from "../assets/icons/chevron.png";
import colouredChevron from "../assets/icons/chevron-coloured.png";
import { IUser } from "../App";
import { modalContent } from "../App";

interface INavProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setModalContent: React.Dispatch<React.SetStateAction<modalContent>>;
  user: IUser;
}

export const Nav: React.FC<INavProps> = ({
  collapsed,
  setCollapsed,
  setModalOpen,
  setModalContent,
  user,
}) => {
  const [navHeight, setNavheight] = useState<string>("uncollapse");

  const [navFlexDirection, setNavFlexDirection] = useState<string>("row");

  const [hamBtnAlign, setHamBtnAlign] = useState<string>("align-self-center");

  const [inscriptionDisplay, setInscriptionDisplay] =
    useState<string>("d-block");

  const [inscriptionOpacity, setInscriptionOpacity] =
    useState<string>("opacity-1");

  const [addBtnDisplay, setAddBtnDisplay] = useState<string>("d-block");

  const [addBtnOpacity, setAddBtnOpacity] = useState<string>("opacity-1");

  const [menuWidth, setMenuWidth] = useState<string>("auto");

  const [menuItemDisplay, setMenuItemDisplay] = useState<string>("d-none");

  const [menuItemOpacity, setMenuItemOpacity] = useState<string>("opacity-0");

  const [avatar, setAvatar] = useState<string | Blob>(user.avatar);

  useEffect(() => setAvatar(user.avatar), [user.avatar]);

  // controls navbar collapsing setup
  const collapseNavbar: Function = () => {
    setCollapsed(!collapsed);

    // if nav collapsed
    if (!collapsed) {
      setInscriptionOpacity("opacity-0");

      setAddBtnOpacity("opacity-0");

      setTimeout(() => {
        setNavheight("collapse");

        setHamBtnAlign("align-self-start");

        setNavFlexDirection("flex-column");

        setInscriptionDisplay("d-none");

        setAddBtnDisplay("d-none");

        setMenuWidth("w-100");

        setMenuItemDisplay("d-flex");
      }, 250);

      setTimeout(() => {
        setMenuItemOpacity("opacity-1");
      }, 500);
    } else {
      setMenuItemOpacity("opacity-0");
      
      setTimeout(() => {
        setNavheight("uncollapse");

        setMenuItemDisplay("d-none");

        setInscriptionDisplay("d-block");
        
        setAddBtnDisplay("d-block");
      }, 250)

      setTimeout(() => {
        setNavFlexDirection("flex-row");

        setHamBtnAlign("align-self-center");

        setMenuWidth("auto");

        setInscriptionOpacity("opacity-1");

        setAddBtnOpacity("opacity-1");
      }, 500);
    }
  };
  return (
    <nav className={`${navFlexDirection} ${navHeight}`}>
      <HamburgerButton
        className={`btn-hamburger ${
          collapsed ? "btn-hamburger-open" : ""
        } ${hamBtnAlign}`}
        clickAction={collapseNavbar}
      />
      <div id="inscription">
        <p
          className={`${inscriptionDisplay} ${inscriptionOpacity}`}
          onClick={() => (window.location.href = "/")}
        >
          Quote vote <img src={logo} alt="logo"></img>
        </p>
      </div>
      <div id="menu" className={menuWidth}>
        {localStorage.getItem("JWT") ? (
          <>
            <AddButton
              className={`btn-add ${addBtnDisplay} ${addBtnOpacity}`}
              clickAction={() => {
                setModalOpen(true);
                setModalContent({ type: "quote", data: { formType: "post" } });
              }}
            />
            <div
              id="profileAvatar"
              className={`${menuItemDisplay} ${menuItemOpacity}`}
              onClick={() =>
                (window.location.href = `/profile?username=${user.username}`)
              }
            >
              <img
                src={
                  typeof avatar === "string"
                    ? avatar
                    : URL.createObjectURL(avatar)
                }
                className="avatar"
                alt="avatar"
              />
              {user.username}
            </div>
            <div
              className={`${menuItemDisplay} ${menuItemOpacity}`}
              onClick={() => (window.location.href = "/")}
            >
              <span>Home</span>
              <img src={chevron} className="right-chevron" alt=">" />
            </div>
            <div
              className={`${menuItemDisplay} ${menuItemOpacity}`}
              onClick={() => {
                setModalOpen(true);
                setModalContent({
                  type: "settings",
                  data: { formType: "basics" },
                });
              }}
            >
              <span>Settings</span>
              <img src={chevron} className="right-chevron" alt=">" />
            </div>
            <div
              className={`${menuItemDisplay} ${menuItemOpacity}`}
              onClick={() => {
                localStorage.removeItem("JWT");

                window.location.href = "/login";
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
                  clickAction={() => (window.location.href = "/signup")}
                />
              </div>
            )}
            {window.location.pathname !== "/login" && (
              <div className="justify-center">
                <TextButton
                  btn="btn-text btn-outline"
                  text="Login"
                  clickAction={() => (window.location.href = "/login")}
                />
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
};
