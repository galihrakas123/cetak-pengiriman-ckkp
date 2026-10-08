import Odometer from "react-odometerjs";

import "./odometer-alat-berat.scss";
import classNames from "classnames";

interface OdometerAlatBeratProps {
  value: number;
  fontSize?: string;
}

const OdometerAlatBerat = ({
  value,
  fontSize = "text-[100px]",
}: OdometerAlatBeratProps) => {
  const className = classNames("odometer-kbm", fontSize);
  return (
    <Odometer
      value={value}
      format="(.ddd)"
      className={className}
      theme="alat-berat"
    />
  );
};

export default OdometerAlatBerat;
