const getImports = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/grns`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            console.log('Error fetching imports');
        }
        const imports = await response.json();
        return imports;
    } catch (error) {
        console.error('Error fetching imports:', error);
        throw error;
    }
}

const getImportById = async (id) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/grns/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            console.log('Error fetching import by ID');
        }
        const importData = await response.json();
        return importData;
    } catch (error) {
        console.error('Error fetching import by ID:', error);
        throw error;
    }
}

const createImport = async (importData) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/grns`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(importData),
        });
        if (!response.ok) {
            console.log('Error creating import');
        }
        const newImport = await response.json();
        return newImport;
    } catch (error) {
        console.error('Error creating import:', error);
        throw error;
    }
}



export { getImports, getImportById, createImport };