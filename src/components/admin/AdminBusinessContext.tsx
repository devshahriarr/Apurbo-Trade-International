"use client";

import { createContext, useContext } from "react";
export const AdminBusinessContext = createContext({ id: "", name: "your business" });
export const useAdminBusiness = () => useContext(AdminBusinessContext);
