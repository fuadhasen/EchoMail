import { useLocation } from "react-router";

const useUrlQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export default useUrlQuery;
