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

const getAllUsers = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!res.ok) {
        console.log("Failed to fetch users data");
    }
    return res.json();
}

const updateUser = async (id, userData) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });
    if (!res.ok) {
        console.log("Failed to update user data");
    }
    else {
        alert("User updated successfully");
    }
    return res.json();
}

const changePassword = async(passwordData) => {
    const token = localStorage.getItem("loginToken");
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/changepass`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "token": token,
        },
        body: JSON.stringify(passwordData),
    })
    .then(res => {
        if (!res.ok) {
            console.log("Failed to change password");
        }
        return res.text();
    });
}

export { getUserById, createUser, getAllUsers, updateUser, changePassword };