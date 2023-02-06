import React from "react";
import { IQuote } from "../App";
import { TextButton } from "./TextButton";
import { CardBox } from "./CardBox";

interface IIntroSectionProps {
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
  flexWrap: { basis: string };
}

export const IntroSection: React.FC<IIntroSectionProps> = ({
  quotes,
  setQuotes,
  flexWrap,
}) => {
  return (
    <section id="introSection">
      <div>
        <p className="h1">
          Welcome to <br></br>
          <span className="color-primary">Quote vote</span>
        </p>
        <p id="intro">
          Quotastic is free online platform for you to explore the quips,
          quotes, and proverbs. Sign up and express yourself.
        </p>
        <TextButton
          btn="btn-signup"
          text="Sign up"
          clickAction={() => (window.location.href = "/signup")}
        />
      </div>
      <CardBox
        quotes={quotes}
        setQuotes={setQuotes}
        renderingQuotes={quotes.recent.length ? quotes.recent.slice(0, 3) : []}
        flexWrap={{ basis: '' }}
        distinct={[1]}
        blured={[0, 2]}
      />
    </section>
  );
};
