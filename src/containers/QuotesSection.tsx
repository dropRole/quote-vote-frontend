import React, { useState } from "react";
import { modalContent, IQuote } from "../App";
import { getQuotes } from "../services/quotes/quotes-get";
import { CardBox } from "../components/CardBox";
import { TextButton } from "../components/TextButton";

interface IQuotesSectionProps {
  quotes: {
    random: IQuote[];
    recent: IQuote[];
    most: IQuote[];
    voted: IQuote[];
  };
  setQuotes: React.Dispatch<
    React.SetStateAction<{
      random: IQuote[];
      recent: IQuote[];
      most: IQuote[];
      voted: IQuote[];
    }>
  >;
  anyQuotes: boolean;
  search: string;
  flexWrap: { basis: string };
  authorized?: string;
  setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setModalContent?: React.Dispatch<React.SetStateAction<modalContent>>;
}

export const QuotesSection: React.FC<IQuotesSectionProps> = ({
  quotes,
  setQuotes,
  anyQuotes,
  search,
  flexWrap,
  authorized,
  setModalOpen,
  setModalContent,
}) => {
  const [limit, setLimit] = useState<number>(10);

  const [loadMore, setLoadMore] = useState<boolean>(true);

  const quotesKey = search as keyof typeof quotes;

  let inscription: string, explication: string;

  switch (search) {
    case "random":
      inscription = "Quote of the day";
      explication = "Quote of the day is randomly choosen quote.";
      break;

    case "recent":
      inscription = "Most recent quotes";
      explication =
        "Recent quotes updates as soon user adds new quote. Go ahed show them that you seen the new quote and like the ones you like.";
      break;

    case "most":
      inscription = "Most up-voted quotes";
      explication =
        "Most upvoted quotes on the platform. Sign up or login to like the quotes and keep them saved in your profile";
      break;

    case "voted":
      inscription = "Voted-on quotes";
      explication =
        "Most upvoted quotes on the platform. Sign up or login to like the quotes and keep them saved in your profile";
      break;

    default:
      inscription = "recent";
      explication =
        "Recent quotes updates as soon user adds new quote. Go ahed show them that you seen the new quote and like the ones you like.";
  }

  // load more and limited amount of quotes
  const loadQuotes: Function = async (
    search: string = "",
    author: string = ""
  ) => {
    setLimit(quotes[quotesKey].length + 10);

    const loaded: IQuote[] = await getQuotes(
      search,
      author,
      quotes[quotesKey].length + 10
    );

    switch (search) {
      case "recent":
        setQuotes({
          random: quotes.random,
          recent: loaded,
          most: quotes.most,
          voted: quotes.voted,
        });
        break;

      case "most":
        setQuotes({
          random: quotes.random,
          recent: quotes.recent,
          most: loaded,
          voted: quotes.voted,
        });
        break;

      case "voted":
        setQuotes({
          random: quotes.random,
          recent: quotes.recent,
          most: quotes.most,
          voted: loaded,
        });
        break;
    }

    // if loaded amount is lesser than the limit
    if (loaded.length <= limit) setLoadMore(false);

    return;
  };
  return (
    <section className="quotes">
      <p className="h3 text-center">
        <span className="color-primary">{inscription}</span>
      </p>
      {window.location.pathname !== "/profile" && (
        <p className="text-center">{explication}</p>
      )}
      {anyQuotes ? (
        <>
          <CardBox
            quotes={quotes}
            setQuotes={setQuotes}
            renderingQuotes={quotes[quotesKey].slice(0, limit)}
            authorized={authorized}
            setModalOpen={setModalOpen}
            setModalContent={setModalContent}
            flexWrap={flexWrap}
          />
          {
            <p
              className={
                quotes[quotesKey].length === 10 ? "text-center" : "d-none"
              }
            >
              {loadMore && (
                <TextButton
                  btn="btn-outline"
                  text={
                    localStorage.getItem("JWT")
                      ? "Load more"
                      : "Sign up to see more"
                  }
                  clickAction={
                    localStorage.getItem("JWT")
                      ? () => {
                          loadQuotes(
                            search,
                            window.location.pathname === "/profile" &&
                              search !== "voted"
                              ? new URL(
                                  window.location.toString()
                                ).searchParams.get("username")
                              : ""
                          );
                        }
                      : () => (window.location.href = "/signup")
                  }
                />
              )}
            </p>
          }
        </>
      ) : (
        <p className="nought-quotes">Nought quotes</p>
      )}
    </section>
  );
};
