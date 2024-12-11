import { useState } from "react";
import toast from "react-hot-toast";

interface ErrorDisplayProps {
  callback: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ callback }) => {
  const [loading, setLoading] = useState(false);

  const handleCallback = async () => {
    setLoading(true);
    try {
      await callback();
    } catch (error) {
      toast.error("Terjadi Kesalahan");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center text-red-500 py-4">
        <p className="text-lg font-semibold mb-4">Terjadi kesalahan</p>
        <button
          onClick={handleCallback}
          className={`
            mt-4 
            px-4 
            py-2 
            rounded 
            transition-all 
            duration-300 
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed opacity-50"
                : "bg-primary hover:bg-primary-dark text-white"
            }
          `}
          disabled={loading}
        >
          {loading ? "Memproses..." : "Coba Lagi"}
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;
