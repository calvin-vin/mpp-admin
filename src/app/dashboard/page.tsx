"use client";

import { Building2, LayoutList, Newspaper } from "lucide-react";
import CardSatisfaction from "./CardSatisfaction";
import CardServiceSummary from "./CardServiceSummary";
import CardTotalService from "./CardTotalService";
import CardVisitorSummary from "./CardVisitorSummary";
import { useGetDashboardSummaryQuery } from "@/state/dashboardSlice";
import { AuthorizationWrapper } from "../(components)/AuthorizationWrapper";

const Dashboard = () => {
  return (
    <AuthorizationWrapper>
      <div className="flex items-center justify-center">
        Fitur Dalam Tahap Pengembangan
      </div>
    </AuthorizationWrapper>
  );

  const {
    data: dashboardData,
    isLoading,
    isError,
  } = useGetDashboardSummaryQuery();

  // Handle loading dan error state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Memuat dashboard...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Gagal memuat dashboard
      </div>
    );
  }

  // Destructure data dari response
  const {
    total_agencies = 0,
    total_services = 0,
    total_queues = 0,
  } = dashboardData?.data || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto gap-10 pb-4 custom-grid-rows">
      <CardVisitorSummary />
      <CardSatisfaction />
      <CardServiceSummary />

      <CardTotalService
        logo={<Building2 className="text-white text-5xl mb-4" />}
        title={"Total Instansi"}
        subTitle={"Jumlah Instansi pada MPP Pangkalpinang"}
        total={total_agencies}
      />

      <CardTotalService
        logo={<LayoutList className="text-white text-5xl mb-4" />}
        title={"Total Layanan"}
        subTitle={"Jumlah layanan yang tersedia"}
        total={total_services}
      />

      <CardTotalService
        logo={<Newspaper className="text-white text-5xl mb-4" />}
        title={"Total Antrian"}
        subTitle={"Jumlah antrian yang telah ditangani"}
        total={total_queues}
      />
    </div>
  );
};

export default Dashboard;
