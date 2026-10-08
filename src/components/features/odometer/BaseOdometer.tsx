import { useEffect, useState } from "react";
import Odometer from "react-odometerjs";
import "./odometer.scss";

export const BaseOdometer = ({ data, className }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(data);
  }, [data]);

  return (
    <Odometer value={value || 0} format="(.ddd),dd" className={className} />
  );
};
