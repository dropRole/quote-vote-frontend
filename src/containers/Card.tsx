import chevron from "../assets/icons/chevron.png";
import colouredChevron from "../assets/icons/chevron-coloured.png";
import "./card.css";
import defaultAvatar from "../assets/icons/man.png";
import { useEffect, useState } from "react";
import { getUserAvatar } from "../services/users/users-get";

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
  wrap: boolean;
  voteOnQuote: Function;
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
  blured,
  wrap,
  voteOnQuote,
}) => {
  const [userAvatar, setUserAvatar] = useState<Blob | string>(defaultAvatar);

  useEffect(() => {
    // if user has an avatar
    if (avatar !== "null") {
      const fetchUserAvatar = async () => {
        const image = await getUserAvatar(avatar);

        setUserAvatar(image);
      };

      fetchUserAvatar();
    } else setUserAvatar(defaultAvatar);
  }, [avatar]);

  return (
    <div
      className={`card${distinct ? " card-distinct" : ""} ${
        blured && " card-blured"
      } ${wrap ? "card-wrap" : ""}`}
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
          className={
            !localStorage.getItem("JWT") ? "chevron-disabled" : "chevron-down"
          }
          alt="⌄"
        />
      </div>
      <div className="quote">
        <p className="content">{quote}</p>
        <div className="author">
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
    </div>
  );
};
