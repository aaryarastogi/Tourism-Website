import { useEffect, useState } from "react";
import axios from "axios";
import backend_url from "../../config"

const useStations = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllStations = async () => {
      try {
        const res = await axios.get(`${backend_url}/api/stations`);
        setStations(res.data.data || []);
      } catch (e) {
        setStations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllStations();
  }, []);

  return { stations, loading };
};

export default useStations;