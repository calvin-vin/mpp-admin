"use client";

import CardSatisfaction from "./CardSatisfaction";
import CardServiceSummary from "./CardServiceSummary";
import CardTotalService from "./CardTotalService";
import CardVisitorSummary from "./CardVisitorSummary";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto gap-10 pb-4 custom-grid-rows">
      <CardVisitorSummary />
      <CardSatisfaction />
      <CardServiceSummary />
      <CardTotalService totalServices={12} />
      <CardTotalService totalServices={12} />
      <CardTotalService totalServices={12} />
    </div>
  );
};

export default Dashboard;
