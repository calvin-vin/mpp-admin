import {
  AlertCircleIcon,
  CircleCheckIcon,
  ClockIcon,
  UserCheckIcon,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Popover from "../(components)/Popover";
import {
  useUpdateQueueStatusToFinishMutation,
  useUpdateQueueStatusToPresentMutation,
} from "@/state/queueSlice";

const ChangeStatus = ({ params }) => {
  const [status, setStatus] = useState(params.row.status?.toUpperCase());
  const [updateQueueStatusToPresent] = useUpdateQueueStatusToPresentMutation();
  const [updateQueueStatusToFinish] = useUpdateQueueStatusToFinishMutation();

  const statusConfig = {
    BOOKED: {
      color: "bg-blue-600",
      icon: <ClockIcon size={18} />,
      label: "Booked",
    },
    PRESENT: {
      color: "bg-yellow-600",
      icon: <UserCheckIcon size={18} />,
      label: "Proses",
    },
    FINISH: {
      color: "bg-green-600",
      icon: <CircleCheckIcon size={18} />,
      label: "Selesai",
    },
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      if (newStatus === "BOOKED") {
        toast.error("Tidak dapat mengubah status menjadi Booked");
      } else if (params.row.status === "FINISH") {
        toast.error("Tidak dapat mengubah status antrian yang sudah selesai");
      } else {
        switch (newStatus) {
          case "PRESENT":
            const res = await updateQueueStatusToPresent({
              id_antrian: params.row.id,
            }).unwrap();

          case "FINISH":
            await updateQueueStatusToFinish({
              id_antrian: params.row.id,
            }).unwrap();
        }
        toast.success("Berhasil mengubah status");
        setStatus(newStatus);
      }
    } catch (error) {
      toast.error("Gagal memperbarui status");
      console.error(error);
    }
  };

  const currentStatus = statusConfig[status as keyof typeof statusConfig] || {
    color: "bg-gray-500",
    icon: <AlertCircleIcon size={18} />,
    label: "Status Tidak Dikenal",
  };

  const popoverContent = (
    <div className="p-2 space-y-1">
      {Object.entries(statusConfig).map(([key, config]) => (
        <div
          key={key}
          onClick={() => {
            handleStatusChange(key);
            // setIsOpen(false); // Tutup popover setelah memilih
          }}
          className={`
              flex items-center 
              p-2 
              rounded-md 
              cursor-pointer 
              hover:bg-gray-100 
              ${status === key ? "bg-gray-200" : ""}
            `}
        >
          {config.icon}
          <span className="ml-2">{config.label}</span>
        </div>
      ))}
    </div>
  );

  return (
    <Popover content={popoverContent}>
      <span
        className={`
            inline-flex items-center 
            px-4 py-1.5 
            text-sm font-medium 
            text-center text-white 
            rounded-full 
            ${currentStatus.color} 
            my-2 
            gap-2 
            cursor-pointer 
            hover:opacity-80
          `}
      >
        {currentStatus.icon}
        <p>{currentStatus.label}</p>
      </span>
    </Popover>
  );
};

export default ChangeStatus;
