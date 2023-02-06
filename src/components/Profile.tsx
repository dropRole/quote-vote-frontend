import React, { useEffect, useState } from "react";
import "./profile.css";
import { getUserAvatar, getUserKarma } from "../services/users/users-get";
import { IQuote } from "../App";
import { getQuotes } from "../services/quotes/quotes-get";
import { QuotesSection } from "../containers/QuotesSection";
import defaultAvatar from "../assets/icons/man.png";

interface IProfileSectionProps {
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
}

export const Profile: React.FC<IProfileSectionProps> = ({
  quotes,
  setQuotes,
}) => {
  const [profileAvatar, setProfileAvatar] = useState<Blob | string>(
    defaultAvatar
  );

  const [userKarma, setUserKarma] = useState<{ quotes: number; karma: number }>(
    { quotes: 0, karma: 0 }
  );

  const username: string = new URL(
    document.location.toString()
  ).searchParams.get("username") as string;

  const fullname: string = new URL(
    document.location.toString()
  ).searchParams.get("fullname") as string;

  const avatarPath: string = new URL(
    document.location.toString()
  ).searchParams.get("avatar") as string;

  useEffect(() => {
    const fetchUserKarma = async () => {
      const karma = await getUserKarma(username);
      setUserKarma(karma);
    };

    const fetchQuotes = async () => {
      const recent = await getQuotes("recent", username, 10);

      const most = await getQuotes("most", username, 10);

      const voted = await getQuotes("voted", "", 10);
      
      setQuotes({
        random: quotes.random,
        recent: recent,
        most: most,
        voted: voted,
      });
    };

    const streamUserAvatar = async () => {
      const stream = await getUserAvatar(avatarPath);

      setProfileAvatar(stream);
    };

    // if avatar path is given
    if (avatarPath !== "default") streamUserAvatar();

    fetchQuotes();

    fetchUserKarma();
  }, [username, quotes.random, setQuotes, avatarPath, setProfileAvatar]);
  return (
    <>
      <div id="profile">
        <img
          src={
            typeof profileAvatar === "string"
              ? profileAvatar
              : URL.createObjectURL(profileAvatar)
          }
          alt="avatar"
        />
        <p id="userFullname">{fullname}</p>
        <div id="karmaStats">
          <div>
            <span>Quotes</span>
            <span className="color-primary">{userKarma.quotes}</span>
          </div>
          <div>
            <span>Quotastic karma</span>
            <span>{userKarma.karma}</span>
          </div>
        </div>
      </div>
      <div id="profileQuotes">
        <QuotesSection
          quotes={quotes}
          setQuotes={setQuotes}
          search="most"
          flexWrap={{ basis: "" }}
        />
        <QuotesSection
          quotes={quotes}
          setQuotes={setQuotes}
          search="recent"
          flexWrap={{ basis: "" }}
        />
        <QuotesSection
          quotes={quotes}
          setQuotes={setQuotes}
          search="voted"
          flexWrap={{ basis: "" }}
        />
      </div>
    </>
  );
};
