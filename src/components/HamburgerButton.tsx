import "./button.css";

interface IHamburgerButtonProps {
  className: string;
  clickAction: Function;
}

export const HamburgerButton: React.FC<IHamburgerButtonProps> = ({
  className,
  clickAction,
}) => {
  return (
    <button
      className={className}
      onClick={() => clickAction()}
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
};
