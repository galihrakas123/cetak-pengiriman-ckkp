import ReactSpeedometer from "react-d3-speedometer";

const SpeedoTargetJenis = ({ persenBulanIni, title = "PKB" }) => {
  const formatComma = (val: any) => {
    const num = Number(val);
    if (isNaN(num)) return "0,00";
    return num.toFixed(2).replace(".", ",");
  };

  return (
    <div className="base-card h-full text-center">
      <p className="text-xl font-semibold mb-4">
        % Realisasi dan Target {title}
      </p>

      <div className="text-center">
        <div className="w-[260px] md:w-[500px] h-[300px] flex justify-center items-center mx-auto">
          <ReactSpeedometer
            minValue={0}
            maxValue={110}
            value={Number(persenBulanIni) || 0}
            currentValueText={`${formatComma(persenBulanIni)} %`}
            needleColor="red"
            fluidWidth={true}
            segments={6}
            customSegmentStops={[0, 20, 40, 60, 80, 100, 110]}
            segmentColors={[
              "#F8B82E",
              "#52a85e",
              "#52a85e",
              "#52a85e",
              "#52a85e",
              "#49BDF2",
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default SpeedoTargetJenis;
