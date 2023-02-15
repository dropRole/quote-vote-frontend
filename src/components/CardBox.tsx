import React from "react";
import { modalContent, IQuote } from "../App";
import { Card } from "../containers/Card";
import { voteOnQuote } from "../services/quotes/quotes-votes-patch";
import "./card-box.css";

interface ICardBoxProps {
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
  renderingQuotes: IQuote[];
  flexWrap: { basis: string };
  domRef?: React.RefObject<HTMLDivElement>;
  authorized?: string;
  setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setModalContent?: React.Dispatch<React.SetStateAction<modalContent>>;
  distinct?: number[];
  blured?: number[];
}

export const CardBox: React.FC<ICardBoxProps> = ({
  setQuotes,
  renderingQuotes,
  quotes,
  domRef,
  flexWrap,
  authorized,
  setModalOpen,
  setModalContent,
  distinct,
  blured,
}) => {
  // determine the vote status
  const determineVoteOnQuote: Function = (
    quote: IQuote,
    id: string,
    vote: boolean
  ): IQuote => {
    // if quotes match
    if (quote.quotes_id !== id) return quote;

    // if upvoted
    if (vote) {
      // if already up voted
      if (quote.votes_vote) {
        quote.votes_total = quote.votes_total - 1;

        quote.votes_vote = undefined;

        return quote;
      }

      // if up from down voted
      if (quote.votes_vote === false)
        quote.votes_total = quote.votes_total - -2;

      // if yet to be voted
      if (quote.votes_vote === undefined)
        quote.votes_total = quote.votes_total - -1;

      quote.votes_vote = true;
    }

    // if downvoted
    if (vote === false) {
      // if already down voted
      if (quote.votes_vote === false) {
        quote.votes_total = quote.votes_total - -1;

        quote.votes_vote = undefined;

        return quote;
      }

      // if down from up voted
      if (quote.votes_vote) quote.votes_total = quote.votes_total - 2;

      // if yet to be voted
      if (quote.votes_vote === undefined)
        quote.votes_total = quote.votes_total - 1;

      quote.votes_vote = false;
    }

    return quote;
  };

  // up or down vote on the quote
  const upDownVote: Function = async (
    target: any,
    id: string,
    vote: boolean
  ) => {
    target.classList.add("ignore-pointer-events");

    const voted: boolean = await voteOnQuote(id, vote);

    // if voted
    if (voted) {
      setQuotes({
        random: quotes.random.map(
          (q): IQuote => determineVoteOnQuote(q, id, vote)
        ),
        recent: quotes.recent.map(
          (q): IQuote => determineVoteOnQuote(q, id, vote)
        ),
        most: quotes.most
          .map((q): IQuote => determineVoteOnQuote(q, id, vote))
          .sort((a: IQuote, b: IQuote) =>
            a.votes_total > b.votes_total
              ? -1
              : a.votes_total === b.votes_total
              ? 0
              : 1
          ),
        voted: quotes.voted.map(
          (q): IQuote => determineVoteOnQuote(q, id, vote)
        ),
      });
    }

    target.classList.remove("ignore-pointer-events");
  };

  return (
    <div
      ref={domRef}
      className={`card-box${renderingQuotes.length === 1 ? " box-one" : ""}${flexWrap.basis ? ` flex-basis-${flexWrap.basis}` : ""}`}
    >
      {renderingQuotes.map((q, index) => {
        let distinctCard = distinct
          ? distinct.find((e) => e === index) === undefined
            ? false
            : true
          : false;
        let bluredCard = blured
          ? blured.find((e) => e === index) === undefined
            ? false
            : true
          : false;
        return (
          <Card
            key={q.quotes_id}
            id={q.quotes_id}
            quote={q.quotes_quote}
            written={q.quotes_written}
            updated={q.quotes_updated}
            username={q.quotes_username}
            avatar={q.users_avatar}
            fullname={q.users_fullname}
            total={q.votes_total}
            vote={q.votes_vote}
            distinct={distinctCard}
            blured={bluredCard}
            voteOnQuote={upDownVote}
            authorized={authorized}
            setModalOpen={setModalOpen}
            setModalContent={setModalContent}
          />
        );
      })}
    </div>
  );
};
