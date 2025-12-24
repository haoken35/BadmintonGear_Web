const getDetailByImportId = async (grnId) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/grndetails/${grnId}?lang=vi`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            console.log('Error fetching import details');
        }
        const importDetails = await response.json();
        return importDetails;
    } catch (error) {
        console.error('Error fetching import details:', error);
        throw error;
    }
}

const createDetail = async (detailData) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/grndetails`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(detailData),
        });
        if (!response.ok) {
            console.log('Error creating import detail');
        }
        const newDetail = await response.json();
        return newDetail;
    } catch (error) {
        console.error('Error creating import detail:', error);
        throw error;
    }
}


export { getDetailByImportId, createDetail }