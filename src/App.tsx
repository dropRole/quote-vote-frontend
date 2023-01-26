import { useEffect, useState } from "react";
import { Nav } from "./components/Nav";
import { Footer } from "./layouts/Footer";
import { getQuotes, getRandomQuote } from "./services/quotes/quotes-get";
import { getUserAvatar, getUserInfo } from "./services/users/users-get";
import { IntroSection } from "./components/IntroSection";
import { QuotesSection } from "./containers/QuotesSection";

export interface IUser {
  username: string;
  name: string;
  surname: string;
  email: string;
  avatar: Blob;
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
  }>({
    random: [],
    recent: [],
    most: [],
  });

  const [user, setUser] = useState<IUser>({} as IUser);

  const [collapsed, setCollapsed] = useState<boolean>(false);

  const [recentLimit, setRecentLimit] = useState<number>(10);

  const [mostLimit, setMostLimit] = useState<number>(10);

  // fetching data from the API
  useEffect(() => {
    const fetchQuotes: Function = async () => {
      const rnd: IQuote[] = [await getRandomQuote()];

      const recent: IQuote[] = await getQuotes("recent", "", recentLimit);

      const most: IQuote[] = await getQuotes("most", "", mostLimit);

      setQuotes({
        random: rnd,
        recent,
        most,
      });
    };

    // if logged in user
    if (localStorage.getItem("JWT")) {
      const fetchUserData: Function = async () => {
        const user: {
          username: string;
          name: string;
          surname: string;
          email: string;
          avatar: string;
        } = await getUserInfo();

        const avatar = await getUserAvatar(user.avatar);

        setUser({
          username: user.username,
          name: user.name,
          surname: user.surname,
          email: user.email,
          avatar,
        });
      };

      fetchUserData();
    }

    fetchQuotes();
  }, [mostLimit, recentLimit]);

  return (
    <>
      <Nav collapsed={collapsed} setCollapsed={setCollapsed} avatar={user.avatar} username={user.username} />
      <div id="container">
        {localStorage.getItem("JWT") ? (
          <QuotesSection
            quotes={quotes}
            setQuotes={setQuotes}
            search="random"
          />
        ) : (
          <>
            <IntroSection quotes={quotes} setQuotes={setQuotes} />
            <p className="h2 text-center">
              Explore the world of <br />
              <span className="color-primary">fantastic quotes</span>
            </p>
          </>
        )}
        <QuotesSection
          quotes={quotes}
          setQuotes={setQuotes}
          limit={recentLimit}
          setLimit={setRecentLimit}
          search="most"
        />
        {localStorage.getItem("JWT") && (
          <QuotesSection
            quotes={quotes}
            setQuotes={setQuotes}
            search="recent"
            limit={mostLimit}
            setLimit={setMostLimit}
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default App;
