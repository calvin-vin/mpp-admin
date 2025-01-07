"use client";

import { useGetDashboardSummaryQuery } from "@/state/dashboardSlice";
import { Building2, LayoutList, Newspaper } from "lucide-react";
import { AuthorizationWrapper } from "../(components)/AuthorizationWrapper";
import ErrorDisplay from "../(components)/ErrorDisplay";
import LoadingSpinner from "../(components)/LoadingSpinner";
import CardSatisfaction from "./CardSatisfaction";
import CardServiceSummary from "./CardServiceSummary";
import CardTotalService from "./CardTotalService";
import CardVisitorSummary from "./CardVisitorSummary";

const Dashboard = () => {
  const {
    data: dashboardData,
    isLoading: isLoadingTotalCount,
    isError: isErrorTotalCount,
    refetch: refetchTotalCount,
  } = useGetDashboardSummaryQuery();

  if (isLoadingTotalCount) {
    return <LoadingSpinner />;
  }

  if (isErrorTotalCount) {
    return (
      <ErrorDisplay
        callback={() => {
          refetchTotalCount();
        }}
      />
    );
  }

  const {
    total_agencies = 0,
    total_services = 0,
    total_queues = 0,
  } = dashboardData?.data || {};

  return (
    <AuthorizationWrapper>
      <div className="grid grid-cols-1 gap-10 pb-4 custom-grid-rows">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        <CardVisitorSummary />
        <CardSatisfaction />
        <CardServiceSummary />
      </div>
    </AuthorizationWrapper>
  );
};

export default Dashboard;
