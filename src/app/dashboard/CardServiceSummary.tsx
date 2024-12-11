// src/components/CardServiceSummary.tsx
import React from "react";
import { TrendingUp } from "lucide-react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useGetAgencyQueueCountQuery } from "@/state/dashboardSlice";

const CardServiceSummary = () => {
  const {
    data: serviceData,
    isLoading,
    isError,
  } = useGetAgencyQueueCountQuery();

  // Transformasi data untuk pie chart
  const transformedServiceData =
    serviceData?.data.map((item) => ({
      name: item.name,
      value: item.total,
    })) || [];

  // Hitung rata-rata
  const averageValue = serviceData
    ? Math.round(
        serviceData.data.reduce((sum, item) => sum + item.total, 0) /
          serviceData.data.length
      )
    : 0;

  // Hitung pertumbuhan (contoh statis, sebaiknya didapat dari API)
  const growthPercentage = 30;

  if (isError) {
    return (
      <div className="row-span-3 bg-white shadow-md rounded-2xl flex items-center justify-center">
        Gagal memuat data layanan
      </div>
    );
  }

  return (
    <div className="row-span-3 bg-white shadow-md rounded-2xl flex flex-col justify-between">
      {isLoading ? (
        <div className="m-5 flex items-center justify-center">
          Memuat data...
        </div>
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
                        style={{ stopColor: "#16927E", stopOpacity: 1 }}
                      />
                      <stop
                        offset="100%"
                        style={{ stopColor: "#F2D457", stopOpacity: 1 }}
                      />
                    </linearGradient>
                  </defs>
                  <Pie
                    data={transformedServiceData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="url(#gradientFill)"
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {transformedServiceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#gradientFill)`} />
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
                  Rata-rata:{" "}
                  <span className="font-semibold">{averageValue}</span>
                </p>
              </div>
              <span className="flex items-center mt-2">
                <TrendingUp className="mr-2 text-green-500" />
                {growthPercentage}%
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CardServiceSummary;
