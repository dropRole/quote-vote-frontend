import "./button.css";

interface IAddButtonProps {
  className: string
  clickAction: Function;
}

export const AddButton: React.FC<IAddButtonProps> = ({
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
    </button>
  );
};
