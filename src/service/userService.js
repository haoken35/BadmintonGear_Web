const getUserById = async (id) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
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


const forgotPassword = async (email) =>{
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/forgotpass`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(email),
    });
    if (!res.ok) {
        console.log("Failed to update user data");
    }
    else {
        alert("Password reset link sent to your email");
    }
    return res.text();
}

const uploadAvatar = async (formData) => {
    const token = localStorage.getItem("loginToken");
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/imguser`, {
        method: "POST",
        headers: {
            "token": token,
        },
        body: formData,
    })
        .then(res => {
            if (!res.ok) {
                alert("Failed to upload avatar");
                console.log("Failed to upload avatar");
            }
            else {
                alert("Avatar uploaded successfully");
            }
            return res.json();
        });
}
const changeAvatar = async (id, formData) => {
    const token = localStorage.getItem("loginToken");
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/imguser/${id}`, {
        method: "PUT",
        headers: {
            "token": token,
        },
        body: formData,
    })
        .then(res => {
            if (!res.ok) {
                alert("Failed to upload avatar");
                console.log("Failed to upload avatar");
            }
            else {
                alert("Avatar changed successfully");
            }
            return res.json();
        });
}

const getAllUsersByRoleId = async (roleid) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users?roleid=${encodeURIComponent(roleid)}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) {
    console.log("Failed to fetch users");
    throw new Error("Failed to fetch users");
  }

  return res.json(); // array
};


export { getUserById, createUser, getAllUsers, updateUser, changePassword, getAllUsersByRoleId, uploadAvatar, changeAvatar, forgotPassword };