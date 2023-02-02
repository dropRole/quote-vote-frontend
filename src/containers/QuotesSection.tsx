import React, { useRef } from "react";
import { IQuote } from "../App";
import { getQuotes } from "../services/quotes/quotes-get";
import { CardBox } from "../components/CardBox";
import { TextButton } from "../components/TextButton";

interface IQuotesSectionProps {
  quotes: { random: IQuote[]; recent: IQuote[]; most: IQuote[] };
  setQuotes: React.Dispatch<
    React.SetStateAction<{ random: IQuote[]; recent: IQuote[]; most: IQuote[] }>
  >;
  search: string;
  limit?: number;
  setLimit?: React.Dispatch<React.SetStateAction<number>>;
}

export const QuotesSection: React.FC<IQuotesSectionProps> = ({
  quotes,
  setQuotes,
  search,
  limit,
  setLimit,
}) => {
  const cardBox: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const loadMoreButton: React.RefObject<HTMLButtonElement> =
    useRef<HTMLButtonElement>(null);

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
    // if ref object instantiated
    if (cardBox.current && limit && setLimit) {
      setLimit(cardBox.current.querySelectorAll("div.card").length + 10);

      const loaded: IQuote[] = await getQuotes(search, author, limit);

      switch (search) {
        case "recent":
          setQuotes({
            random: quotes.random,
            recent: loaded,
            most: quotes.most,
          });
          break;

        case "most":
          setQuotes({
            random: quotes.random,
            recent: quotes.recent,
            most: loaded,
          });
          break;
      }

      // if loaded amount is lesser than the limit
      if (loaded.length < limit) {
        // if ref object instantiated
        if (loadMoreButton.current)
          loadMoreButton.current.classList.add("d-none");

        return;
      }

      // if ref object instantiated
      if (loadMoreButton.current)
        loadMoreButton.current.classList.remove("d-none");

      return;
    }
  };
  return (
    <section className="quotes">
      <p className="h3 text-center">
        <span className="color-primary">{inscription}</span>
      </p>
      <p className="text-center">{explication}</p>
      <CardBox
        quotes={quotes}
        setQuotes={setQuotes}
        domRef={cardBox}
        renderingQuotes={quotes[quotesKey].slice(0, limit)}
        wrap={true}
      />
      {
        <p
          className={quotes[quotesKey].length === 10 ? "text-center" : "d-none"}
        >
          <TextButton
            btn="btn-outline"
            text={
              localStorage.getItem("JWT") ? "Load more" : "Sign up to see more"
            }
            clickAction={
              localStorage.getItem("JWT")
                ? () => loadQuotes(search, "")
                : () => (window.location.pathname = "/signup")
            }
            domRef={loadMoreButton}
          />
        </p>
      }
    </section>
  );
};
