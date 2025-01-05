import React from "react";
import { TrendingUp } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useGetAgencyQueueCountQuery } from "@/state/dashboardSlice";
import ErrorDisplay from "../(components)/ErrorDisplay";
import LoadingSpinner from "../(components)/LoadingSpinner";

const MAX_NAME_LENGTH = 10; // Maximum length for the name before truncating

const truncateName = (name: string) => {
  return name.length > MAX_NAME_LENGTH
    ? `${name.slice(0, MAX_NAME_LENGTH)}...`
    : name;
};

const CardServiceSummary = () => {
  const {
    data: serviceData,
    isLoading,
    isError,
    refetch,
  } = useGetAgencyQueueCountQuery();

  // Transformasi data untuk pie chart
  const transformedServiceData =
    serviceData?.data
      .filter((item) => item.total > 0)
      .map((item) => ({
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <ErrorDisplay
        callback={() => {
          refetch();
        }}
      />
    );
  }

  return (
    <div className="row-span-3 bg-white shadow-md rounded-2xl flex flex-col justify-between">
      {/* HEADER */}
      <div>
        <h2 className="text-lg font-semibold mb-2 px-7 pt-5">
          Jumlah Antrian Instansi
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
                  `${truncateName(name)} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {transformedServiceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#gradientFill)`} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white border border-gray-300 p-2 rounded">
                        <p>{payload[0].name}</p>
                        <p>{`Total: ${payload[0].value}`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
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
              Rata-rata: <span className="font-semibold">{averageValue}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardServiceSummary;
