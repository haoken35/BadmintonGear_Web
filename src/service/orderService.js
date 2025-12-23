const getAllOrders = async () => {
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

const getOrderByUserId = async (userId) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            console.log('Error fetching order by user ID');
        }
        const order = await response.json();
        return order;
    } catch (error) {
        console.error('Error fetching order by user ID:', error);
        throw error;
    }
}
const updateOrder = async (id, status) => {
    const data = {};
    const now = new Date();
    switch (status) {
        case 1:
            data.process = now.toISOString();
            break;
        case 2:
            data.shipping = now.toISOString();
            break;
        case 3:
            data.delivered = now.toISOString();
            data.status = 1;
            break;
        case -1:
            data.status = -1;
            break;
        default:
            throw new Error('Invalid status');
    }
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            console.log('Error updating order');
        }
        const updatedOrder = await response.json();
        alert('Order updated successfully');
        return updatedOrder;
    } catch (error) {
        console.error('Error updating order:', error);
        throw error;
    }
}

const getRecentOrders = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            console.log('Error fetching recent orders');
        }
        const orders = await response.json();
        const sorted = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return sorted.slice(0, 20);
    } catch (error) {
        console.error('Error fetching recent orders:', error);
        throw error;
    }
}

export { getAllOrders, getOrderById, getOrderByUserId, updateOrder, getRecentOrders };