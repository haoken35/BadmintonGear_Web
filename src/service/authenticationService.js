const login = async (Username, Password) => {
    const loginData = {
        username: Username,
        password: Password,
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
    });

    if (!res.ok) {
        console.log("Login failed");
    }

    const data = await res.json();
    return data;
}

export { login };