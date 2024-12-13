// hooks/useMenuOptions.ts
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { API_HOST } from "@/utils/constants";
import toast from "react-hot-toast";

export const useMenus = () => {
  // State untuk menyimpan data menu mentah
  const [menuData, setMenuData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch menu data
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_HOST}/menu/list`, {
          headers: {
            Accept: "application/json",
            "X-Key": "999999999",
            Token:
              "bWkDHQLFtWlGy77KeS0qqq7i6pwdhpCgGhHtrggARhIS6aNyfyviLwkUTsR1v7Jo",
          },
        });

        setMenuData(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching menu data:", err);
        setError("Gagal mengambil data menu");
        toast.error("Gagal memuat data menu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  // Memoize menu options untuk performa
  const menuOptions = useMemo(() => {
    // Mengelompokkan menu berdasarkan parent
    const groupedMenu = menuData.reduce((acc, menu) => {
      const parentKey = menu.parent || "Lainnya";
      if (!acc[parentKey]) {
        acc[parentKey] = [];
      }
      acc[parentKey].push({
        value: menu.id,
        label: `${menu.nama_menu} (${parentKey})`,
      });
      return acc;
    }, {} as Record<string, any[]>);

    // Transformasi ke format yang bisa digunakan react-select
    return Object.entries(groupedMenu).map(([parent, options]) => ({
      label: parent,
      options: options,
    }));
  }, [menuData]);

  // Fungsi untuk mendapatkan label menu berdasarkan value
  const getMenuLabelByValue = (value: string): string => {
    const flattenedOptions = menuOptions.flatMap((group: any) => group.options);
    const menu = flattenedOptions.find((option: any) => option.value === value);
    return menu ? menu.label : "";
  };

  return {
    menuOptions,
    menuData,
    isLoading,
    error,
    getMenuLabelByValue,
  };
};
