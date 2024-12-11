import React from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";

const ModalDelete = ({
  show,
  handleClose,
  handleConfirm,
  isLoading,
}: {
  show: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
  isLoading: boolean;
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-96 max-w-[90%] relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Content */}
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-10 h-10 text-red-500 mr-3" />
          <h2 className="text-lg font-semibold text-gray-800">
            Konfirmasi Hapus
          </h2>
        </div>

        <p className="text-gray-600 mb-6">
          Apakah anda yakin ingin menghapus data ini? Tindakan ini tidak dapat
          dibatalkan.
        </p>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            className="bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded 
            hover:bg-gray-200 transition-colors flex items-center"
            onClick={handleClose}
            disabled={isLoading}
          >
            Batal
          </button>

          <button
            className="bg-red-600 text-white font-semibold py-2 px-4 rounded 
            hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed 
            disabled:opacity-50 transition-all duration-300 flex items-center"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Menghapus...
              </div>
            ) : (
              <div className="flex items-center">
                <Trash2 className="w-5 h-5 mr-2" />
                Hapus
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDelete;
