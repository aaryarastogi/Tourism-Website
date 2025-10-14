import { useEffect, useState } from "react";
import axios from "axios";
import backend_url from "../../config";

const useUser = () => {
  const [email, setEmail] = useState('');
  const [logined, setLogined] = useState(false);
  
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      axios
        .get(`${backend_url}/user`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then(response => {
          if (response.data.success) {
            setEmail(response.data.user.email);
            setLogined(true);
          }
        })
        .catch(() => setLogined(false));
    }
  }, []);

  return { email, logined };
};

export default useUser;