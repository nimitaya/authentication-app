import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  // das erlaubt, dass wir die Values aus dem Formular mit dem POST request schicken - in anderen Seiten werden wir das verbieten
  axios.defaults.withCredentials = true;
  // holen URL aus .env
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false); // Eigentlich Objekt aber nutzen als leeres einfach false

  // Prüfen, ob wir ein Token haben und UserData haben, Loggen ein, wenn Token vorhanden
  const getAuthState = async () => {
    try {
      const {data} = await axios.get(`${backendUrl}/api/auth/authentication`)
      if(data.success) {
        setIsLoggedIn(true)
        getUserData()
      }
    } catch (error) {
      // toast.error(error.message)
    }
  }

  // Fetch User Data
  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`);
      console.log(data);
      if (data.success) {
        setUserData(data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Aktivieren das einmal am Start
  useEffect(()=>{getAuthState()}, [])

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };
  // Verteilen diese Variablen über alle Kinder Componenten
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
