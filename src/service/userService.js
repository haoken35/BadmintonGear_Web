const getUserById = async (id) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!res.ok) {
        console.log("Failed to fetch user data");
    }
    return res.json();
}

const createUser = async (data) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        console.log("Failed to update user data");
    }
    else {
        alert("User created successfully.");
    }
    return res.json();
}
export { getUserById, createUser };