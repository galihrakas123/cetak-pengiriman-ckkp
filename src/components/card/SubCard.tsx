import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";

const SubCard = ({
  title = "e-Samsat Nasional",
  color,
  countRupiah,
  countKendaraan,
  hasButton = false,
  link,
  isLoading,
}) => {
  return (
    <section className="base-card h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-base xl:text-lg font-bold">{title}</h1>
        {hasButton && (
          <div>
            <Link to={link}>
              <Button
                size={"sm"}
                variant={"outline"}
                className="flex items-center gap-3 text-primary"
              >
                Detail <ExternalLink size={18} />
              </Button>
            </Link>
          </div>
        )}
      </div>
      <h2 className="text-lg xl:text-2xl font-bold my-3">
        {isLoading ? (
          <Skeleton className="w-[100px] h-[20px] rounded" />
        ) : (
          <strong>Rp {countRupiah}</strong>
        )}
      </h2>
      <div className="font-extrabold text-base xl:text-lg">
        {isLoading ? (
          <Skeleton className="w-[100px] h-[20px] rounded" />
        ) : (
          <strong>{countKendaraan}</strong>
        )}{" "}
        Kendaraan Bermotor
      </div>
      <div className={cn("h-2 rounded-full mt-2", color)}></div>
    </section>
  );
};

export default SubCard;
