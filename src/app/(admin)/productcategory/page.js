"use client"
import React, { use, useEffect, useState } from 'react'
import AdminCategoryItem from '@/components/AdminCategoryItem';
import { getAllCategories, deleteCategory } from '@/service/categoryService';

export default function ProductCategory() {
    const [categories, setCategories] = useState([]);
    const [displayCategories, setDisplayCategories] = useState(categories); // Danh sách hiển thị
    const [isCheck, setIsCheck] = useState(false); // Trạng thái checkbox của tbody
    const [isAllChecked, setIsAllChecked] = useState(false); // Trạng thái checkbox của thead

    const handleSearch = () =>{
        const searchInput = document.getElementById('searchInput');
        const searchTerm = searchInput.value.toLowerCase();
        const filteredCategories = categories.filter(category =>
            category.name.toLowerCase().includes(searchTerm)
        );
        setDisplayCategories(filteredCategories);
    }
    const handleSelectAll = () => {
        const newCheckedState = !isAllChecked;
        setIsAllChecked(newCheckedState);
        setCategories(categories.map(category => ({ ...category, isChecked: newCheckedState })));
    };

    // Hàm xử lý khi checkbox trong tbody được chọn
    const handleCategoryCheck = (id) => {
        const updatedCategories = categories.map(category =>
            category.id === id ? { ...category, isChecked: !category.isChecked } : category
        );
        setCategories(updatedCategories);

        // Kiểm tra nếu tất cả các checkbox con đều được chọn
        const allChecked = updatedCategories.every(category => category.isChecked);
        setIsAllChecked(allChecked);
    };

    const fetchCategories = async () => {
        try {
            const response = await getAllCategories();
            if (response && Array.isArray(response)) {
                const updatedCategories = response.map(category => ({
                    ...category,
                    isChecked: false // Thêm thuộc tính isChecked cho mỗi category
                }));
                setCategories(updatedCategories);
                setDisplayCategories(updatedCategories);
            } else {
                console.error('Invalid response format:', response);
            }
        }
        catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    const deleteCategoryf = async (id) => {
        try{
            await deleteCategory(id);
            fetchCategories();
        }
        catch (error) {
            console.error('Error deleting category:', error);
            alert("Error deleting category");
        }
    }

    const handleDeleteCategories = () => {
        const selectedCategories = categories.filter(category => category.isChecked);
        if (selectedCategories.length === 0) {
            alert('Please select at least one category to delete.');
            return;
        }
        const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedCategories.length} categories?`);
        if (confirmDelete) {
            console.log('Deleting categories:', selectedCategories);
            selectedCategories.forEach(category => deleteCategoryf(category.id));
            fetchCategories();
        }
    }

    const handleDeleteCategory = (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this category?');
        if (confirmDelete) {
            deleteCategoryf(id);
        }
    }


    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const anyChecked = categories.some(category => category.isChecked);
        setIsCheck(anyChecked);
        setDisplayCategories(categories);
    }, [categories]);

    return (
        <div className='px-2 py-5'>
            <div className='flex justify-between items-end'>
                <div>
                    <h1 className='text-3xl font-bold'>Category</h1>
                    <div id="roadmap" className="flex items-center mt-2">
                        <a className="text-[#ff8200]" href="/dashboard">Dashboard</a>
                        <label className="ml-3 mr-3">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M6.59467 3.96967C6.30178 4.26256 6.30178 4.73744 6.59467 5.03033L10.5643 9L6.59467 12.9697C6.30178 13.2626 6.30178 13.7374 6.59467 14.0303C6.88756 14.3232 7.36244 14.3232 7.65533 14.0303L12.4205 9.26516C12.5669 9.11872 12.5669 8.88128 12.4205 8.73484L7.65533 3.96967C7.36244 3.67678 6.88756 3.67678 6.59467 3.96967Z" fill="#A3A9B6" />
                            </svg>
                        </label>
                        <a className="text-[#667085]" href="/productcategory">Product Category</a>
                    </div>
                </div>
                <div className='flex gap-3'>
                    <button className='bg-[#FBE3CA] text-[#ff8200] px-4 py-2 rounded-md flex gap-2 items-center'>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.0891 6.00582C12.7637 6.33126 12.236 6.33126 11.9106 6.00582L10.8332 4.92841V12.9166C10.8332 13.3768 10.4601 13.7499 9.99984 13.7499C9.5396 13.7499 9.1665 13.3768 9.1665 12.9166V4.92841L8.08909 6.00582C7.76366 6.33126 7.23602 6.33126 6.91058 6.00582C6.58514 5.68039 6.58514 5.15275 6.91058 4.82731L9.70521 2.03268C9.86793 1.86997 10.1317 1.86996 10.2945 2.03268L13.0891 4.82731C13.4145 5.15275 13.4145 5.68039 13.0891 6.00582Z" fill="#FF8200" />
                            <path d="M14.9998 7.08323C16.8408 7.08323 18.3332 8.57562 18.3332 10.4166V14.5832C18.3332 16.4242 16.8408 17.9166 14.9998 17.9166H4.99984C3.15889 17.9166 1.6665 16.4242 1.6665 14.5832V10.4166C1.6665 8.57562 3.15889 7.08323 4.99984 7.08323H6.6665C7.12674 7.08323 7.49984 7.45633 7.49984 7.91657C7.49984 8.37681 7.12674 8.7499 6.6665 8.7499H4.99984C4.07936 8.7499 3.33317 9.49609 3.33317 10.4166V14.5832C3.33317 15.5037 4.07936 16.2499 4.99984 16.2499H14.9998C15.9203 16.2499 16.6665 15.5037 16.6665 14.5832V10.4166C16.6665 9.49609 15.9203 8.7499 14.9998 8.7499H13.3332C12.8729 8.7499 12.4998 8.37681 12.4998 7.91657C12.4998 7.45633 12.8729 7.08323 13.3332 7.08323H14.9998Z" fill="#FF8200" />
                        </svg>
                        Export</button>
                    <button className='bg-[#ff8200] text-white px-4 py-2 rounded-md flex gap-2 items-center'
                        onClick={() => window.location.href = '/addcategory'}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.16667 15.4167C9.16667 15.8769 9.53976 16.25 10 16.25C10.4602 16.25 10.8333 15.8769 10.8333 15.4167V10.8333H15.4167C15.8769 10.8333 16.25 10.4602 16.25 10C16.25 9.53976 15.8769 9.16667 15.4167 9.16667H10.8333V4.58333C10.8333 4.1231 10.4602 3.75 10 3.75C9.53976 3.75 9.16667 4.1231 9.16667 4.58333V9.16667H4.58333C4.1231 9.16667 3.75 9.53976 3.75 10C3.75 10.4602 4.1231 10.8333 4.58333 10.8333H9.16667V15.4167Z" fill="white" />
                        </svg>
                        Add Category
                    </button>
                    {isCheck && (
                        <button className='bg-[#ff8200] text-white px-4 py-2 rounded-md flex gap-2 items-center' onClick={handleDeleteCategories}>
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

            <div className='flex gap-1 items-center bg-white rounded-md px-4 border border-[#E0E2E7] mt-5 w-fit'>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M14.7844 16.1991C11.646 18.6416 7.10629 18.4205 4.22156 15.5358C1.09737 12.4116 1.09737 7.34625 4.22156 4.22205C7.34576 1.09786 12.4111 1.09786 15.5353 4.22205C18.42 7.10677 18.6411 11.6464 16.1986 14.7849L20.4851 19.0713C20.8756 19.4618 20.8756 20.095 20.4851 20.4855C20.0945 20.876 19.4614 20.876 19.0708 20.4855L14.7844 16.1991ZM5.63578 14.1215C7.97892 16.4647 11.7779 16.4647 14.1211 14.1215C16.4642 11.7784 16.4642 7.97941 14.1211 5.63627C11.7779 3.29312 7.97892 3.29312 5.63578 5.63627C3.29263 7.97941 3.29263 11.7784 5.63578 14.1215Z" fill="#667085" />
                </svg>
                <input id='searchInput' type='text' placeholder='Search product...' className='px-2 py-2 outline-none' onChange={handleSearch}/>
            </div>

            <div className=' shadow-md rounded-md border border-[#E0E2E7] mt-5'>
                <table className='w-full py-2 rounded-md overflow-hidden '>
                    <thead className='bg-[#F9F9FC] font-medium border-b border-[#F0F1F3]'>
                        <tr className='text-left text-[#344054] font-semibold rounded-md'>
                            <th>
                                <input
                                    type='checkbox'
                                    className='w-5 h-5 accent-[#ff8200] ml-5 my-5'
                                    checked={isAllChecked}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className='py-2 px-4'>Category</th>
                            <th className='py-2 px-4'>Product</th>
                            <th className='py-2 px-4'>Added</th>
                            <th className='py-2 px-4'>Action</th>
                        </tr>
                    </thead>
                    <tbody className='text-[#344054] font-normal'>
                        {displayCategories.map((category) => (
                            <AdminCategoryItem
                                key={category.id}
                                category={category}
                                onCheck={() => handleCategoryCheck(category.id)}
                                onDelete={() => handleDeleteCategory(category.id)}
                            />
                        ))}
                    </tbody>
                    {displayCategories.length === 0 && (
                        <tbody>
                            <tr>
                                <td colSpan="5" className='text-center py-4 text-gray-500'>No categories found</td>
                            </tr>
                        </tbody>
                    )}
                </table>
                {/* Pagination*/}
            </div>


        </div>
    )
}