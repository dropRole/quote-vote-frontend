import "./button.css";

interface IAddButtonProps {
  domRef: React.RefObject<HTMLButtonElement>;
  clickAction: Function;
}

export const AddButton: React.FC<IAddButtonProps> = ({
  domRef,
  clickAction,
}) => {
  return (
    <button
      ref={domRef}
      className="btn-add"
      onClick={() => clickAction()}
    >
      <span></span>
      <span></span>
    </button>
  );
};
