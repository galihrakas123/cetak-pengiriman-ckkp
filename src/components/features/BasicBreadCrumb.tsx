import { ChevronRight } from "lucide-react";

interface IBasicBreadCrumb {
  title1?: string;
  title2?: string;
  title3?: string;
}

const BasicBreadCrumb = ({
  title1 = "",
  title2 = "",
  title3 = "",
}: IBasicBreadCrumb) => {
  return (
    <p className="flex gap-3 items-center text-xs md:text-sm xl:text-base">
      {title1}
      {title2 !== "" && (
        <>
          <span>
            <ChevronRight />
          </span>
          <strong>{title2}</strong>
        </>
      )}
      {title3 !== "" && (
        <>
          <span>
            <ChevronRight />
          </span>
          <strong>{title3}</strong>
        </>
      )}
    </p>
  );
};

export default BasicBreadCrumb;
