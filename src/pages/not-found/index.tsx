import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const PageNotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="bg-blue-50 text-primary p-6 rounded-full mb-2">
        <span className="text-5xl font-black">404</span>
      </div>
      <h1 className="text-2xl font-bold text-slate-800">Halaman Tidak Ditemukan</h1>
      <p className="text-slate-500 max-w-md text-sm">
        Halaman yang Anda tuju tidak tersedia atau telah dipindahkan.
      </p>
      <Link to="/">
        <Button className="mt-4 gap-2 bg-primary hover:bg-primary/90">
          <Home size={16} /> Kembali ke Beranda
        </Button>
      </Link>
    </div>
  );
};

export default PageNotFound;
