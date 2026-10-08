import { axiosServices } from "@/services/axios";
import { useQuery } from "react-query";
import { toast } from "./use-toast";
import { useContext } from "react";
import { ConfigContext } from "@/contexts/configContext";

const useGetWilayah = () => {
  const { dispatch } = useContext(ConfigContext);
  const fetchKabKotaList = async () => {
    try {
      const res = await axiosServices().get("kabkota");
      return res.data.data;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal memuat data kabupaten/kota",
        description: error.message,
      });
    }
  };

  const { data: listP3D, isLoading } = useQuery({
    queryKey: ["get-list-p3d"],
    queryFn: fetchKabKotaList,
    refetchOnWindowFocus: false,
    retry: 5,
  });

  const wilayah = listP3D?.map((item) => ({
    value: item.kd_kabkota,
    label: item.nm_kabkota,
  }));

  dispatch({
    type: "SET_KODE_WILAYAH_OPTIONS",
    payload: wilayah,
  });

  return { wilayah, isLoading };
};

export default useGetWilayah;
