"use client"
import { useState, useEffect, useRef } from "react";
import React from 'react'
import ImportItem from "@/components/ImportItem";
import { getImports } from "@/service/importService";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";


export default function ImportPage() {
    const [selectedOption, setSelectedOption] = useState('all-times');
    const [imports, setImports] = useState([]);
    const [displayImports, setDisplayImports] = useState([]);
    const dateDialogRef = useRef(null);
    const [showDateDialog, setShowDateDialog] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [minTotal, setMinTotal] = useState(null);
    const [maxTotal, setMaxTotal] = useState(null);
    const [showFilter, setShowFilter] = useState(false);
    const filterRef = useRef(null);
    const minImportTotal = imports.length > 0 ? Math.min(...imports.map(o => Number(o.totalprice) || 0)) : 0;
    const maxImportTotal = imports.length > 0 ? Math.max(...imports.map(o => Number(o.totalprice) || 0)) : 1000000;

    const fetchImports = async () => {
        try {
            const response = await getImports();
            if (response) {
                console.log("Imports fetched successfully:", response);
                const sortedImports = response.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setImports(sortedImports);
                setDisplayImports(sortedImports);
            } else {
                console.error("Failed to fetch imports");
            }
        } catch (error) {
            console.error("Error fetching imports:", error);
        }
    }

    const handleExport = async () => {
    if (!Array.isArray(displayImports) || displayImports.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "YourApp";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Import List", {
        views: [{ state: "frozen", ySplit: 1 }],
    });

    // Define columns (header + key + width)
    worksheet.columns = [
        { header: "ImportID", key: "importId", width: 12 },
        { header: "Total", key: "total", width: 16 },
        { header: "CreatedAt", key: "createdAt", width: 20 },
        { header: "UpdatedAt", key: "updatedAt", width: 20 },
    ];

  // Header style (optional but nice)
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
    displayImports.forEach((item) => {
        worksheet.addRow({
        importId: item?.id ?? "",
        total: Number(item?.totalprice ?? 0), // keep as number
        createdAt: item?.createdAt ? new Date(item.createdAt) : null,
        updatedAt: item?.updatedAt ? new Date(item.updatedAt) : null,
        });
    });

    // Format cells
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;

        row.eachCell((cell) => {
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };
        cell.alignment = { vertical: "middle", horizontal: "left" };
        });

        // Total format VN currency style
        const totalCell = row.getCell("total");
        totalCell.numFmt = '#,##0" ₫"';
        totalCell.alignment = { vertical: "middle", horizontal: "right" };

        // Date/time format
        const createdCell = row.getCell("createdAt");
        if (createdCell.value) createdCell.numFmt = "dd/mm/yyyy hh:mm:ss";

        const updatedCell = row.getCell("updatedAt");
        if (updatedCell.value) updatedCell.numFmt = "dd/mm/yyyy hh:mm:ss";
    });

    // Export in browser
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "Import_List.xlsx");
    };

    useEffect(() => {
        fetchImports();
    }, []);

    useEffect(() => {
        if (imports.length > 0) {
            const min = Math.min(...imports.map(o => Number(o.totalprice) || 0));
            const max = Math.max(...imports.map(o => Number(o.totalprice) || 0));
            if (minTotal === null) setMinTotal(min);
            if (maxTotal === null) setMaxTotal(max);
        }
        // eslint-disable-next-line
    }, [imports]);

    useEffect(() => {
        if (!showDateDialog) return;
        const handleClickOutside = (event) => {
            if (dateDialogRef.current && !dateDialogRef.current.contains(event.target)) {
                setShowDateDialog(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDateDialog]);

    useEffect(() => {
        if (!showFilter) return;
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowFilter(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showFilter]);

    useEffect(() => {
        let filtered = imports;
        const now = new Date();
        if (selectedOption === "24-hours") {
            filtered = imports.filter(grn => {
                const created = new Date(grn.createdAt);
                return now - created <= 24 * 60 * 60 * 1000;
            });
        } else if (selectedOption === "7-days") {
            filtered = imports.filter(grn => {
                const created = new Date(grn.createdAt);
                return now - created <= 7 * 24 * 60 * 60 * 1000;
            });
        } else if (selectedOption === "30-days") {
            filtered = imports.filter(grn => {
                const created = new Date(grn.createdAt);
                return now - created <= 30 * 24 * 60 * 60 * 1000;
            });
        } else if (selectedOption === "12-months") {
            filtered = imports.filter(grn => {
                const created = new Date(grn.createdAt);
                return now - created <= 365 * 24 * 60 * 60 * 1000;
            });
        } else if (selectedOption === "custom-date" && startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            filtered = imports.filter(grn => {
                const created = new Date(grn.createdAt);
                return created >= start && created <= end;
            });
        }

        if (minTotal !== '') {
            filtered = filtered.filter(grn => Number(grn.totalprice) >= Number(minTotal));
        }
        if (maxTotal !== '') {
            filtered = filtered.filter(grn => Number(grn.totalprice) <= Number(maxTotal));
        }

        setDisplayImports(filtered);
    }, [imports, selectedOption, startDate, endDate, minTotal, maxTotal]);

    const handleOpenDateDialog = () => {
        setShowDateDialog(true);
    };

    const handleCloseDateDialog = () => {
        setShowDateDialog(false);
    };

    const handleApplyDateFilter = () => {
        setSelectedOption('custom-date');
        setShowDateDialog(false);
    };

    return (
        <div className='font-inter'>
            <div className="flex justify-between items-end">
                <div>
                    <h1 className='text-3xl font-bold'>Import</h1>
                    <div id="roadmap" className="flex items-center mt-2">
                        <a className="text-[#ff8200]" href="/dashboard">Dashboard</a>
                        <label className="ml-3 mr-3">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M6.59467 3.96967C6.30178 4.26256 6.30178 4.73744 6.59467 5.03033L10.5643 9L6.59467 12.9697C6.30178 13.2626 6.30178 13.7374 6.59467 14.0303C6.88756 14.3232 7.36244 14.3232 7.65533 14.0303L12.4205 9.26516C12.5669 9.11872 12.5669 8.88128 12.4205 8.73484L7.65533 3.96967C7.36244 3.67678 6.88756 3.67678 6.59467 3.96967Z" fill="#A3A9B6" />
                            </svg>
                        </label>
                        <a className="text-[#667085]" href="/import">Import List</a>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className='bg-[#FBE3CA] text-[#FF8200] rounded-md px-4 py-2 flex items-center gap-2' onClick={handleExport}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.0891 6.00582C12.7637 6.33126 12.236 6.33126 11.9106 6.00582L10.8332 4.92841V12.9166C10.8332 13.3768 10.4601 13.7499 9.99984 13.7499C9.5396 13.7499 9.1665 13.3768 9.1665 12.9166V4.92841L8.08909 6.00582C7.76366 6.33126 7.23602 6.33126 6.91058 6.00582C6.58514 5.68039 6.58514 5.15275 6.91058 4.82731L9.70521 2.03268C9.86793 1.86997 10.1317 1.86996 10.2945 2.03268L13.0891 4.82731C13.4145 5.15275 13.4145 5.68039 13.0891 6.00582Z" fill="#FF8200" />
                            <path d="M14.9998 7.08323C16.8408 7.08323 18.3332 8.57562 18.3332 10.4166V14.5832C18.3332 16.4242 16.8408 17.9166 14.9998 17.9166H4.99984C3.15889 17.9166 1.6665 16.4242 1.6665 14.5832V10.4166C1.6665 8.57562 3.15889 7.08323 4.99984 7.08323H6.6665C7.12674 7.08323 7.49984 7.45633 7.49984 7.91657C7.49984 8.37681 7.12674 8.7499 6.6665 8.7499H4.99984C4.07936 8.7499 3.33317 9.49609 3.33317 10.4166V14.5832C3.33317 15.5037 4.07936 16.2499 4.99984 16.2499H14.9998C15.9203 16.2499 16.6665 15.5037 16.6665 14.5832V10.4166C16.6665 9.49609 15.9203 8.7499 14.9998 8.7499H13.3332C12.8729 8.7499 12.4998 8.37681 12.4998 7.91657C12.4998 7.45633 12.8729 7.08323 13.3332 7.08323H14.9998Z" fill="#FF8200" />
                        </svg>
                        Export
                    </button>
                    <button className='bg-[#ff8200] text-white px-4 py-2 rounded-md flex gap-2 items-center'
                        onClick={() => window.location.href = '/addimport'}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.16667 15.4167C9.16667 15.8769 9.53976 16.25 10 16.25C10.4602 16.25 10.8333 15.8769 10.8333 15.4167V10.8333H15.4167C15.8769 10.8333 16.25 10.4602 16.25 10C16.25 9.53976 15.8769 9.16667 15.4167 9.16667H10.8333V4.58333C10.8333 4.1231 10.4602 3.75 10 3.75C9.53976 3.75 9.16667 4.1231 9.16667 4.58333V9.16667H4.58333C4.1231 9.16667 3.75 9.53976 3.75 10C3.75 10.4602 4.1231 10.8333 4.58333 10.8333H9.16667V15.4167Z" fill="white" />
                        </svg>
                        Add Import
                    </button>
                </div>
            </div>
            <div className='flex justify-between mt-5'>
                <div className='text-[#667085] border border-[#E0E2E7] rounded-md p-1 flex items-center gap-2'>
                    <label>
                        <input
                            type="radio"
                            name="option"
                            value="all-times"
                            className="hidden peer"
                            checked={selectedOption === 'all-times'}
                            onChange={() => setSelectedOption('all-times')}
                        />
                        <span className="px-4 py-2 rounded-md cursor-pointer peer-checked:bg-[#ff8200] peer-checked:text-white">
                            All Times
                        </span>
                    </label>

                    {/* 12 Months */}
                    <label>
                        <input
                            type="radio"
                            name="option"
                            value="12-months"
                            className="hidden peer"
                            checked={selectedOption === '12-months'}
                            onChange={() => setSelectedOption('12-months')}
                        />
                        <span className="px-4 py-2 rounded-md cursor-pointer peer-checked:bg-[#ff8200] peer-checked:text-white">
                            12 months
                        </span>
                    </label>

                    {/* 30 Days */}
                    <label>
                        <input
                            type="radio"
                            name="option"
                            value="30-days"
                            className="hidden peer"
                            checked={selectedOption === '30-days'}
                            onChange={() => setSelectedOption('30-days')}
                        />
                        <span className="px-4 py-2 rounded-md cursor-pointer peer-checked:bg-[#ff8200] peer-checked:text-white">
                            30 days
                        </span>
                    </label>

                    {/* 7 Days */}
                    <label>
                        <input
                            type="radio"
                            name="option"
                            value="7-days"
                            className="hidden peer"
                            checked={selectedOption === '7-days'}
                            onChange={() => setSelectedOption('7-days')}
                        />
                        <span className="px-4 py-2 rounded-md cursor-pointer peer-checked:bg-[#ff8200] peer-checked:text-white">
                            7 days
                        </span>
                    </label>

                    {/* 24 Hours */}
                    <label>
                        <input
                            type="radio"
                            name="option"
                            value="24-hours"
                            className="hidden peer"
                            checked={selectedOption === '24-hours'}
                            onChange={() => setSelectedOption('24-hours')}
                        />
                        <span className="px-4 py-2 rounded-md cursor-pointer peer-checked:bg-[#ff8200] peer-checked:text-white">
                            24 hours
                        </span>
                    </label>
                </div>
                <div className='flex gap-3'>
                    <button className='text-[#667085] border border-[#E0E2E7] rounded-md px-4 py-2 flex items-center gap-2 bg-white'
                        onClick={handleOpenDateDialog}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M7.5 2.49984C7.5 2.0396 7.1269 1.6665 6.66667 1.6665C6.20643 1.6665 5.83333 2.0396 5.83333 2.49984H5C3.61929 2.49984 2.5 3.61913 2.5 4.99984V15.8332C2.5 17.2139 3.61929 18.3332 5 18.3332H15C16.3807 18.3332 17.5 17.2139 17.5 15.8332V4.99984C17.5 3.61913 16.3807 2.49984 15 2.49984H14.1667C14.1667 2.0396 13.7936 1.6665 13.3333 1.6665C12.8731 1.6665 12.5 2.0396 12.5 2.49984H7.5ZM15.8333 5.83317V4.99984C15.8333 4.5396 15.4602 4.1665 15 4.1665H14.1667C14.1667 4.62674 13.7936 4.99984 13.3333 4.99984C12.8731 4.99984 12.5 4.62674 12.5 4.1665H7.5C7.5 4.62674 7.1269 4.99984 6.66667 4.99984C6.20643 4.99984 5.83333 4.62674 5.83333 4.1665H5C4.53976 4.1665 4.16667 4.5396 4.16667 4.99984V5.83317H15.8333ZM4.16667 7.49984V15.8332C4.16667 16.2934 4.53976 16.6665 5 16.6665H15C15.4602 16.6665 15.8333 16.2934 15.8333 15.8332V7.49984H4.16667Z" fill="#667085" />
                        </svg>
                        Select Dates
                    </button>
                    <button className='text-[#667085] border border-[#E0E2E7] bg-white rounded-md px-4 py-2 flex items-center gap-2'
                        onClick={() => setShowFilter((prev) => !prev)}>
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
            </div>
            {showDateDialog && (
                <div className="fixed right-20 top-60 z-50">
                    <div ref={dateDialogRef}
                        className="bg-white rounded-lg shadow-lg p-6 min-w-[320px]">
                        <h3 className="text-lg font-semibold mb-4">Select Dates</h3>
                        <div className="flex flex-col gap-3">
                            <label className="flex justify-between items-center">
                                Start Date:
                                <input
                                    type="date"
                                    className="border rounded px-2 py-1 ml-2"
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                />
                            </label>
                            <label className="flex justify-between items-center">
                                End Date:
                                <input
                                    type="date"
                                    className="border rounded px-2 py-1 ml-2"
                                    value={endDate}
                                    onChange={e => setEndDate(e.target.value)}
                                />
                            </label>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                className="px-4 py-2 rounded bg-gray-200 text-gray-700"
                                onClick={handleCloseDateDialog}
                            >
                                Clear
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-[#ff8200] text-white"
                                onClick={handleApplyDateFilter}
                                disabled={!startDate || !endDate}
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showFilter && (
                <div
                    ref={filterRef}
                    className="absolute z-50 bg-white border border-[#E0E2E7] rounded-md shadow-md py-4 px-5 mt-2 right-10"
                >
                    <div className="flex flex-col gap-3 mb-2">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Min Total: <span className="font-bold text-[#ff8200]">{minTotal}</span>
                            </label>
                            <input
                                type="range"
                                min={minImportTotal}
                                max={maxImportTotal}
                                value={minTotal ?? minImportTotal}
                                onChange={e => setMinTotal(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Max Total: <span className="font-bold text-[#ff8200]">{maxTotal}</span>
                            </label>
                            <input
                                type="range"
                                min={minImportTotal}
                                max={maxImportTotal}
                                value={maxTotal ?? maxImportTotal}
                                onChange={e => setMaxTotal(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                    </div>
                    <div className="flex gap-2 justify-end">
                        <button
                            className="bg-gray-200 text-gray-700 px-3 py-1 rounded"
                            onClick={() => {
                                setMinTotal(minImportTotal);
                                setMaxTotal(maxImportTotal);
                            }}
                        >
                            Clear
                        </button>
                    </div>
                </div>
            )}
            <div className="shadow-md rounded-md border border-[#E0E2E7] mt-5">
                <table className='w-full py-2 rounded-md overflow-hidden '>
                    <thead className='bg-[#F9F9FC] font-medium border-b border-[#F0F1F3]'>
                        <tr className='text-center text-[#344054] font-semibold rounded-md'>
                            <th className='py-2 px-4'>Import ID</th>
                            <th className='py-2 px-4'>Product</th>
                            <th className='py-2 px-4'>Date</th>
                            <th className='py-2 px-4'>Staff</th>
                            <th className='py-2 px-4'>Total</th>
                            {/* <th className='py-2 px-4'>Action</th> */}
                        </tr>
                    </thead>
                    <tbody className='text-[#344054] font-normal text-center'>
                        {displayImports.map((grn) => (
                            <ImportItem
                                key={grn.id}
                                grn={grn} />
                        ))}
                    </tbody>
                    {displayImports.length === 0 && (
                        <tbody>
                            <tr>
                                <td colSpan="8" className="text-center py-4 text-gray-500">
                                    No imports found
                                </td>
                            </tr>
                        </tbody>
                    )}
                </table>
                {/* Pagination*/}
            </div>
        </div>
    )
}