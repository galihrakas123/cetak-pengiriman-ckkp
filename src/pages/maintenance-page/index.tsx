// Ganti path ini sesuai lokasi file ilustrasi kamu
import UnderConstruction from "/images/image-maintenance.png";

const MaintenancePage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center p-4">
      <img
        src={UnderConstruction}
        alt="Sedang dalam pengembangan"
        className="w-full max-w-md mb-8"
      />
      <h1 className="text-3xl font-bold mb-4">Sedang dalam pengembangan</h1>
      <p className="text-lg text-gray-600">
        Halaman ini sedang dalam proses pengembangan. Silakan kembali nanti.
      </p>
    </div>
  );
};

export default MaintenancePage;
