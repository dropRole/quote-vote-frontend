import { useEffect, useState } from "react";
import { Nav } from "./components/Nav";
import { Footer } from "./layouts/Footer";
import { getQuotes, getRandomQuote } from "./services/quotes/quotes-get";
import { getUserInfo } from "./services/users/users-get";
import { IntroSection } from "./components/IntroSection";
import { QuotesSection } from "./containers/QuotesSection";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route, redirect, Navigate } from "react-router";
import { SignupLoginForm } from "./containers/SignupLoginForm";
import notFoundAvatar from "./assets/icons/404.png";
import { Profile } from "./components/Profile";

export interface IUser {
  username: string;
  name: string;
  surname: string;
  email: string;
  avatar: Blob | string;
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

  const [user, setUser] = useState<IUser>({} as IUser);

  const [collapsed, setCollapsed] = useState<boolean>(false);

  // fetching data from the API
  useEffect(() => {
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

      most = await getQuotes("most", "", 10);
        
      setQuotes({
        random: rnd,
        recent,
        most,
        voted: [],
      });
    };

    // if logged in user
    if (localStorage.getItem("JWT")) {
      const fetchUserData: Function = async () => {
        const user: IUser = await getUserInfo();

        setUser({
          username: user.username,
          name: user.name,
          surname: user.surname,
          email: user.email,
          avatar: user.avatar,
        });
      };

      fetchUserData();
    }

    fetchQuotes();
  }, []);

  const authorized = () => {
    // if logged in user
    if (localStorage.getItem("JWT")) return redirect("/");
  };
  authorized();

  return (
    <>
      <Nav collapsed={collapsed} setCollapsed={setCollapsed} user={user} />
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
                    search="most"
                    flexWrap={{ basis: "25" }}
                  />
                  {localStorage.getItem("JWT") && (
                    <QuotesSection
                      quotes={quotes}
                      setQuotes={setQuotes}
                      search="recent"
                      flexWrap={{ basis: "25" }}
                    />
                  )}
                </>
              }
            />
            <Route
              path="/profile"
              element={
                <Profile
                  quotes={quotes}
                  setQuotes={setQuotes}
                />
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
