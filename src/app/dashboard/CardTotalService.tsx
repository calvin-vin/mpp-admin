import { Clipboard } from "lucide-react";

interface CardTotalServiceProps {
  totalServices: number;
}

const CardTotalService: React.FC<CardTotalServiceProps> = ({
  totalServices,
}) => {
  return (
    <div className="md:row-span-1 xl:row-span-2 bg-gradient-to-r from-[#16927E] to-[#F2D457] col-span-1 shadow-lg rounded-3xl p-6 flex flex-col justify-center items-center">
      <Clipboard className="text-white text-5xl mb-4" />
      <h2 className="text-2xl font-bold text-white mb-2">Total Layanan</h2>
      <p className="text-white text-center mb-6">
        Jumlah layanan yang telah ditangani
      </p>
      <div className="text-5xl font-extrabold text-white">
        {totalServices.toLocaleString()}
      </div>
    </div>
  );
};

export default CardTotalService;
