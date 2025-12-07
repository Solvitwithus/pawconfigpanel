"use client";

import { useState } from "react";
import axios from "axios";

export interface KennelForm {
    id?:string;
  name: string;
  location: string;
  date: string;
  cp: string;
  password: string;
}

interface ApiResponse<T> {
  status: string;
  message?: string;
  data?: T;
}

export interface userForm{
    name:string;
    email:string;
    address :string;
    contact:string;
    kennelId:string;
password:string;
}

export function useCreateKennel() {
  const [loading, setLoading] = useState(false);

  const createKennel = async (form: KennelForm): Promise<ApiResponse<null>> => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("location", form.location);
      formData.append("date", form.date);
      formData.append("cp", form.cp);
      formData.append("password", form.password);

      const response = await axios.post<ApiResponse<null>>(
        "/api/company_creation",
        formData
      );

      return response.data;
    } catch (e: unknown) {
      console.error("Error creating kennel:", e);
      return { status: "ERROR", message: "Failed to create kennel" };
    } finally {
      setLoading(false);
    }
  };

  const fetchKennels = async (): Promise<ApiResponse<KennelForm[]>> => {
    try {
      const response = await axios.get<ApiResponse<KennelForm[]>>(
        "/api/company_creation"
      );
      return response.data;
    } catch (e: unknown) {
      console.error("Error fetching kennels:", e);
      return { status: "ERROR", message: "Failed to fetch kennels" };
    }
  };


  const postUser = async (form:userForm)=>{
      setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("address", form.address);
      formData.append("contact", form.contact);
      formData.append("kennelId", form.kennelId);
      formData.append("password", form.password);

      const response = await axios.post<ApiResponse<null>>(
        "/api/users",
        formData
      );

      return response.data;
    } catch (e: unknown) {
      console.error("Error creating user:", e);
      return { status: "ERROR", message: "Failed to create user" };
    } finally {
      setLoading(false);
    }
  }

  return { createKennel, fetchKennels,postUser, loading };
}
