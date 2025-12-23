const getAllProducts = async () =>{
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            alert('Failed to fetch products');
        }
        const products = await response.json();
        console.log('Products fetched successfully:', products);
        return products;
    } catch (error) {
        alert('Error fetching products:', error);
    }
}

const getProductById = async (id) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            alert('Failed to fetch product by ID');
        }
        const product = await response.json();
        return product;
    } catch (error) {
        alert('Error fetching product by ID:', error);
    }
}

const updateProduct = async (id, data) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            alert('Error updating product');
        }
        const product = await response.json();
        alert('Product updated successfully');
        return product;
    } catch (error) {
        alert('Error updating product by ID');
        console.error('Error updating product by ID:', error);
    }
}

const addProduct = async (data) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            alert('Error adding product');
        }
        const product = await response.json();
        alert('Product added successfully');
        return product;
    } catch (error) {
        alert('Error adding product:', error);
    }
}

const deleteProduct = async (id) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            alert('Error deleting product');
        }
        alert('Product deleted successfully');
    } catch (error) {
        alert('Error deleting product:', error);
    }
}

const uploadImage = async (uploadData) => {
    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/imgproduct/`, {
            method: 'POST',
            body: uploadData
        });
        if (!response.ok) {
            alert('Error updating product images');
        }
        const product = await response.json();
        alert('Product images updated successfully');
        return product;
    }
    catch (error) {
        alert('Error updating product images:', error);
    }
}

const deleteImage = async (id) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/imgproduct/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            alert('Error deleting product image');
        }
        alert('Product image deleted successfully');
    } catch (error) {
        alert('Error deleting product image:', error);
    }
}

export {
    getAllProducts,
    getProductById,
    updateProduct,
    addProduct,
    deleteProduct,
    uploadImage,
    deleteImage
}