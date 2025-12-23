"use client";
import React, { useEffect, useState } from "react";
import CustomerItem from "@/components/CustomerItem";
import { getUserByRoleId, getAllUsers, getAllUsersByRoleId } from "@/service/userService";

export default function CustomerPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [users, setUsers] = useState([]);
  const [displayCustomers, setDisplayCustomers] = useState([]);

  const handleSearchChange = () => {
    const searchInput = document.getElementById("searchInput");
    const searchTerm = (searchInput?.value || "").toLowerCase();

    const filteredCustomers = users.filter((customer) => {
      return (
        (customer.name || "").toLowerCase().includes(searchTerm) ||
        (customer.email || "").toLowerCase().includes(searchTerm) ||
        (customer.phonenumber || "").toLowerCase().includes(searchTerm)
      );
    });

    setDisplayCustomers(filteredCustomers);
  };

const fetchCustomers = async () => {
  try {
    const users = await getAllUsersByRoleId(1);

    const safeUsers = Array.isArray(users) ? users : [];
    setUsers(safeUsers);
    setDisplayCustomers(safeUsers);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    setUsers([]);
    setDisplayCustomers([]);
  }
};

  const toggleFilter = () => setShowFilters(!showFilters);

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="font-inter">
      {/* ... giữ nguyên UI header/search/filter của bạn ... */}

      {showFilters && (
        <div className="absolute right-10 mt-2 bg-white p-6 rounded-md shadow-lg min-w-[350px] z-50 ">
          <h2 className="text-xl font-bold mb-4">Filter Customers</h2>

          <div className="mb-4">
            <label className="block mb-2">Status</label>
            <select className="w-full border rounded p-2">
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                const status = document.querySelector("select")?.value;

                const filteredCustomers = users.filter((customer) => {
                  if (status === "active") return !!customer.status;
                  if (status === "blocked") return !customer.status;
                  return true;
                });

                setDisplayCustomers(filteredCustomers);
                setShowFilters(false);
              }}
              className="px-4 py-2 bg-[#ff8200] text-white rounded"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      <div className="shadow-md rounded-md border border-[#E0E2E7] mt-5">
        <table className="w-full py-2 rounded-md overflow-hidden ">
          <thead className="bg-[#F9F9FC] font-medium border-b border-[#F0F1F3]">
            <tr className="text-left text-[#344054] font-semibold rounded-md">
              <th className="py-2 px-4">Customer</th>
              <th className="py-2 px-4">Phone</th>
              <th className="py-2 px-4">Address</th>
              <th className="py-2 px-4">Orders</th>
              <th className="py-2 px-4">Balance</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Created</th>
            </tr>
          </thead>

          <tbody className="text-[#344054] font-normal">
            {displayCustomers.map((user) => (
              <CustomerItem key={user.roleid} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
