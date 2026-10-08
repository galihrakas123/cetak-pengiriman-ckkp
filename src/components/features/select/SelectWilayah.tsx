import { ConfigContext } from "@/contexts/configContext";
import { useContext } from "react";
import Select from "react-select";
import { customStylesInputWithoutRounded } from "@/utils/utils";
import {
  getLocalStorage,
  setLocalStorage,
} from "@/services/localStorageService";

const SelectWilayah = () => {
  const { state, dispatch } = useContext(ConfigContext);

  const userData = getLocalStorage("userData");

  const isAdmin = userData?.kode_wilayah === "all";

  const onChangeP3D = (value) => {
    setLocalStorage("kodeWilayah", value.value);

    dispatch({
      type: "SET_KODE_WILAYAH",
      payload: value.value,
    });
    dispatch({
      type: "SET_NAMA_WILAYAH",
      payload: value.label,
    });
  };

  return (
    <section className="z-[999] ">
      <Select
        value={{
          value: state?.kodeWilayah,
          label: state?.namaWilayah,
        }}
        className="text-black"
        options={state?.kodeWilayahOptions || []}
        placeholder="Pilih P3D"
        onChange={(e) => onChangeP3D(e)}
        styles={customStylesInputWithoutRounded}
        isDisabled={!isAdmin}
      />
    </section>
  );
};

export default SelectWilayah;
