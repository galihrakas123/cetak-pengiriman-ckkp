import { BsSearch } from "react-icons/bs";
import Select from "react-select";

import { customStylesInputWithoutRounded } from "../../../utils/utils";
import { Input } from "@/components/ui/input";

const DropdownInput = (props: any) => {
  const {
    selectedOptions,
    inputValue,
    handleChange,
    options,
    handleChangeInput,
    onkeydown,
  } = props;
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex w-full">
        <Select
          className="text-sm text-white"
          value={selectedOptions}
          onChange={handleChange}
          options={options}
          styles={customStylesInputWithoutRounded}
        />
        <span className="p-input-icon-right w-full">
          <BsSearch className="cursor-pointer" />
          <Input
            onKeyDown={onkeydown}
            value={inputValue}
            placeholder={"Cari Nama Menu"}
            className="text-sm w-full rounded-none rounded-r-lg"
            onChange={handleChangeInput}
            style={{
              borderRadius: "0 0.375rem 0.375rem 0",
              borderLeft: "none",
            }}
          />
        </span>
      </div>
    </div>
  );
};

export default DropdownInput;
