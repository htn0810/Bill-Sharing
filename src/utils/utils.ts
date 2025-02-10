export const formatVND = (value: string | number): string => {
  const number =
    typeof value === "string"
      ? parseFloat(value.replace(/[^0-9]/g, ""))
      : value;
  return isNaN(number)
    ? "0 ₫"
    : new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(number);
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return day;
};

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const time = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${time} - ${day}`;
};

export const formatBalance = (balance: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0, // Ensure no decimals
  }).format(Math.ceil(balance)); // Use Math.ceil to round up
};
