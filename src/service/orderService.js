const getAllOrders = async (req, res) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            console.log('Error fetching orders');
        }
        const orders = await response.json();
        return orders;
    } catch (error) {
        console.error('Error fetching order:', error);
        throw error;
    }
}

const getOrderById = async (id) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            console.log('Error fetching order by ID');
        }
        const order = await response.json();
        return order;
    } catch (error) {
        console.error('Error fetching order by ID:', error);
        throw error;
    }
}

const updateCategory = async (id, data) => {

}

export { getAllOrders, getOrderById, updateCategory };