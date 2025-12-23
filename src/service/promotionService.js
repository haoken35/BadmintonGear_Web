const addPromotion = async (promotion) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promotions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(promotion),
        });

        if (!response.ok) {
            alert('Error adding promotion');
        }
        alert('Promotion added successfully');
        return await response.json();
    } catch (error) {
        console.error('Error adding promotion:', error);
        alert('Error adding promotion');
    }
}

const getPromotions = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promotions`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            alert('Error fetching promotions');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching promotions:', error);
        alert('Error fetching promotions');
    }
}

const getPromotionById = async (id) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promotions/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            alert('Error fetching promotion by ID');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching promotion by ID:', error);
        alert('Error fetching promotion by ID');
    }
}

const updatePromotion = async (id, promotion) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promotions/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(promotion),
        });

        if (!response.ok) {
            alert('Error updating promotion');
        }
        alert('Promotion updated successfully');
        return await response.json();
    } catch (error) {
        console.error('Error updating promotion:', error);
        alert('Error updating promotion');
    }
}

const deletePromotion = async (id) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promotions/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            alert('Error deleting promotion');
        }
        alert('Promotion deleted successfully');
        return await response.text();
    } catch (error) {
        console.error('Error deleting promotion:', error);
        alert('Error deleting promotion');
    }
}

export {
    addPromotion,
    getPromotions,
    getPromotionById,
    updatePromotion,
    deletePromotion
};