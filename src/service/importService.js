const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/grns`;

const getImports = async () => {
  try {
    const response = await fetch(API_BASE, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const raw = await response.text();

    if (!response.ok) {
      console.error("Error fetching imports:", response.status, raw);
      throw new Error(`getImports failed: ${response.status}`);
    }

    const imports = raw ? JSON.parse(raw) : [];
    console.log("Imports fetched successfully:", imports);
    return imports;
  } catch (error) {
    console.error("Error fetching imports:", error);
    console.log("API =", process.env.NEXT_PUBLIC_API_URL);
    throw error;
  }
};

const getImportById = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const raw = await response.text();

    if (!response.ok) {
      console.error("Error fetching import by ID:", response.status, raw);
      throw new Error(`getImportById failed: ${response.status}`);
    }

    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("Error fetching import by ID:", error);
    throw error;
  }
};

const createImport = async (importData) => {
  try {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(importData),
    });

    const raw = await response.text();

    if (!response.ok) {
      console.error("Error creating import:", response.status, raw);
      throw new Error(`createImport failed: ${response.status}`);
    }

    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("Error creating import:", error);
    throw error;
  }
};

export { getImports, getImportById, createImport };
