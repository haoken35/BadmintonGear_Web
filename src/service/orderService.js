export const getAllOrders = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    // ném lỗi để UI catch và set []
    throw new Error(`Fetch orders failed: ${response.status}`);
  }

  const json = await response.json();
  console.log("orders json:", json);
  // Chuẩn hóa: đảm bảo return là Array
  const orders =
    Array.isArray(json) ? json :
    Array.isArray(json?.orders) ? json.orders :
    Array.isArray(json?.data) ? json.data :
    Array.isArray(json?.data?.orders) ? json.data.orders :
    [];

  return orders;
};

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
const updateCategory = async (id, data) => {

}

export { getAllOrders, getOrderById, getOrderByUserId, updateCategory };