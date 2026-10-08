import { useEffect, useState } from "react";
import Odometer from "react-odometerjs";
import "./odometer-white.scss";

export const WhiteOdometer = ({ data }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(data?.total_pkb_all);
  }, [data]);

  return (
    <Odometer
      value={value}
      format="(.ddd),dd"
      className="text-xl md:text-3xl lg:text-7xl text-secondary"
    />
  );
};
