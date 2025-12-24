"use client"
import React, { useState, useEffect, useRef } from 'react'
import AdminProductItem from '@/components/AdminProductItem';
import { getAllProducts, deleteProduct } from '@/service/productService';
import { getAllCategories } from '@/service/categoryService';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default function Product() {
    const [products, setProducts] = useState([]);
    const [displayProducts, setDisplayProducts] = useState([]);
    const [isCheck, setIsCheck] = useState(false);
    const [isAllChecked, setIsAllChecked] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [filterBrand, setFilterBrand] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterPrice, setFilterPrice] = useState({ min: '', max: '' });
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const filterRef = useRef(null);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);
    const [tempMinPrice, setTempMinPrice] = useState('');
    const [tempMaxPrice, setTempMaxPrice] = useState('');

    const fetchProducts = async () => {
        try {
            const data = await getAllProducts();
            if (data) {
                const productsWithCheck = data.map(product => ({ ...product, isChecked: false }));
                setProducts(productsWithCheck);
                setDisplayProducts(productsWithCheck);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    const handleExport = async () => {
        if (!Array.isArray(products) || products.length === 0) return;

        const workbook = new ExcelJS.Workbook();
        workbook.creator = "YourApp";
        workbook.created = new Date();

        const worksheet = workbook.addWorksheet("Product List", {
            views: [{ state: "frozen", ySplit: 1 }],
        });

        worksheet.columns = [
            { header: "ID", key: "id", width: 12 },
            { header: "Brand", key: "brand", width: 16 },
            { header: "Category", key: "category", width: 18 },
            { header: "Stock", key: "stock", width: 10 },
            { header: "Price", key: "price", width: 16 },
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
        products.forEach((item) => {
            worksheet.addRow({
                id: item?.id ?? "",
                brand: item?.brand || "Unknown",
                category: item?.Category?.name || "Unknown",
                stock: Number(item?.quantity ?? 0),
                price: Number(item?.price ?? 0), // keep as number
                createdAt: item?.createdAt ? new Date(item.createdAt) : null,
                updatedAt: item?.updatedAt ? new Date(item.updatedAt) : null,
            });
        });

        // Format rows
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

            // Stock center
            row.getCell("stock").alignment = { vertical: "middle", horizontal: "center" };

            // Price: VN currency format
            const priceCell = row.getCell("price");
            if (typeof priceCell.value === "number") {
                priceCell.numFmt = '#,##0" ₫"';
                priceCell.alignment = { vertical: "middle", horizontal: "right" };
            }

            // Date format
            const createdCell = row.getCell("createdAt");
            if (createdCell.value) createdCell.numFmt = "dd/mm/yyyy hh:mm:ss";

            const updatedCell = row.getCell("updatedAt");
            if (updatedCell.value) updatedCell.numFmt = "dd/mm/yyyy hh:mm:ss";
        });

        // Export
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, "Product_List.xlsx");
    };
    const fetchCategories = async () => {
        const res = await getAllCategories();
        if (res) {
            setCategories(res);
        }
    }
    const handleDeleteProduct = async (id) => {
        try {
            await deleteProduct(id);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }

    const onDeleteProduct = (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this product?');
        if (confirmDelete) {
            handleDeleteProduct(id);
        }
    }

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    useEffect(() => {
        const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean))];
        setBrands(uniqueBrands);
        const prices = products.map(p => Number(p.price)).filter(p => !isNaN(p));
        const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : 10000000;
        setMin(minPrice);
        setMax(maxPrice);
        setFilterPrice(fp => ({
            min: minPrice,
            max: maxPrice
        }));
        setTempMinPrice(minPrice);
        setTempMaxPrice(maxPrice);
    }, [products]);

    const handleSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            (product.brand && product.brand.toLowerCase().includes(searchTerm))
        );
        setDisplayProducts(filteredProducts);
        setIsAllChecked(false);
    }

    const handleSelectAll = () => {
        const newCheckedState = !isAllChecked;
        setIsAllChecked(newCheckedState);
        setProducts(products.map(product => ({ ...product, isChecked: newCheckedState })));
    };

    const handleProductCheck = (id) => {
        const updateProducts = products.map(product =>
            product.id === id ? { ...product, isChecked: !product.isChecked } : product
        );
        setProducts(updateProducts);

        setDisplayProducts(updateProducts);
        const allChecked = updateProducts.every(product => product.isChecked);
        setIsAllChecked(allChecked);
    };

    const handleDeleteChecked = () => {
        const checkedProducts = products.filter(product => product.isChecked);
        if (checkedProducts.length === 0) {
            alert('No products selected for deletion');
            return;
        }

        const confirmDelete = window.confirm(`Are you sure you want to delete ${checkedProducts.length} product(s)?`);
        if (confirmDelete) {
            checkedProducts.forEach(product => handleDeleteProduct(product.id));
            setIsCheck(false);
            setIsAllChecked(false);
        }
    }

    useEffect(() => {
        if (showFilter) {
            setTempMinPrice(filterPrice.min || '');
            setTempMaxPrice(filterPrice.max || '');
        }
    }, [showFilter, filterPrice]);

    useEffect(() => {
        let filtered = products;
        if (filterBrand) {
            filtered = filtered.filter(p => p.brand?.toLowerCase().includes(filterBrand.toLowerCase()));
        }
        if (filterCategory) {
            filtered = filtered.filter(p => String(p.categoriesid) === filterCategory);
        }
        if (filterPrice.min) {
            filtered = filtered.filter(p => Number(p.price) >= Number(filterPrice.min));
        }
        if (filterPrice.max) {
            filtered = filtered.filter(p => Number(p.price) <= Number(filterPrice.max));
        }
        setDisplayProducts(filtered);
    }, [products, filterBrand, filterCategory, filterPrice]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowFilter(false);
            }
        }
        if (showFilter) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showFilter]);

    useEffect(() => {
        const anyChecked = products.some(product => product.isChecked);
        setIsCheck(anyChecked);
        setDisplayProducts(products)
    }, [products]);

    return (
        <div className='px-2 py-5'>
            <div className='flex justify-between items-end'>
                <div>
                    <h1 className='text-3xl font-bold'>Product</h1>
                    <div id="roadmap" className="flex items-center mt-2">
                        <a className="text-(--primary)" href="/dashboard">Dashboard</a>
                        <label className="ml-3 mr-3">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M6.59467 3.96967C6.30178 4.26256 6.30178 4.73744 6.59467 5.03033L10.5643 9L6.59467 12.9697C6.30178 13.2626 6.30178 13.7374 6.59467 14.0303C6.88756 14.3232 7.36244 14.3232 7.65533 14.0303L12.4205 9.26516C12.5669 9.11872 12.5669 8.88128 12.4205 8.73484L7.65533 3.96967C7.36244 3.67678 6.88756 3.67678 6.59467 3.96967Z" fill="#A3A9B6" />
                            </svg>
                        </label>
                        <a className="text-[#667085]" href="/productlist">Product List</a>
                    </div>
                </div>
                <div className='flex gap-3'>
                    <button className='bg-[#FBE3CA] text-(--primary) px-4 py-2 rounded-md flex gap-2 items-center ' onClick={handleExport}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.0891 6.00582C12.7637 6.33126 12.236 6.33126 11.9106 6.00582L10.8332 4.92841V12.9166C10.8332 13.3768 10.4601 13.7499 9.99984 13.7499C9.5396 13.7499 9.1665 13.3768 9.1665 12.9166V4.92841L8.08909 6.00582C7.76366 6.33126 7.23602 6.33126 6.91058 6.00582C6.58514 5.68039 6.58514 5.15275 6.91058 4.82731L9.70521 2.03268C9.86793 1.86997 10.1317 1.86996 10.2945 2.03268L13.0891 4.82731C13.4145 5.15275 13.4145 5.68039 13.0891 6.00582Z" fill="#FF8200" />
                            <path d="M14.9998 7.08323C16.8408 7.08323 18.3332 8.57562 18.3332 10.4166V14.5832C18.3332 16.4242 16.8408 17.9166 14.9998 17.9166H4.99984C3.15889 17.9166 1.6665 16.4242 1.6665 14.5832V10.4166C1.6665 8.57562 3.15889 7.08323 4.99984 7.08323H6.6665C7.12674 7.08323 7.49984 7.45633 7.49984 7.91657C7.49984 8.37681 7.12674 8.7499 6.6665 8.7499H4.99984C4.07936 8.7499 3.33317 9.49609 3.33317 10.4166V14.5832C3.33317 15.5037 4.07936 16.2499 4.99984 16.2499H14.9998C15.9203 16.2499 16.6665 15.5037 16.6665 14.5832V10.4166C16.6665 9.49609 15.9203 8.7499 14.9998 8.7499H13.3332C12.8729 8.7499 12.4998 8.37681 12.4998 7.91657C12.4998 7.45633 12.8729 7.08323 13.3332 7.08323H14.9998Z" fill="#FF8200" />
                        </svg>
                        Export</button>
                    <button className='bg-(--primary) text-white px-4 py-2 rounded-md flex gap-2 items-center'
                        onClick={() => window.location.href = '/addproduct'}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.16667 15.4167C9.16667 15.8769 9.53976 16.25 10 16.25C10.4602 16.25 10.8333 15.8769 10.8333 15.4167V10.8333H15.4167C15.8769 10.8333 16.25 10.4602 16.25 10C16.25 9.53976 15.8769 9.16667 15.4167 9.16667H10.8333V4.58333C10.8333 4.1231 10.4602 3.75 10 3.75C9.53976 3.75 9.16667 4.1231 9.16667 4.58333V9.16667H4.58333C4.1231 9.16667 3.75 9.53976 3.75 10C3.75 10.4602 4.1231 10.8333 4.58333 10.8333H9.16667V15.4167Z" fill="white" />
                        </svg>
                        Add Product
                    </button>
                    {isCheck && (
                        <button className='bg-(--primary) text-white px-4 py-2 rounded-md flex gap-2 items-center' onClick={handleDeleteChecked}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.33317 8.12484C8.79341 8.12484 9.1665 8.49793 9.1665 8.95817V13.9582C9.1665 14.4184 8.79341 14.7915 8.33317 14.7915C7.87293 14.7915 7.49984 14.4184 7.49984 13.9582V8.95817C7.49984 8.49793 7.87293 8.12484 8.33317 8.12484Z" fill="#fff" />
                                <path d="M12.4998 8.95817C12.4998 8.49793 12.1267 8.12484 11.6665 8.12484C11.2063 8.12484 10.8332 8.49793 10.8332 8.95817V13.9582C10.8332 14.4184 11.2063 14.7915 11.6665 14.7915C12.1267 14.7915 12.4998 14.4184 12.4998 13.9582V8.95817Z" fill="#fff" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M14.9998 4.99984V4.1665C14.9998 2.78579 13.8806 1.6665 12.4998 1.6665H7.49984C6.11913 1.6665 4.99984 2.78579 4.99984 4.1665V4.99984H3.74984C3.2896 4.99984 2.9165 5.37293 2.9165 5.83317C2.9165 6.29341 3.2896 6.6665 3.74984 6.6665H4.1665V15.8332C4.1665 17.2139 5.28579 18.3332 6.6665 18.3332H13.3332C14.7139 18.3332 15.8332 17.2139 15.8332 15.8332V6.6665H16.2498C16.7101 6.6665 17.0832 6.29341 17.0832 5.83317C17.0832 5.37293 16.7101 4.99984 16.2498 4.99984H14.9998ZM12.4998 3.33317H7.49984C7.0396 3.33317 6.6665 3.70627 6.6665 4.1665V4.99984H13.3332V4.1665C13.3332 3.70627 12.9601 3.33317 12.4998 3.33317ZM14.1665 6.6665H5.83317V15.8332C5.83317 16.2934 6.20627 16.6665 6.6665 16.6665H13.3332C13.7934 16.6665 14.1665 16.2934 14.1665 15.8332V6.6665Z" fill="#fff" />
                            </svg>
                            Delete
                        </button>
                    )}
                </div>
            </div>

            <div className='mt-5 flex justify-between items-center'>
                <div className='flex gap-1 items-center bg-(--surface) rounded-md px-4 border border-(--border)'>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M14.7844 16.1991C11.646 18.6416 7.10629 18.4205 4.22156 15.5358C1.09737 12.4116 1.09737 7.34625 4.22156 4.22205C7.34576 1.09786 12.4111 1.09786 15.5353 4.22205C18.42 7.10677 18.6411 11.6464 16.1986 14.7849L20.4851 19.0713C20.8756 19.4618 20.8756 20.095 20.4851 20.4855C20.0945 20.876 19.4614 20.876 19.0708 20.4855L14.7844 16.1991ZM5.63578 14.1215C7.97892 16.4647 11.7779 16.4647 14.1211 14.1215C16.4642 11.7784 16.4642 7.97941 14.1211 5.63627C11.7779 3.29312 7.97892 3.29312 5.63578 5.63627C3.29263 7.97941 3.29263 11.7784 5.63578 14.1215Z" fill="#667085" />
                    </svg>
                    <input type='text' placeholder='Search product...' className='px-2 py-2 text-(--text) outline-none' onChange={handleSearch} />
                </div>
                <button className='text-(--muted) border border-(--border) bg-(--surface) rounded-md px-4 py-2 flex items-center gap-2'
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

                {showFilter && (
                    <div
                        ref={filterRef}
                        className="absolute z-10 bg-(--surface) border border-(--border) rounded-md shadow-md p-4 mt-2 right-10"
                    >
                        <div className="flex flex-col gap-3 mb-2">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-(--text)">Brand</label>
                                <select
                                    value={filterBrand}
                                    onChange={e => setFilterBrand(e.target.value)}
                                    className="border px-2 py-1 rounded w-full"
                                >
                                    <option value="">All Brand</option>
                                    {brands.map((brand, index) => (
                                        <option key={index} value={brand}>{brand}</option>
                                    ))}
                                </select>
                            </div>
                            <hr></hr>
                            <div >
                                <label className="block mb-1 text-sm font-medium text-(--text)">Price Range</label>
                                <div className="flex flex-col items-center gap-2">
                                    <div className='grid grid-cols-3 w-full gap-2 items-center'>
                                        <span className="text-sm">From:</span>
                                        <input
                                            type="range"
                                            min={min}
                                            max={tempMaxPrice || max}
                                            value={tempMinPrice}
                                            onChange={e => {
                                                setTempMinPrice(e.target.value);
                                                setFilterPrice(fp => ({ ...fp, min: e.target.value }));
                                            }}
                                            className="w-24"
                                        />
                                        <span className="text-sm">{Number(tempMinPrice).toLocaleString()} VND</span>
                                    </div>
                                    <div className='grid grid-cols-3 w-full gap-2 items-center'>
                                        <span className="text-sm">To:</span>
                                        <input
                                            type="range"
                                            min={tempMinPrice || min}
                                            max={max}
                                            value={tempMaxPrice}
                                            onChange={e => {
                                                setTempMaxPrice(e.target.value);
                                                setFilterPrice(fp => ({ ...fp, max: e.target.value }));
                                            }}
                                            className="w-24"
                                        />
                                        <span className="text-sm">{Number(tempMaxPrice).toLocaleString()} VND</span>
                                    </div>
                                </div>
                            </div>
                            <hr></hr>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-(--text)">Category</label>
                                <select
                                    value={filterCategory}
                                    onChange={e => setFilterCategory(e.target.value)}
                                    className="border px-2 py-1 rounded w-full"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button
                                className="bg-(--surface2) text-(--text) px-3 py-1 rounded"
                                onClick={() => {
                                    setFilterBrand('');
                                    setFilterCategory('');
                                    setTempMinPrice('');
                                    setTempMaxPrice('');
                                    setFilterPrice({ min: '', max: '' });
                                    setShowFilter(false);
                                }}
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                )}

            </div>

            <div className=' shadow-md rounded-md border border-(--border) mt-5'>
                <table className='w-full py-2 rounded-md overflow-hidden '>
                    <thead className='bg-(--surface2) font-medium border-b border-(--border)'>
                        <tr className='text-center text-(--text) font-semibold rounded-md'>
                            <th>
                                <input
                                    type='checkbox'
                                    className='w-5 h-5 accent-(--primary) ml-5 my-4'
                                    checked={isAllChecked}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className='py-2 px-4'>Product</th>
                            {/* <th className='py-2 px-4'>SKU</th> */}
                            <th className='py-2 px-4'>Brand</th>
                            <th className='py-2 px-4'>Category</th>
                            <th className='py-2 px-4'>Stock</th>
                            <th className='py-2 px-4'>Price</th>
                            <th className='py-2 px-4'>Status</th>
                            <th className='py-2 px-4'>Added</th>
                            <th className='py-2 px-4'>Action</th>


                        </tr>
                    </thead>
                    <tbody className='font-normal text-center'>
                        {displayProducts.map((product) => (
                            <AdminProductItem
                                key={product.id}
                                product={product}
                                onCheck={() => handleProductCheck(product.id)}
                                onDelete={() => onDeleteProduct(product.id)}
                            />
                        ))}
                        {
                            displayProducts.length === 0 && (
                                <tr>
                                    <td colSpan="9" className="text-center py-4 text-gray-500">
                                        No products found
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
                {/* Pagination*/}
            </div>


        </div>
    )
}