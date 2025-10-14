import { useEffect, useState } from "react";
import axios from "axios";
import backend_url from "../../config"

const useAirports = () => {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const res = await axios.get(`${backend_url}/api/airports`);
        setAirports(res.data.data || []);
      } catch (e) {
        setAirports([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAirports();
  }, []);

  return { airports, loading };
};

export default useAirports;