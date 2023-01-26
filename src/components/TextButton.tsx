import "./button.css";

interface ITextButtonProps {
  btn: string;
  text: string;
  clickAction: Function;
  domRef?: React.RefObject<HTMLButtonElement>;
}

export const TextButton: React.FC<ITextButtonProps> = ({ btn, text, domRef, clickAction }) => {
  return (
    <button
      className={btn}
      onClick={() => clickAction()}
      ref={domRef}
    >
      {text}
    </button>
  );
};
