import chevron from "../assets/icons/chevron.png";
import colouredChevron from "../assets/icons/chevron-coloured.png";
import "./card.css";
import defaultAvatar from "../assets/icons/man.png";
import { useEffect, useState } from "react";
import { getAvatar } from "../services/users/users-get";
import settings from "../assets/icons/setting.png";
import deletion from "../assets/icons/remove.png";
import { modalContent } from "../App";

interface ICardProps {
  id: string;
  quote: string;
  written: Date;
  updated: Date;
  username: string;
  avatar: string;
  fullname: string;
  total: number;
  vote: boolean | undefined;
  voteOnQuote: Function;
  authorized?: string;
  setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setModalContent?: React.Dispatch<React.SetStateAction<modalContent>>;
  blured?: boolean;
  distinct?: boolean;
}

export const Card: React.FC<ICardProps> = ({
  id,
  quote,
  written,
  updated,
  username,
  avatar,
  fullname,
  total,
  vote,
  distinct,
  authorized,
  setModalOpen,
  setModalContent,
  blured,
  voteOnQuote,
}) => {
  const [userAvatar, setUserAvatar] = useState<Blob | string>(defaultAvatar);

  useEffect(() => {
    // if user has an avatar
    if (avatar !== null) {
      const fetchUserAvatar = async () => {
        const image = await getAvatar(avatar);

        setUserAvatar(image);
      };

      fetchUserAvatar();
    } else setUserAvatar(defaultAvatar);
  }, [avatar]);

  return (
    <div
      className={`card${distinct ? " card-distinct" : ""} ${
        blured ? " card-blured" : ""
      }`}
    >
      <div className="card-votes">
        <img
          src={vote ? colouredChevron : chevron}
          onClick={(e) => voteOnQuote(e.target, id, true)}
          className={!localStorage.getItem("JWT") ? "chevron-disabled" : ""}
          alt="⌃"
        />
        <span>{total}</span>
        <img
          src={
            vote === undefined
              ? chevron
              : vote === false
              ? colouredChevron
              : chevron
          }
          onClick={(e) => {
            voteOnQuote(e.target, id, false);
          }}
          className={`chevron-down  
            ${!localStorage.getItem("JWT") ? "chevron-disabled" : ""}
          `}
          alt="⌄"
        />
      </div>
      <div className="quote">
        <p className="content">{quote}</p>
        <div
          className="author"
          onClick={() => {
            window.location.href = `/profile?username=${username}&fullname=${fullname}&avatar=${
              avatar === null ? "default" : avatar
            }`;
          }}
        >
          <img
            src={
              typeof userAvatar === "string"
                ? userAvatar
                : URL.createObjectURL(userAvatar)
            }
            alt="avatar"
          />
          <p className="fullname">{fullname}</p>
        </div>
        <p className="written">{`${new Date(written).toLocaleDateString()} ${
          updated ? "- " + new Date(updated).toLocaleDateString() : ""
        }`}</p>
      </div>
      {authorized &&
        setModalOpen &&
        setModalContent &&
        username === authorized && (
          <div className="quote-settings">
            <img
              src={settings}
              alt="settings"
              onClick={() => {
                setModalOpen(true);
                setModalContent({
                  type: "quote",
                  data: { formType: "edit", id, quote },
                });
              }}
            />
            <img
              src={deletion}
              alt="deletion"
              onClick={() => {
                setModalOpen(true);
                setModalContent({
                  type: "quote",
                  data: { formType: "un-post", id },
                });
              }}
            />
          </div>
        )}
    </div>
  );
};
