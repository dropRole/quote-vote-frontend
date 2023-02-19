import { useEffect, useState } from "react";
import { Nav } from "./containers/Nav";
import { Footer } from "./layouts/Footer";
import { getQuotes, getRandomQuote } from "./services/quotes/quotes-get";
import { getAvatar, getUserInfo } from "./services/users/users-get";
import { IntroSection } from "./components/IntroSection";
import { QuotesSection } from "./containers/QuotesSection";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route, redirect, Navigate } from "react-router";
import { SignupLoginForm } from "./containers/SignupLoginForm";
import notFoundAvatar from "./assets/icons/404.png";
import { Profile } from "./components/Profile";
import Modal from "@mui/material/Modal";
import { Backdrop, Box, Fade } from "@mui/material";
import { SettingsForm } from "./components/SettingsForm";
import { quoteForm, QuoteForm } from "./components/QuoteForm";
import defaultAvatar from "./assets/icons/man.png";

export interface IUser {
  username: string;
  name: string;
  surname: string;
  email: string;
  avatar: string | Blob;
}

export interface IQuote {
  quotes_id: string;
  quotes_quote: string;
  quotes_written: Date;
  quotes_updated: Date;
  quotes_username: string;
  users_avatar: string;
  users_fullname: string;
  votes_total: number;
  votes_vote: boolean | undefined;
}

type modalContentType = "quote" | "settings";

export type modalContent = {
  type: modalContentType;
  data: { [formType: string]: string };
};

const App: React.FC = () => {
  const [quotes, setQuotes] = useState<{
    random: IQuote[];
    recent: IQuote[];
    most: IQuote[];
    voted: IQuote[];
  }>({
    random: [],
    recent: [],
    most: [],
    voted: [],
  });

  const [anyQuotes, setAnyQuotes] = useState<boolean>(true);

  const [user, setUser] = useState<IUser>({ avatar: defaultAvatar } as IUser);

  const [collapsed, setCollapsed] = useState<boolean>(false);

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [modalContent, setModalContent] = useState<modalContent>({
    type: "quote",
    data: {},
  });

  // fetching data from the API
  useEffect(() => {
    // if logged in user
    if (localStorage.getItem("JWT")) {
      const fetchUserData: Function = async () => {
        const info: IUser = await getUserInfo();

        const streamUserAvatar = async () => {
          const stream: Blob = await getAvatar(info.avatar as string);

          user.avatar = stream;
        };

        // if user avatar is defined
        if (info.avatar) streamUserAvatar();
        user.email = info.email;
        user.name = info.name;
        user.surname = info.surname;
        user.username = info.username;

        setUser(user);
      };

      fetchUserData();
    }

    const fetchQuotes: Function = async () => {
      let rnd: IQuote[] = [],
        recent: IQuote[] = [],
        most: IQuote[] = [];

      //if logged in and on profile page
      if (
        localStorage.getItem("JWT") &&
        window.location.pathname === "/profile"
      )
        return;

      // if logged in
      if (localStorage.getItem("JWT")) rnd = [await getRandomQuote()];

      recent = await getQuotes("recent", "", 10);

      // check for posted quotes
      setAnyQuotes(recent.length === 0 ? false : true);

      most = await getQuotes("most", "", 10);

      setQuotes({
        random: rnd,
        recent,
        most,
        voted: [],
      });
    };

    fetchQuotes();
  }, [user, setUser]);

  const authorized = () => {
    // if logged in user
    if (localStorage.getItem("JWT")) return redirect("/");
  };
  authorized();
  return (
    <>
      <Nav
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        setModalOpen={setModalOpen}
        setModalContent={setModalContent}
        user={user}
      />
      <div id="container">
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  {localStorage.getItem("JWT") ? (
                    <QuotesSection
                      quotes={quotes}
                      setQuotes={setQuotes}
                      anyQuotes={anyQuotes}
                      search="random"
                      flexWrap={{ basis: "25" }}
                    />
                  ) : (
                    <>
                      <IntroSection
                        quotes={quotes}
                        setQuotes={setQuotes}
                        flexWrap={{ basis: "" }}
                      />
                      <p className="h2 text-center">
                        Explore the world of <br />
                        <span className="color-primary">fantastic quotes</span>
                      </p>
                    </>
                  )}
                  <QuotesSection
                    quotes={quotes}
                    setQuotes={setQuotes}
                    anyQuotes={anyQuotes}
                    search="most"
                    flexWrap={{ basis: "25" }}
                  />
                  {localStorage.getItem("JWT") && (
                    <QuotesSection
                      quotes={quotes}
                      setQuotes={setQuotes}
                      anyQuotes={anyQuotes}
                      search="recent"
                      flexWrap={{ basis: "25" }}
                    />
                  )}
                  <Modal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    aria-labelledby="modal-settings"
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                  >
                    <Fade in={modalOpen}>
                      <Box id="modalBox">
                        {modalContent.type === "settings" && (
                          <SettingsForm
                            user={user}
                            setUser={setUser}
                            setModalOpen={setModalOpen}
                          />
                        )}
                        {modalContent.type === "quote" && (
                          <QuoteForm
                            type={modalContent.data.formType as quoteForm}
                            data={{
                              id: modalContent.data.id,
                              quote: modalContent.data.quote,
                            }}
                            username={user.username}
                            quotes={quotes}
                            setQuotes={setQuotes}
                            setModalOpen={setModalOpen}
                          />
                        )}
                      </Box>
                    </Fade>
                  </Modal>
                </>
              }
            />
            <Route
              path="/profile"
              element={
                <>
                  <Profile
                    user={user}
                    quotes={quotes}
                    setQuotes={setQuotes}
                    setModalOpen={setModalOpen}
                    setModalContent={setModalContent}
                  />
                  <Modal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    aria-labelledby="modal-settings"
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                  >
                    <Fade in={modalOpen}>
                      <Box id="modalBox">
                        {modalContent.type === "settings" && (
                          <SettingsForm
                            user={user}
                            setUser={setUser}
                            setModalOpen={setModalOpen}
                          />
                        )}
                        {modalContent.type === "quote" && (
                          <QuoteForm
                            type={modalContent.data.formType as quoteForm}
                            data={{
                              id: modalContent.data.id,
                              quote: modalContent.data.quote,
                            }}
                            username={user.username}
                            quotes={quotes}
                            setQuotes={setQuotes}
                            setModalOpen={setModalOpen}
                          />
                        )}
                      </Box>
                    </Fade>
                  </Modal>
                </>
              }
            />
            <Route
              path="/signup"
              element={
                localStorage.getItem("JWT") ? (
                  <Navigate to="/" />
                ) : (
                  <SignupLoginForm state="signup" />
                )
              }
            />
            <Route
              path="/login"
              element={
                localStorage.getItem("JWT") ? (
                  <Navigate to="/" />
                ) : (
                  <SignupLoginForm state="login" />
                )
              }
            />
            <Route
              path="*"
              element={
                <>
                  <p id="notFound">
                    <img src={notFoundAvatar} alt="avatar" />
                    <span>The page was not found</span>
                  </p>
                </>
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
      <Footer />
    </>
  );
};

export default App;
