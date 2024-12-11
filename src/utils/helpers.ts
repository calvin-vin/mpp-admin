export const getHeaders = (): { "X-Key"?: string; Token?: string } => {
  const dataString = localStorage.getItem("store");

  if (!dataString) {
    return {}; // Kembalikan objek kosong jika tidak ada data
  }

  try {
    const data = JSON.parse(dataString);

    return {
      ...(data?.nip && { "X-Key": data.nip }),
      ...(data?.token && { Token: data.token }),
    };
  } catch (error) {
    console.error("Error parsing store data:", error);
    return {};
  }
};

export const formattedDate = (date: Date) => {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};

export const formattedTime = (date: Date) => {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};
