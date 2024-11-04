// src/components/CardSatisfaction.tsx

import { ChartLine } from "lucide-react";
import React, { useEffect, useState } from "react";

// Data Mocking untuk Progress Bar
const parameters = [
  { name: "Prosedur", value: 85 },
  { name: "Kecepatan", value: 90 },
  { name: "Biaya", value: 75 },
  { name: "Produk", value: 80 },
  { name: "Kompetensi", value: 95 },
  { name: "Fasilitas", value: 70 },
  { name: "Pelayanan", value: 88 },
  { name: "Kepuasan", value: 92 },
];

// Komponen Progress Bar dengan Animasi
const ProgressBar = ({ value }: { value: number }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Animasi progress bar setelah komponen dimuat
    setTimeout(() => setWidth(value), 500);
  }, [value]);

  return (
    <div className="w-full bg-gray-200 rounded-full h-4">
      <div
        className="bg-gradient-to-r from-[#16927E] to-[#F2D457] h-4 rounded-full transition-all duration-1000"
        style={{ width: `${width}%` }}
      ></div>
    </div>
  );
};

// Komponen CardSatisfaction
const CardSatisfaction: React.FC = () => {
  return (
    <div className="flex flex-col items-center md:flex-row justify-between row-span-2 xl:row-span-3 col-span-1 md:col-span-2 xl:col-span-1 bg-white shadow-md rounded-2xl ">
      {/* Kolom Kiri: Nilai IKM */}
      <div className="md:w-1/3 w-full p-4 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-300">
        <ChartLine className="text-[#16927E] text-5xl mb-4" />
        <h2 className="text-4xl font-bold">85.5</h2>
        <p className="text-gray-700 text-center mt-2">
          Indeks Kepuasan Masyarakat (IKM)
        </p>
      </div>

      {/* Kolom Kanan: Progress Bar untuk 8 Parameter */}
      <div className="md:w-2/3 w-full p-4 space-y-4">
        {parameters.map((param, index) => (
          <div key={index} className="flex flex-col">
            <div className="flex justify-between mb-1">
              <span className="text-md font-medium text-gray-800">
                {param.name}
              </span>
              <span className="text-md font-medium text-[#16927E]">
                {param.value}%
              </span>
            </div>
            <ProgressBar value={param.value} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardSatisfaction;
