import { Label } from "@/components/ui/label";
import Select from "react-select";

const SelectInputSearch = (props) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {props.label && (
        <Label htmlFor="" className="base-label font-bold text-sm">
          {props.label}
        </Label>
      )}
      <Select
        classNames={props.classNames}
        styles={{ ...props.styles }}
        placeholder={props.placeholder}
        options={props.options}
        value={props.value}
        onChange={props.onChange}
        isDisabled={props.isDisabled}
        {...props.rest}
      />
    </div>
  );
};

export default SelectInputSearch;

SelectInputSearch.defaultProps = {
  label: null,
  className: null,
  styles: {},
  placeholder: "Pilih...",
  options: [],
  onChange: () => {},
  value: null,
};
