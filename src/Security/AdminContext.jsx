import React, { createContext, useContext, useState } from "react";

const adminContext = createContext();

export const AdminContext = ({children}) => {
  const [isAdmin, setIsAdmin] = useState(true);
  const adminID = "admin@ccc.com";

  return (
    <adminContext.Provider value={{ isAdmin, setIsAdmin, adminID }}>
      {children}
    </adminContext.Provider>
  )
};

export const useAdminContext = () => useContext(adminContext);