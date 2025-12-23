const getDetailByOrderId = async (orderId) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orderdetails/${orderId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            console.log('Error fetching details for order ID:', orderId);
        }
        const orders = await response.json();
        return orders;
    } catch (error) {
        console.error('Error fetching order:', error);
        throw error;
    }
}

export { getDetailByOrderId };