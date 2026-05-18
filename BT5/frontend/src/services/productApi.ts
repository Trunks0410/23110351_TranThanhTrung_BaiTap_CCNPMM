import axiosInstance from "@/lib/axiosInstance";

export const getProducts = async (params: any) => {
  const response = await axiosInstance.get("/api/products/all", { params });
  return response.data;
};

export const getProductDetail = async (slug: string) => {
  const response = await axiosInstance.get(`/api/products/detail/${slug}`);
  return response.data;
};
