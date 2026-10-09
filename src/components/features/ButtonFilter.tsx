import { Button } from "../ui/button";
import { Filter } from "lucide-react";

const ButtonFilter = () => {
  return (
    <Button className="flex items-center justify-center lg:text-sm py-3 px-4 rounded-md gap-3 border bg-background text-primary border-primary">
      <Filter size={16} className="text-gray-600" />
      <span>Filter</span>
    </Button>
  );
};

export default ButtonFilter;
