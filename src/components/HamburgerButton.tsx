import "./button.css";

interface IHamburgerButtonProps {
  domRef: React.RefObject<HTMLButtonElement>;
  clickAction: Function;
}

export const HamburgerButton: React.FC<IHamburgerButtonProps> = ({
  domRef,
  clickAction,
}) => {
  return (
    <button
      ref={domRef}
      className="btn-hamburger"
      onClick={() => clickAction()}
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
};
