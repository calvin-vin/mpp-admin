import { ChartLine, RefreshCcw } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../(components)/LoadingSpinner";
import { useAppSelector } from "../redux";
import useAgencies from "@/hooks/useAgencies";

// Komponen Progress Bar dengan Animasi
const ProgressBar = ({ value }: { value: number }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setTimeout(() => setWidth(value), 500);
  }, [value]);

  return (
    <div className="w-full bg-gray-200 rounded-full h-4">
      <div
        className="bg-gradient-to-r from-primary to-secondary h-4 rounded-full transition-all duration-1000"
        style={{ width: `${width}%` }}
      ></div>
    </div>
  );
};

// Komponen CardSatisfaction
const CardSatisfaction: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [parameters, setParameters] = useState<
    { name: string; value: number }[]
  >([]);
  const [averageIKM, setAverageIKM] = useState(0);
  const [predicate, setPredicate] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedAgency, setSelectedAgency] = useState("");

  const { agencyList } = useAgencies();
  const agencyMenuItems = useMemo(
    () =>
      agencyList.map((opt) => (
        <option key={opt.value} value={opt.value.toString()}>
          {opt.label}
        </option>
      )),
    [agencyList]
  );

  const fetchData = async (agencyId: string = "") => {
    try {
      const url = agencyId
        ? `https://skm.pangkalpinangkota.go.id/api/reports/tenant/${agencyId}`
        : "https://skm.pangkalpinangkota.go.id/api/reports/event/0dade69f-7260-4a83-a96a-1b72a7e25169";

      const response = await axios.get(url);
      if (response.data.status) {
        const data = response.data.data.map((item: any) => ({
          name: item.category,
          value: Math.round(item.average_answer * 25),
        }));

        setParameters(data);

        // Hitung rata-rata IKM
        const total = data.reduce((acc, param) => acc + param.value, 0);
        const average = total / data.length;

        if (average < 65) {
          setPredicate("D ~ Tidak Baik");
        } else if (average >= 65 && average <= 76.6) {
          setPredicate("C ~ Kurang Baik");
        } else if (average >= 76.61 && average <= 88.3) {
          setPredicate("B ~  Baik");
        } else {
          setPredicate("A ~ Sangat Baik");
        }

        setAverageIKM(average); // Simpan rata-rata IKM
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(user?.id_instansi);
    if (user?.id_instansi) {
      fetchData(user?.id_instansi);
    } else {
      fetchData(selectedAgency);
    }
  }, [selectedAgency]);

  const handleAgencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const agencyId = e.target.value;
    setSelectedAgency(agencyId);
  };

  const resetFilters = () => {
    setSelectedAgency("");
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const predicateClass =
    averageIKM < 65
      ? "text-red-500 bg-red-100" // Danger
      : averageIKM <= 76.6
      ? "text-yellow-500 bg-yellow-100" // Warning
      : averageIKM <= 88.3
      ? "text-blue-500 bg-blue-100" // Info
      : "text-green-500 bg-green-100"; // Success

  return (
    <div className="flex flex-col justify-between row-span-2 xl:row-span-3 col-span-1 md:col-span-2 xl:col-span-1 bg-white shadow-md rounded-2xl">
      {/* Filter Dropdown */}
      <div className="px-7 pt-5 flex flex-col md:flex-row justify-between items-center">
        <h2 className="text-lg font-semibold mb-4 md:mb-0">
          Indeks Kepuasan Masyarakat
        </h2>
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
          {/* Filter Instansi */}
          {user?.nama_role != "OPERATOR" && (
            <div className="select-container">
              <select
                id="agency-select"
                className="px-2 py-1 border rounded"
                value={selectedAgency}
                onChange={handleAgencyChange}
              >
                <option value="">Semua Instansi</option>
                {agencyMenuItems}
              </select>
            </div>
          )}

          {/* Tombol Reset Filter */}
          {user?.nama_role != "OPERATOR" && (
            <>
              <button
                onClick={resetFilters}
                className="flex items-center px-2 py-1 text-gray-700 hover:bg-gray-200"
              >
                <RefreshCcw />
              </button>
            </>
          )}
        </div>
      </div>

      <hr className="mt-2" />

      {/* Body */}
      <div className="flex flex-col items-center md:flex-row justify-between row-span-2 xl:row-span-3 col-span-1 md:col-span-2 xl:col-span-1 bg-white shadow-md rounded-2xl ">
        {/* Kolom Kiri: Nilai IKM */}
        <div className="md:w-1/3 w-full p-4 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-300">
          <ChartLine className="text-primary mb-4" />
          <h2 className="text-8xl font-bold">{averageIKM.toFixed(2)}</h2>
          <p
            className={`text-xl text-center mt-2 ${predicateClass} p-2 rounded`}
          >
            {predicate}
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
                <span className="text-md font-medium text-primary">
                  {param.value}
                </span>
              </div>
              <ProgressBar value={param.value} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardSatisfaction;
