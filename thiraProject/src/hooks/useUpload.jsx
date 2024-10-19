import { useCallback } from "react";

export const useUpload = () => {
  const upload = useCallback(async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("http://20.255.57.43:6969/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await response.json();
      return { data, status: response.status };
    } catch (e) {}
  }, []);

  return {
    upload,
  };
};
