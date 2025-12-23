const getAllCategories = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            console.log('Error fetching categories');
        }
        const categories = await response.json();
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}

const getCategoryById = async (id) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            console.log('Error fetching category by ID');
        }
        const category = await response.json();
        return category;
    } catch (error) {
        console.error('Error fetching category by ID:', error);
        throw error;
    }
}

const updateCategory = async (id, data) => {
        try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            // alert('Error updating category');
            console.log('Error updating category');
        }
        const category = await response.json();
        // alert('Category updated successfully');
        return category;
    } catch (error) {
        // alert('Error updating category by ID');
        console.error('Error updating category by ID:', error);
        throw error;
    }
}

const addCategory = async (data) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            // alert('Error adding category');
            console.log('Error adding category');
        }
        const category = await response.json();
        // alert('Category added successfully');
        return category;
    } catch (error) {
        // alert('Error adding category');
        console.error('Error adding category:', error);
        throw error;
    }
}  

const deleteCategory = async (id) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            // alert('Error deleting category');
            console.log('Error deleting category');
        }
        // alert(`Category ${id} deleted successfully`);
    } catch (error) {
        // alert('Error deleting category');
        throw error;
    }
}

export { getAllCategories, getCategoryById, updateCategory, addCategory, deleteCategory };