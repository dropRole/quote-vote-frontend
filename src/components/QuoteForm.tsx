import React, { useRef, useState } from "react";
import { postQuote } from "../services/quotes/quotes-post";
import { updateQuote } from "../services/quotes/quotes-patch";
import "./quote-form.css";
import { TextButton } from "./TextButton";
import { deleteQuote } from "../services/quotes/quotes-delete";
import { IQuote } from "../App";
import { getQuotes } from "../services/quotes/quotes-get";

export type quoteForm = "post" | "edit" | "un-post";

interface IQuoteFormProps {
  type: quoteForm;
  data: { id: string; quote: string };
  username: string;
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
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const QuoteForm: React.FC<IQuoteFormProps> = ({
  type,
  data,
  username,
  quotes,
  setQuotes,
  setModalOpen,
}) => {
  const [result, setResult] = useState<boolean | undefined>(undefined);

  const form: React.RefObject<HTMLFormElement> = useRef<HTMLFormElement>(null);

  return result === undefined ? (
    <form
      ref={form}
      id="quote"
      onSubmit={async (e) => {
        e.preventDefault();

        let result: boolean | undefined = undefined;
        // if post form
        if (type === "post" && form.current)
          result = await postQuote(form.current);

        // if edit form
        if (type === "edit" && form.current)
          result = await updateQuote(form.current);

        // if edit form
        if (type === "un-post" && form.current)
          result = await deleteQuote(data.id);

        // if the result is affirmative
        if (result) {
          const most: IQuote[] = await getQuotes("most", username, quotes.most.length);

          const recent: IQuote[] = await getQuotes(
            "recent",
            "droprole",
            quotes.most.length
          );

          setQuotes({
            random: quotes.random,
            most: most,
            recent: recent,
            voted: quotes.voted,
          });
        }

        setResult(result);
      }}
    >
      {type === "post" && (
        <>
          <p className="text-center">
            Are you feeling <span className="color-primary">inspired?</span>
          </p>
          <p className="text-center">
            You can post quotes. You can delete them on your profile.
          </p>
        </>
      )}

      {type === "edit" && (
        <p className="text-center">
          Edit your <span className="color-primary">quote</span>
        </p>
      )}

      {type === "un-post" && (
        <p className="text-center">
          Un-<span className="color-primary">quote</span>?
        </p>
      )}

      <input type="hidden" name="id" value={data.id} />
      {type !== "un-post" && (
        <textarea
          name="quote"
          cols={30}
          rows={6}
          defaultValue={data.quote}
          required
        ></textarea>
      )}
      <div>
        <TextButton btn="btn-signup" text="Submit" clickAction={() => {}} />
        <TextButton
          btn="btn-default"
          text="Close"
          clickAction={() => {
            setModalOpen(false);
          }}
        />
      </div>
    </form>
  ) : (
    <div className="d-flex flex-column">
      <p className="text-center">
        Your <span className="color-primary">quote</span>{" "}
        {result ? "was" : "wasn't"} {`${type}ed`}.
      </p>
      <TextButton
        btn="btn-default"
        text="Cancel"
        clickAction={() => {
          setModalOpen(false);
        }}
      />
    </div>
  );
};
