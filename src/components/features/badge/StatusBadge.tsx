import { Badge } from "@/components/ui/badge";

export const generateStatus = (status) => {
  switch (status) {
    case 1:
      return (
        <Badge variant={"default"} className="rounded-lg">
          Aktif
        </Badge>
      );
    default:
      return (
        <Badge variant={"destructive"} className="rounded-lg whitespace-nowrap">
          Tidak Aktif
        </Badge>
      );
  }
};
