// src/components/CardServiceSummary.tsx

import { TrendingUp } from "lucide-react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const CardServiceSummary = () => {
  const isLoading = false;
  const serviceData = [
    { name: "Kategori A", value: 400 },
    { name: "Kategori B", value: 300 },
    { name: "Kategori C", value: 300 },
    { name: "Kategori D", value: 200 },
    { name: "Kategori E", value: 200 },
    { name: "Kategori F", value: 200 },
    { name: "Kategori G", value: 200 },
    { name: "Kategori H", value: 200 },
    { name: "Kategori I", value: 200 },
    { name: "Kategori J", value: 200 },
    { name: "Kategori K", value: 200 },
    { name: "Kategori L", value: 200 },
    { name: "Kategori M", value: 200 },
  ];

  return (
    <div className="row-span-3 bg-white shadow-md rounded-2xl flex flex-col justify-between">
      {isLoading ? (
        <div className="m-5">Loading...</div>
      ) : (
        <>
          {/* HEADER */}
          <div>
            <h2 className="text-lg font-semibold mb-2 px-7 pt-5">
              Layanan Instansi
            </h2>
            <hr />
          </div>
          {/* BODY */}
          <div className="xl:flex justify-center px-2">
            {/* CHART */}
            <div className="relative basis-3/5">
              <ResponsiveContainer width="100%" height={500}>
                <PieChart>
                  <defs>
                    <linearGradient
                      id="gradientFill"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop
                        offset="0%"
                        style={{ stopColor: "#3B82F6", stopOpacity: 1 }}
                      />
                      <stop
                        offset="100%"
                        style={{ stopColor: "#6366F1", stopOpacity: 1 }}
                      />
                    </linearGradient>
                  </defs>
                  <Pie
                    data={serviceData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="url(#gradientFill)" // Menggunakan gradien yang didefinisikan
                    label
                  >
                    {serviceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`url(#gradientFill)`} // Menggunakan gradien
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={120} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* FOOTER */}
          <div>
            <hr />
            <div className="mt-3 flex justify-between items-center px-7 mb-4">
              <div className="pt-2">
                <p className="text-sm">
                  Rata-rata: <span className="font-semibold">120</span>
                </p>
              </div>
              <span className="flex items-center mt-2">
                <TrendingUp className="mr-2 text-green-500" />
                30%
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CardServiceSummary;
