"use client";

import React, { ChangeEvent, useState } from "react";
import { toast } from "sonner";
import { useCreateKennel } from "../hawk-tuah/access";

export default function CreateCompany() {
  const [form, setForm] = useState({
    name: "",
    location: "",
    date: "",
    cp: "",
    password: "",
  });

  const { createKennel, loading } = useCreateKennel();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const res = await createKennel(form);
    if (res.status === "SUCCESS") {
      toast.success("Kennel created successfully!");
      setForm({ name: "", location: "", date: "", cp: "", password: "" });
    } else {
      toast.error(res.message || "Failed to create kennel");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Kennel</h2>
      <div className="flex flex-col gap-4">
        <input
          name="name"
          value={form.name}
          onChange={handleInputChange}
          placeholder="Kennel Name"
          className="border p-2 rounded"
        />
        <input
          name="location"
          value={form.location}
          onChange={handleInputChange}
          placeholder="Location"
          className="border p-2 rounded"
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <input
          name="cp"
          value={form.cp}
          onChange={handleInputChange}
          placeholder="Company Prefix (CP)"
          className="border p-2 rounded"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleInputChange}
          placeholder="Password"
          className="border p-2 rounded"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`mt-2 p-2 rounded text-white ${
            loading ? "bg-gray-500" : "bg-green-600"
          }`}
        >
          {loading ? "Creating..." : "Create Kennel"}
        </button>
      </div>
    </div>
  );
}
