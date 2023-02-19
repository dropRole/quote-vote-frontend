import "./button.css";

interface ITextButtonProps {
  btn: string;
  text: string;
  clickAction: Function;
  preventDefault?: boolean;
  domRef?: React.RefObject<HTMLButtonElement>;
}

export const TextButton: React.FC<ITextButtonProps> = ({
  btn,
  text,
  clickAction,
  preventDefault,
  domRef,
}) => {
  return (
    <button
      className={btn}
      onClick={(e) => {
        if (preventDefault) e.preventDefault();
        clickAction();
      }}
      ref={domRef}
    >
      {text}
    </button>
  );
};
