const addPromotion = async (promotion) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promotions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(promotion),
        });

        return await response.json();
    } catch (error) {
        console.error('Error adding promotion:', error);
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

        return await response.json();
    } catch (error) {
        console.error('Error fetching promotions:', error);
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
        return await response.json();
    } catch (error) {
        console.error('Error fetching promotion by ID:', error);
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
        return await response.json();
    } catch (error) {
        console.error('Error updating promotion:', error);
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
        return await response.text();
    } catch (error) {
        console.error('Error deleting promotion:', error);
    }
}

export {
    addPromotion,
    getPromotions,
    getPromotionById,
    updatePromotion,
    deletePromotion
};