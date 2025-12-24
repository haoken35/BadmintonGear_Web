const addFlashSale = async (flashsale) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/flashsales`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(flashsale),
        });

        if (!response.ok) {
            throw new Error('Error adding flash sale');
        }
        return await response.json();
    } catch (error) {
        console.error('Error adding flash sale:', error);
        throw error;
    }
}

const getFlashSales = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/flashsales`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching flash sales');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching flash sales:', error);
        throw error;
    }
}

const getFlashSaleById = async (id) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/flashsales/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching flash sale by ID');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching flash sale by ID:', error);
        throw error;
    }
}

const updateFlashSale = async (id, flashsale) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/flashsales/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(flashsale),
        });

        if (!response.ok) {
            throw new Error('Error updating flash sale');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating flash sale:', error);
        throw error;
    }
}

const deleteFlashSale = async (id) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/flashsales/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Error deleting flash sale');
        }
        return await response.text();
    } catch (error) {
        console.error('Error deleting flash sale:', error);
        throw error;
    }
}

export {
    addFlashSale,
    getFlashSales,
    getFlashSaleById,
    updateFlashSale,
    deleteFlashSale,
    getActiveFlashSales
}
