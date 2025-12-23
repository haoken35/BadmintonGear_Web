const getCartByUserID = async (id) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carts/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            console.log('Error fetching carts');
        }
        const categories = await response.json();
        return categories;
    } catch (error) {
        console.error('Error fetching cart:', error);
        throw error;
    }
}