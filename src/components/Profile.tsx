import React, { useEffect, useState } from "react";
import "./profile.css";
import { getAvatar, getUserKarma } from "../services/users/users-get";
import { modalContent, IQuote, IUser } from "../App";
import { getQuotes } from "../services/quotes/quotes-get";
import { QuotesSection } from "../containers/QuotesSection";
import defaultAvatar from "../assets/icons/man.png";

interface IProfileSectionProps {
  user: IUser;
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
  setModalContent: React.Dispatch<React.SetStateAction<modalContent>>;
}

export const Profile: React.FC<IProfileSectionProps> = ({
  user,
  quotes,
  setQuotes,
  setModalOpen,
  setModalContent,
}) => {
  const [anyQuotes, setAnyQuotes] = useState<boolean>(true);

  const [anyVotedQuotes, setAnyVotedQuotes] = useState<boolean>(true);

  const params: URLSearchParams = new URL(window.location.toString())
    .searchParams;

  const [profileUsername, setProfileUsername] = useState<string>(
    params.get("username") as string
  );

  const [profileFullname, setProfileFullname] = useState<string>(
    params.get("fullname") as string
  );

  const [profileAvatar, setProfileAvatar] = useState<string | Blob>(
    defaultAvatar
  );

  const [userKarma, setUserKarma] = useState<{ quotes: number; karma: number }>(
    { quotes: 0, karma: 0 }
  );

  useEffect(() => {
    const streamUserAvatar = async (path: string) => {
      const stream: Blob = await getAvatar(path);

      setProfileAvatar(stream);
    };

    // if logged in user profile
    if (params.get("username") === user.username) {
      setProfileUsername(user.username);
      setProfileAvatar(user.avatar);
      setProfileFullname(`${user.name} ${user.surname}`);
    } else if (params.get("avatar") && params.get("avatar") !== "default")
      streamUserAvatar(params.get("avatar") as string);

    const fetchUserKarma = async () => {
      const karma: { quotes: number; karma: number } = await getUserKarma(
        params.get("username")
      );

      setUserKarma(karma);
    };

    const fetchQuotes = async () => {
      const recent = await getQuotes("recent", profileUsername, 10);

      // check for posted quotes
      setAnyQuotes(recent.length === 0 ? false : true);

      const most = await getQuotes("most", profileUsername, 10);

      const voted = await getQuotes("voted", "", 10);

      setAnyVotedQuotes(voted.length === 0 ? false : true);

      setQuotes({
        random: quotes.random,
        recent: recent,
        most: most,
        voted: voted,
      });
    };

    fetchQuotes();

    fetchUserKarma();
  }, [params, user, profileUsername, setQuotes, quotes.random, setUserKarma]);
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
        <p id="userFullname">{profileFullname}</p>
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
          anyQuotes={anyQuotes}
          search="most"
          flexWrap={{ basis: "" }}
          authorized={user.username}
          setModalOpen={setModalOpen}
          setModalContent={setModalContent}
        />
        <QuotesSection
          quotes={quotes}
          setQuotes={setQuotes}
          anyQuotes={anyQuotes}
          search="recent"
          flexWrap={{ basis: "" }}
          authorized={user.username}
          setModalOpen={setModalOpen}
          setModalContent={setModalContent}
        />
        <QuotesSection
          quotes={quotes}
          setQuotes={setQuotes}
          anyQuotes={anyVotedQuotes}
          search="voted"
          flexWrap={{ basis: "" }}
          authorized={user.username}
          setModalOpen={setModalOpen}
          setModalContent={setModalContent}
        />
      </div>
    </>
  );
};
