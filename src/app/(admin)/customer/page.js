"use client";
import React, { useEffect, useState } from "react";
import CustomerItem from "@/components/CustomerItem";
import { getUserByRoleId, getAllUsers, getAllUsersByRoleId } from "@/service/userService";
import { getAllOrders } from '@/service/orderService';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

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

  const handleExport = async (customers = []) => {
  if (!Array.isArray(customers) || customers.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "YourApp";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Customers", {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  // Columns (header + key + width)
  worksheet.columns = [
    { header: "Name", key: "name", width: 24 },
    { header: "Email", key: "email", width: 28 },
    { header: "PhoneNumber", key: "phonenumber", width: 16 },
    { header: "Address", key: "address", width: 32 },
    { header: "Orders", key: "orderCount", width: 10 },
    { header: "TotalAmount", key: "totalAmount", width: 16 },
    { header: "Status", key: "statusText", width: 12 },
    { header: "CreatedAt", key: "createdAt", width: 20 },
    { header: "UpdatedAt", key: "updatedAt", width: 20 },
  ];

  // Header style
  const headerRow = worksheet.getRow(1);
  headerRow.height = 20;
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F4E79" } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // Add rows
  customers.forEach((item) => {
    worksheet.addRow({
      name: item?.name ?? "",
      email: item?.email ?? "",
      phonenumber: item?.phonenumber ?? "",
      address: item?.address ?? "",
      orderCount: Number(item?.orderCount ?? 0),
      totalAmount: Number(item?.totalAmount ?? 0), // keep as number
      statusText: !item?.status ? "Active" : "Blocked",
      createdAt: item?.createdAt ? new Date(item.createdAt) : null,
      updatedAt: item?.updatedAt ? new Date(item.updatedAt) : null,
    });
  });

  // Format data rows
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
    });

    // Orders: center
    row.getCell("orderCount").alignment = { vertical: "middle", horizontal: "center" };

    // TotalAmount: VN currency format (number) + right align
    const amountCell = row.getCell("totalAmount");
    amountCell.numFmt = '#,##0" ₫"'; // Excel format, display like 1,234 ₫ (thousands sep depends on locale)
    amountCell.alignment = { vertical: "middle", horizontal: "right" };

    // Dates: date-time format
    const createdCell = row.getCell("createdAt");
    if (createdCell.value) createdCell.numFmt = "dd/mm/yyyy hh:mm:ss";

    const updatedCell = row.getCell("updatedAt");
    if (updatedCell.value) updatedCell.numFmt = "dd/mm/yyyy hh:mm:ss";

    // Status coloring (optional)
    const statusCell = row.getCell("statusText");
    statusCell.alignment = { vertical: "middle", horizontal: "center" };
    if (statusCell.value === "Blocked") {
      statusCell.font = { color: { argb: "FFC00000" }, bold: true };
    } else {
      statusCell.font = { color: { argb: "FF006100" }, bold: true };
    }
  });

  // Export
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `customers_${new Date().toISOString().slice(0, 10)}.xlsx`);
};
  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="font-inter">
      <div className="flex justify-between items-end">
                <div>
                    <h1 className='text-3xl font-bold'>Customer</h1>
                    <div id="roadmap" className="flex items-center mt-2">
                        <a className="text-[#ff8200]" href="/admin/dashboard">Dashboard</a>
                        <label className="ml-3 mr-3">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M6.59467 3.96967C6.30178 4.26256 6.30178 4.73744 6.59467 5.03033L10.5643 9L6.59467 12.9697C6.30178 13.2626 6.30178 13.7374 6.59467 14.0303C6.88756 14.3232 7.36244 14.3232 7.65533 14.0303L12.4205 9.26516C12.5669 9.11872 12.5669 8.88128 12.4205 8.73484L7.65533 3.96967C7.36244 3.67678 6.88756 3.67678 6.59467 3.96967Z" fill="#A3A9B6" />
                            </svg>
                        </label>
                        <a className="text-[#667085]" href="/admin/customer">Customer List</a>
                    </div>
                </div>

                <button className='bg-[#FBE3CA] text-[#ff8200] px-4 py-2 rounded-md flex gap-2 items-center'
                  onClick={() => handleExport(displayCustomers)}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.0891 6.00582C12.7637 6.33126 12.236 6.33126 11.9106 6.00582L10.8332 4.92841V12.9166C10.8332 13.3768 10.4601 13.7499 9.99984 13.7499C9.5396 13.7499 9.1665 13.3768 9.1665 12.9166V4.92841L8.08909 6.00582C7.76366 6.33126 7.23602 6.33126 6.91058 6.00582C6.58514 5.68039 6.58514 5.15275 6.91058 4.82731L9.70521 2.03268C9.86793 1.86997 10.1317 1.86996 10.2945 2.03268L13.0891 4.82731C13.4145 5.15275 13.4145 5.68039 13.0891 6.00582Z" fill="#FF8200" />
                        <path d="M14.9998 7.08323C16.8408 7.08323 18.3332 8.57562 18.3332 10.4166V14.5832C18.3332 16.4242 16.8408 17.9166 14.9998 17.9166H4.99984C3.15889 17.9166 1.6665 16.4242 1.6665 14.5832V10.4166C1.6665 8.57562 3.15889 7.08323 4.99984 7.08323H6.6665C7.12674 7.08323 7.49984 7.45633 7.49984 7.91657C7.49984 8.37681 7.12674 8.7499 6.6665 8.7499H4.99984C4.07936 8.7499 3.33317 9.49609 3.33317 10.4166V14.5832C3.33317 15.5037 4.07936 16.2499 4.99984 16.2499H14.9998C15.9203 16.2499 16.6665 15.5037 16.6665 14.5832V10.4166C16.6665 9.49609 15.9203 8.7499 14.9998 8.7499H13.3332C12.8729 8.7499 12.4998 8.37681 12.4998 7.91657C12.4998 7.45633 12.8729 7.08323 13.3332 7.08323H14.9998Z" fill="#FF8200" />
                    </svg>
                    Export</button>
            </div>
            <div className='mt-5 flex justify-between items-center'>
                <div className='flex gap-1 items-center bg-white rounded-md px-4 border border-[#E0E2E7]'>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M14.7844 16.1991C11.646 18.6416 7.10629 18.4205 4.22156 15.5358C1.09737 12.4116 1.09737 7.34625 4.22156 4.22205C7.34576 1.09786 12.4111 1.09786 15.5353 4.22205C18.42 7.10677 18.6411 11.6464 16.1986 14.7849L20.4851 19.0713C20.8756 19.4618 20.8756 20.095 20.4851 20.4855C20.0945 20.876 19.4614 20.876 19.0708 20.4855L14.7844 16.1991ZM5.63578 14.1215C7.97892 16.4647 11.7779 16.4647 14.1211 14.1215C16.4642 11.7784 16.4642 7.97941 14.1211 5.63627C11.7779 3.29312 7.97892 3.29312 5.63578 5.63627C3.29263 7.97941 3.29263 11.7784 5.63578 14.1215Z" fill="#667085" />
                    </svg>
                    <input id='searchInput' type='text' placeholder='Search customer...' className='px-2 py-2 outline-none' onChange={handleSearchChange} />
                </div>
                <button className='text-[#667085] border border-[#E0E2E7] bg-white rounded-md px-4 py-2 flex items-center gap-2' onClick={toggleFilter}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.8333 6.66667C10.8333 7.1269 11.2064 7.5 11.6667 7.5C12.1269 7.5 12.5 7.1269 12.5 6.66667V5.83333H16.6667C17.1269 5.83333 17.5 5.46024 17.5 5C17.5 4.53976 17.1269 4.16667 16.6667 4.16667H12.5V3.33333C12.5 2.8731 12.1269 2.5 11.6667 2.5C11.2064 2.5 10.8333 2.8731 10.8333 3.33333V6.66667Z" fill="#667085" />
                        <path d="M2.5 10C2.5 9.53976 2.8731 9.16667 3.33333 9.16667H4.58333C4.81345 9.16667 5 9.35321 5 9.58333V10.4167C5 10.6468 4.81345 10.8333 4.58333 10.8333H3.33333C2.8731 10.8333 2.5 10.4602 2.5 10Z" fill="#667085" />
                        <path d="M7.5 7.5C7.03976 7.5 6.66667 7.8731 6.66667 8.33333V11.6667C6.66667 12.1269 7.03976 12.5 7.5 12.5C7.96024 12.5 8.33333 12.1269 8.33333 11.6667V10.8333H16.6667C17.1269 10.8333 17.5 10.4602 17.5 10C17.5 9.53976 17.1269 9.16667 16.6667 9.16667H8.33333V8.33333C8.33333 7.8731 7.96024 7.5 7.5 7.5Z" fill="#667085" />
                        <path d="M2.5 5C2.5 4.53976 2.8731 4.16667 3.33333 4.16667H8.75C8.98012 4.16667 9.16667 4.35321 9.16667 4.58333V5.41667C9.16667 5.64679 8.98012 5.83333 8.75 5.83333H3.33333C2.8731 5.83333 2.5 5.46024 2.5 5Z" fill="#667085" />
                        <path d="M12.5 13.3333C12.5 12.8731 12.8731 12.5 13.3333 12.5C13.7936 12.5 14.1667 12.8731 14.1667 13.3333V14.1667H16.6667C17.1269 14.1667 17.5 14.5398 17.5 15C17.5 15.4602 17.1269 15.8333 16.6667 15.8333H14.1667V16.6667C14.1667 17.1269 13.7936 17.5 13.3333 17.5C12.8731 17.5 12.5 17.1269 12.5 16.6667V13.3333Z" fill="#667085" />
                        <path d="M2.5 15C2.5 14.5398 2.8731 14.1667 3.33333 14.1667H10.4167C10.6468 14.1667 10.8333 14.3532 10.8333 14.5833V15.4167C10.8333 15.6468 10.6468 15.8333 10.4167 15.8333H3.33333C2.8731 15.8333 2.5 15.4602 2.5 15Z" fill="#667085" />
                    </svg>
                    Filters
                </button>
            </div>
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
              <th className="py-2 px-4 text-center">Orders</th>
              <th className="py-2 px-4 text-center">Balance</th>
              <th className="py-2 px-4">Created</th>
            </tr>
          </thead>

          <tbody className="text-[#344054] font-normal">
            {displayCustomers.map((user) => (
              <CustomerItem key={user.id} user={user} />
            ))}
            {
              displayCustomers.length === 0 && (
                <tr className='bg-white shadow-md border-b border-[#F0F1F3]'>
                  <td colSpan="7" className='text-center py-4 text-gray-500'>No customers found</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
