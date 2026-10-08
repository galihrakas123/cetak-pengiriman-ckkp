import { Button } from "../ui/button";

const ButtonFilter = () => {
  return (
    <Button className="flex items-center justify-center lg:text-sm py-3 px-4 rounded-md gap-3 border bg-background text-primary border-primary">
      <i className="fas fa-filter text-gray-600"></i>
      <span className="">Filter</span>
    </Button>
  );
};

export default ButtonFilter;
