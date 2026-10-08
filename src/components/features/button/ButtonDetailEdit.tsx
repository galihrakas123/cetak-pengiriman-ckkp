import { BsEyeFill, BsPencilFill } from "react-icons/bs";

const ButtonDetailEdit = ({ setOpen, isEditable }) => {
  return (
    <span
      className="w-full text-left flex flex-row items-center gap-2 p-2 py-1 transition-colors hover:bg-accent focus:text-accent-foreground cursor-pointer"
      onClick={() => setOpen(true)}
    >
      {isEditable ? (
        <>
          <BsPencilFill className="mr-3 text-lg text-primary" /> Edit
        </>
      ) : (
        <>
          <BsEyeFill className="mr-3 text-lg text-primary" /> Detail
        </>
      )}
    </span>
  );
};

export default ButtonDetailEdit;
