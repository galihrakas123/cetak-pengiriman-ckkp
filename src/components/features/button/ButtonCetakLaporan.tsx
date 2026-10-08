import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface props {
  onClickPdf?: (value: any) => void;
  onClickCsv?: (value: any) => void;
  disabled?: boolean;
}
const ButtonCetakLaporan = ({ onClickPdf, onClickCsv, disabled }: props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"outline"}
          className="min-w-[8rem]"
          disabled={disabled}
        >
          Cetak <ChevronDown className="ml-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onClickPdf}>
            <span onClick={onClickPdf}>PDF</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onClickCsv}>
            <span>CSV</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ButtonCetakLaporan;
