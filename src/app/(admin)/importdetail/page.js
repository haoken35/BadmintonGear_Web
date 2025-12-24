"use client"
import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react'
import ImportDetailItem from '@/components/ImportDetailItem';
import { getImportById } from '@/service/importService';
import { getDetailByImportId } from '@/service/importDetailService';
import { getUserById } from '@/service/userService';
import * as XLSX from 'xlsx';

export default function ImportDetailsPage() {
    const searchParams = useSearchParams();
    const importID = searchParams.get('id');
    const [grn, setGrn] = useState([]);
    const [details, setDetails] = useState([]);
    // const vatAmount = (subtotal * order.vat / 100).toFixed(2);
    const [grandTotal, setGrandTotal] = useState(0);
    const [user, setUser] = useState({});

    const handleExport = () => {
        const data = details.map(item => ({
            ID: item.id,
            ProductName: item.Product.name,
            Quantity: item.quantity,
            Price: Number(item.price).toLocaleString('vi-VN'),
            Subtotal: Number(item.price * item.quantity).toLocaleString('vi-VN'),
            CreatedAt: new Date(item.createdAt).toLocaleString('vi-VN'),
            UpdatedAt: new Date(item.updatedAt).toLocaleString('vi-VN'),
        }));
        data.push({
            ID: '',
            ProductName: 'Grand Total:',
            Quantity: '',
            Price: '',
            Subtotal: Number(grandTotal).toLocaleString('vi-VN') + ' VND',
            CreatedAt: '',
            UpdatedAt: '',
        });

        const worksheet = XLSX.utils.json_to_sheet(data);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Import Detail');

        XLSX.writeFile(workbook, `Import_${grn.id}.xlsx`);
    }

    useEffect(() => {
  const fetchDetails = async () => {
    try {
      const response = await getDetailByImportId(importID);

      // Nếu service trả về { data: [...] } hoặc { result: [...] } thì lấy đúng mảng
      const list =
        Array.isArray(response) ? response :
        Array.isArray(response?.data) ? response.data :
        Array.isArray(response?.result) ? response.result :
        [];

      setDetails(list);
    } catch (error) {
      console.error("Error fetching import details:", error);
      setDetails([]); // fallback an toàn
    }
  };

  const fetchImport = async () => {
    try {
      const response = await getImportById(importID);
      setGrn(response);

      const userResponse = await getUserById(response.userid);
      setUser(userResponse);

      setGrandTotal(response.totalprice);
    } catch (error) {
      console.error("Error fetching import:", error);
    }
  };

  if (importID) {
    fetchImport();
    fetchDetails();
  }
}, [importID]);
    return (
        <div className='px-2 py-5'>
            <div className='flex justify-between items-end'>
                <div>
                    <h1 className='text-3xl font-bold'>Import Detail</h1>
                    <div id="roadmap" className="flex items-center mt-2">
                        <a className="text-[#ff8200]" href="/dashboard">Dashboard</a>
                        <label className="ml-3 mr-3">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M6.59467 3.96967C6.30178 4.26256 6.30178 4.73744 6.59467 5.03033L10.5643 9L6.59467 12.9697C6.30178 13.2626 6.30178 13.7374 6.59467 14.0303C6.88756 14.3232 7.36244 14.3232 7.65533 14.0303L12.4205 9.26516C12.5669 9.11872 12.5669 8.88128 12.4205 8.73484L7.65533 3.96967C7.36244 3.67678 6.88756 3.67678 6.59467 3.96967Z" fill="#A3A9B6" />
                            </svg>
                        </label>
                        <a className="text-[#ff8200]" href="/import">Import List</a>
                        <label className="ml-3 mr-3">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M6.59467 3.96967C6.30178 4.26256 6.30178 4.73744 6.59467 5.03033L10.5643 9L6.59467 12.9697C6.30178 13.2626 6.30178 13.7374 6.59467 14.0303C6.88756 14.3232 7.36244 14.3232 7.65533 14.0303L12.4205 9.26516C12.5669 9.11872 12.5669 8.88128 12.4205 8.73484L7.65533 3.96967C7.36244 3.67678 6.88756 3.67678 6.59467 3.96967Z" fill="#A3A9B6" />
                            </svg>
                        </label>
                        <a className="text-[#667085]" href={`/importdetail?id=${grn.id}`}>Import Detail #{grn.id}</a>
                    </div>
                </div>
                <div className='flex gap-2'>
                    <button className='bg-[#FBE3CA] text-[#ff8200] px-4 py-2 rounded-md flex gap-2 items-center' onClick={handleExport}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.0891 6.00582C12.7637 6.33126 12.236 6.33126 11.9106 6.00582L10.8332 4.92841V12.9166C10.8332 13.3768 10.4601 13.7499 9.99984 13.7499C9.5396 13.7499 9.1665 13.3768 9.1665 12.9166V4.92841L8.08909 6.00582C7.76366 6.33126 7.23602 6.33126 6.91058 6.00582C6.58514 5.68039 6.58514 5.15275 6.91058 4.82731L9.70521 2.03268C9.86793 1.86997 10.1317 1.86996 10.2945 2.03268L13.0891 4.82731C13.4145 5.15275 13.4145 5.68039 13.0891 6.00582Z" fill="#FF8200" />
                            <path d="M14.9998 7.08323C16.8408 7.08323 18.3332 8.57562 18.3332 10.4166V14.5832C18.3332 16.4242 16.8408 17.9166 14.9998 17.9166H4.99984C3.15889 17.9166 1.6665 16.4242 1.6665 14.5832V10.4166C1.6665 8.57562 3.15889 7.08323 4.99984 7.08323H6.6665C7.12674 7.08323 7.49984 7.45633 7.49984 7.91657C7.49984 8.37681 7.12674 8.7499 6.6665 8.7499H4.99984C4.07936 8.7499 3.33317 9.49609 3.33317 10.4166V14.5832C3.33317 15.5037 4.07936 16.2499 4.99984 16.2499H14.9998C15.9203 16.2499 16.6665 15.5037 16.6665 14.5832V10.4166C16.6665 9.49609 15.9203 8.7499 14.9998 8.7499H13.3332C12.8729 8.7499 12.4998 8.37681 12.4998 7.91657C12.4998 7.45633 12.8729 7.08323 13.3332 7.08323H14.9998Z" fill="#FF8200" />
                        </svg>
                        Export</button>
                </div>
            </div>
            <div className='flex gap-10 mt-5'>
                <div className='flex flex-col gap-3 p-5 bg-white rounded-md shadow-md w-2/7 h-fit'>
                    <div className='flex gap-3 items-center'>
                        <h1 className='text-xl font-semibold'>Import #{grn.id}</h1>
                    </div>
                    <div className='flex justify-between items-center mt-2'>
                        <div className='flex gap-2 items-center'>
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="2" width="36" height="36" rx="18" fill="#E0E2E7" />
                                <rect x="2" y="2" width="36" height="36" rx="18" stroke="#F0F1F3" strokeWidth="4" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M24.5 14.5C24.5 16.9853 22.4853 19 20 19C17.5147 19 15.5 16.9853 15.5 14.5C15.5 12.0147 17.5147 10 20 10C22.4853 10 24.5 12.0147 24.5 14.5ZM22.5 14.5C22.5 15.8807 21.3807 17 20 17C18.6193 17 17.5 15.8807 17.5 14.5C17.5 13.1193 18.6193 12 20 12C21.3807 12 22.5 13.1193 22.5 14.5Z" fill="#667085" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M11 26.9231C11 23.0996 14.0996 20 17.9231 20H22.0769C25.9004 20 29 23.0996 29 26.9231C29 28.0701 28.0701 29 26.9231 29H13.0769C11.9299 29 11 28.0701 11 26.9231ZM13 26.9231C13 24.2041 15.2041 22 17.9231 22H22.0769C24.7959 22 27 24.2041 27 26.9231C27 26.9656 26.9656 27 26.9231 27H13.0769C13.0344 27 13 26.9656 13 26.9231Z" fill="#667085" />
                            </svg>
                            Staff
                        </div>
                        <div>{user?.name || ""}</div>
                    </div>
                    <div className='flex justify-between items-center mt-2'>
                        <div className='flex gap-2 items-center'>
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="2" width="36" height="36" rx="18" fill="#E0E2E7" />
                                <rect x="2" y="2" width="36" height="36" rx="18" stroke="#F0F1F3" strokeWidth="4" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M10 15C10 13.3431 11.3431 12 13 12H27C28.6569 12 30 13.3431 30 15V25C30 26.6569 28.6569 28 27 28H13C11.3431 28 10 26.6569 10 25V15ZM26.3334 14H13.6667L19.4 18.3C19.7556 18.5667 20.2445 18.5667 20.6 18.3L26.3334 14ZM12 15.25V25C12 25.5523 12.4477 26 13 26H27C27.5523 26 28 25.5523 28 25V15.25L21.8 19.9C20.7334 20.7 19.2667 20.7 18.2 19.9L12 15.25Z" fill="#667085" />
                            </svg>
                            Email
                        </div>
                        <div>{user?.email || ""}</div>
                    </div>
                    <div className='flex justify-between items-center mt-2'>
                        <div className='flex gap-2 items-center'>
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="2" width="36" height="36" rx="18" fill="#E0E2E7" />
                                <rect x="2" y="2" width="36" height="36" rx="18" stroke="#F0F1F3" strokeWidth="4" />
                                <path d="M18.5 25C17.9477 25 17.5 25.4477 17.5 26C17.5 26.5523 17.9477 27 18.5 27H21.5C22.0523 27 22.5 26.5523 22.5 26C22.5 25.4477 22.0523 25 21.5 25H18.5Z" fill="#667085" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M13.5 13C13.5 11.3431 14.8431 10 16.5 10H23.5C25.1569 10 26.5 11.3431 26.5 13V27C26.5 28.6569 25.1569 30 23.5 30H16.5C14.8431 30 13.5 28.6569 13.5 27V13ZM16.5 12H23.5C24.0523 12 24.5 12.4477 24.5 13V27C24.5 27.5523 24.0523 28 23.5 28H16.5C15.9477 28 15.5 27.5523 15.5 27V13C15.5 12.4477 15.9477 12 16.5 12Z" fill="#667085" />
                            </svg>
                            Phone
                        </div>
                        <div>{user?.phonenumber || ""}</div>
                    </div>
                    <div className='flex justify-between items-center mt-2'>
                        <div className='flex gap-2 items-center'>
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="2" width="36" height="36" rx="18" fill="#E0E2E7" />
                                <rect x="2" y="2" width="36" height="36" rx="18" stroke="#F0F1F3" strokeWidth="4" />
                                <path d="M23.9666 20.6975C24.3519 20.3017 24.3433 19.6686 23.9475 19.2834C23.5517 18.8982 22.9186 18.9068 22.5334 19.3025L19.2737 22.6517L17.8755 21.5309C17.4446 21.1854 16.8152 21.2547 16.4698 21.6856C16.1244 22.1166 16.1936 22.7459 16.6246 23.0914L19.0857 25.0643C19.2867 25.2254 19.5771 25.2075 19.7567 25.0229L23.9666 20.6975Z" fill="#667085" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M16 10C16.5523 10 17 10.4477 17 11H23C23 10.4477 23.4477 10 24 10C24.5523 10 25 10.4477 25 11H26C27.6569 11 29 12.3431 29 14V27C29 28.6569 27.6569 30 26 30H14C12.3431 30 11 28.6569 11 27V14C11 12.3431 12.3431 11 14 11H15C15 10.4477 15.4477 10 16 10ZM27 14V15H13V14C13 13.4477 13.4477 13 14 13H15C15 13.5523 15.4477 14 16 14C16.5523 14 17 13.5523 17 13H23C23 13.5523 23.4477 14 24 14C24.5523 14 25 13.5523 25 13H26C26.5523 13 27 13.4477 27 14ZM13 27V17H27V27C27 27.5523 26.5523 28 26 28H14C13.4477 28 13 27.5523 13 27Z" fill="#667085" />
                            </svg>
                            Added
                        </div>
                        <div>{new Date(grn.createdAt).toLocaleString('vi-VN')}</div>
                    </div>
                </div>
                <div className='flex gap-[7%] w-full '>
                    <div className='w-full p-5 bg-white rounded-md shadow-md h-fit'>
                        <div className='flex w-full gap-4 items-center px-5'>
                            <div className='text-lg font-semibold'>Product List</div>
                            <div className='bg-[#E7F4EE] text-[#0D894F] rounded-full px-2 py-1'>{details.length} Product{details.length > 1 ? "s" : ""}</div>
                        </div>
                        <table className='w-full mt-5'>
                            <thead className='bg-[#F9FAFB] font-medium'>
                                <tr className='text-center bg-[#F9F9FC] font-semibold border-b border-[#E0E2E7]'>
                                    <th className='py-2 px-4'>Product</th>
                                    <th className='py-2 px-4'>Quantity</th>
                                    <th className='py-2 px-4'>Price</th>
                                    <th className='py-2 px-4'>Total</th>
                                </tr>
                            </thead>
                            <tbody className='text-[#344054] font-normal text-center'>
                                {details.map((item) => (
                                    <ImportDetailItem
                                        key={item.id}
                                        item={item} />
                                ))}
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td className='py-2 px-4 font-semibold'>Grand Total</td>
                                    <td className='py-2 px-4 font-semibold'>{Number(grandTotal).toLocaleString()} VND</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    )
}