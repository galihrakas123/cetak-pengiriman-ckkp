import Odometer from "react-odometerjs";

import "./odometer-rp.scss";
import classNames from "classnames";

const OdometerRp = ({ value, fontSize = "text-[100px]" }) => {
  const classNameRp = classNames("odometer-kbm", fontSize);
  return (
    <Odometer
      value={value}
      format="(.ddd)"
      className={classNameRp}
      theme="rp"
    />
  );
};

export default OdometerRp;
