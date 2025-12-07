"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import { useCreateKennel, userForm, KennelForm } from "../hawk-tuah/access";
import { toast } from "sonner";

export default function Create_user() {
  const { fetchKennels, postUser, loading } = useCreateKennel();

  const [companies, setCompanies] = useState<KennelForm[]>([]);
  const [form, setForm] = useState<userForm>({
    name: "",
    email: "",
    address: "",
    contact: "",
    kennelId: "",
    password: "",
  });

  // Handle input changes for both inputs and select
  const onInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleCreate = async () => {
    if (!form.kennelId) {
      toast.error("Please select a company!");
      return;
    }
    try {
      const res = await postUser(form);
      if (res.status === "SUCCESS" ) {
        toast.success("User created successfully");
        setForm({
          name: "",
          email: "",
          address: "",
          contact: "",
          kennelId: "",
          password: "",
        });
      } else {
        toast.error(res.message || "Failed to create user");
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong!");
    }
  };

  // Fetch kennels on mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetchKennels();
        if (res.status === "SUCCESS" && res.data) {
          setCompanies(res.data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchCompanies();
  }, [fetchKennels]);

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold">Create User</h2>

      <label className="block font-semibold">Select Company</label>
      <select
        name="kennelId"
        value={form.kennelId}
        onChange={onInputChange}
        className="border p-2 w-full"
      >
        <option value="">Select Company</option>
        {companies.map((val) => (
          <option key={val.id} value={val.id}>
            {val.name}
          </option>
        ))}
      </select>

      <input
        name="name"
        value={form.name}
        onChange={onInputChange}
        placeholder="User Name"
        className="border p-2 w-full"
      />
      <input
        name="email"
        value={form.email}
        onChange={onInputChange}
        placeholder="Email"
        className="border p-2 w-full"
      />
      <input
        name="address"
        value={form.address}
        onChange={onInputChange}
        placeholder="Address"
        className="border p-2 w-full"
      />
      <input
        name="contact"
        value={form.contact}
        onChange={onInputChange}
        placeholder="Contact"
        className="border p-2 w-full"
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={onInputChange}
        placeholder="Password"
        className="border p-2 w-full"
      />

      <button
        disabled={loading}
        onClick={handleCreate}
        className="bg-blue-600 text-white p-2 rounded w-full"
      >
        {loading ? "Creating..." : "Create User"}
      </button>
    </div>
  );
}
