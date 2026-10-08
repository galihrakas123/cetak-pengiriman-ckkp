import Odometer from "react-odometerjs";

import "./odometer-kbm.scss";
import classNames from "classnames";

const OdometerKbm = ({ value, fontSize = "text-[100px]" }) => {
  const classNameKbm = classNames("odometer-kbm", fontSize);
  return (
    <Odometer
      value={value}
      format="(.ddd)"
      className={classNameKbm}
      theme="kbm"
    />
  );
};

export default OdometerKbm;
