import useSWR from "swr";
import { fetcher } from "../config/axiosConfig";

const getDataFromApi = async(api) => {
  // console.log(api)

  const { data, error, isLoading, mutate } = useSWR(api, fetcher);
  console.log(data)
  return { data, error, isLoading, mutate };
};

export default getDataFromApi;
