export async function createFlashSaleDetail(flashSaleDetail) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/flashsaledetails`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(flashSaleDetail),
        });
        return response.ok;
    }
    catch (error) {
        console.error('Error creating flash sale detail:', error);
        return false;
    }
}

export async function getFlashSaleDetailsByFlashSaleId(flashSaleId, language) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/flashsaledetails/${flashSaleId}?lang=${language}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            throw new Error('Error fetching flash sale details by flash sale ID');
        }
        return await response.json();
    }
    catch (error) {
        console.error('Error fetching flash sale details by flash sale ID:', error);
        throw error;
    }
}

export async function updateFlashSaleDetail(flashSaleDetailId, flashSaleDetail) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/flashsaledetails/${flashSaleDetailId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(flashSaleDetail),
        });
        return response.ok;
    }
    catch (error) {
        console.error('Error updating flash sale detail:', error);
        return false;
    }
}