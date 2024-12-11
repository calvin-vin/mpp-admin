import { Clipboard } from "lucide-react";

interface CardTotalServiceProps {
  logo?: React.ReactNode;
  title: string;
  subTitle: string;
  total: number;
}

const CardTotalService: React.FC<CardTotalServiceProps> = ({
  logo,
  title,
  subTitle,
  total,
}) => {
  return (
    <div className="md:row-span-1 xl:row-span-2 bg-gradient-to-r from-primary to-secondary col-span-1 shadow-lg rounded-3xl p-6 flex flex-col justify-center items-center">
      {logo || <Clipboard className="text-white text-5xl mb-4" />}
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-white text-center mb-6">{subTitle}</p>
      <div className="text-5xl font-extrabold text-white">
        {total.toLocaleString()}
      </div>
    </div>
  );
};

export default CardTotalService;
