"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  changePassword,
  updateUser,
  uploadAvatar as uploadAvatarAPI,
  changeAvatar as changeAvatarAPI,
  getUserById,
} from "@/service/userService";
import { useRouter } from "next/navigation";

export default function Account() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [updatedUser, setUpdatedUser] = useState(null);

  const [avatarButton, setAvatarButton] = useState(false);
  const [avatar, setAvatar] = useState(null); // preview URL (objectURL)
  const [avatarFile, setAvatarFile] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const persistUser = (nextUser) => {
    setUser(nextUser);
    localStorage.setItem("userData", JSON.stringify(nextUser));
  };

  // merge để không bị mất Imagesuser nếu API getUserById không include
  const mergeUserKeepingImagesuser = (freshUser) => {
    const storedRaw = localStorage.getItem("userData");
    const stored = storedRaw ? JSON.parse(storedRaw) : null;

    const merged = {
      ...(stored || {}),
      ...(freshUser || {}),
      Imagesuser: freshUser?.Imagesuser || stored?.Imagesuser,
      updatedAt: Date.now(),
    };

    return merged;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUser(u);
      setName(u.name || "");
      setEmail(u.email || "");
      setPhonenumber(u.phonenumber || "");

      // nếu đã có ảnh thì setAvatar = null để ưu tiên url thật
      // (avatar chỉ dùng cho preview)
      setAvatar(null);
    }
  }, []);

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  useEffect(() => {
    setUpdatedUser({ name, email, phonenumber });

    if (name === "" || phonenumber === "") {
      setError("Please fill in all fields");
    } else if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
    } else {
      setError("");
    }
  }, [name, email, phonenumber]);

  useEffect(() => {
    if (currentPassword !== "" && currentPassword !== localStorage.getItem("password")) {
      setError("Current password is incorrect");
    } else if (newPassword.length < 6 && newPassword !== "") {
      setError("New password must be at least 6 characters long");
    } else if (confirmPassword !== newPassword) {
      setError("Confirm password does not match new password");
    } else {
      setError("");
    }
  }, [currentPassword, newPassword, confirmPassword]);

  const handleCancel = () => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhonenumber(user.phonenumber || "");
    }
    setNewPassword("");
    setConfirmPassword("");
    setCurrentPassword("");
    setUpdatedUser(null);

    setAvatar(null);
    setAvatarFile(null);
    setAvatarButton(false);

    setError("");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatar(URL.createObjectURL(file)); // preview
    setAvatarFile(file);
  };

  // upload lần đầu: POST -> nhận {id, userid, url}
  const uploadAvatar = async () => {
    if (!avatarFile || !user?.id) return false;

    const formData = new FormData();
    formData.append("image", avatarFile);
    formData.append("userid", String(user.id));

    try {
      const response = await uploadAvatarAPI(formData);

      // response chuẩn theo ảnh postman: { id, userid, url, createdAt, updatedAt }
      if (!response?.id || !response?.url) {
        setError("Failed to upload avatar.");
        return false;
      }

      const stored = localStorage.getItem("userData");
      const base = stored ? JSON.parse(stored) : user;

      const nextUser = {
        ...base,
        Imagesuser: response, // lưu cả object để lần sau PUT dùng id
        updatedAt: Date.now(),
      };

      persistUser(nextUser);

      // clear preview/file để UI dùng url thật
      setAvatar(null);
      setAvatarFile(null);
      setAvatarButton(false);

      return true;
    } catch (err) {
      console.error("uploadAvatar error:", err);
      setError("Failed to upload avatar. Please try again.");
      return false;
    }
  };

  // update lần sau: PUT theo Imagesuser.id
  const changeAvatar = async () => {
  if (!avatarFile || !user?.id) return false;

  const formData = new FormData();
  formData.append("image", avatarFile);
  formData.append("userid", String(user.id)); // backend đang destructure userid từ body

  try {
    // PUT /imguser/:userid => truyền user.id
    const response = await changeAvatarAPI(user.id, formData);

    if (!response?.url) {
      setError("Failed to change avatar.");
      return false;
    }

    const stored = localStorage.getItem("userData");
    const base = stored ? JSON.parse(stored) : user;

    const nextUser = {
      ...base,
      Imagesuser: response, // backend trả object ảnh
      updatedAt: Date.now(),
    };

    persistUser(nextUser);

    setAvatar(null);
    setAvatarFile(null);
    setAvatarButton(false);
    return true;
  } catch (err) {
    console.error("changeAvatar error:", err);

    // OPTIONAL nhưng rất nên có: nếu backend trả 404 (chưa có record) thì fallback sang POST
    const msg = String(err?.message || "");
    if (msg.includes("404")) {
      return await uploadAvatar();
    }

    setError("Failed to change avatar. Please try again.");
    return false;
  }
};

  const handleSaveChanges = async () => {
    if (!user?.id) return;

    // 1) đổi password
    if (currentPassword && newPassword && confirmPassword && error === "") {
      const passwordData = {
        oldpass: currentPassword,
        newpass: newPassword,
        passagain: confirmPassword,
      };
      try {
        const response = await changePassword(passwordData);
        if (response === "Password changed successfully") {
          alert("Password changed successfully");
          localStorage.setItem("password", newPassword);
        } else {
          alert("Failed to change password. Please try again.");
          return;
        }
      } catch (err) {
        console.error(err);
        setError("Failed to change password");
        return;
      }
    }

    // 2) avatar: lần đầu POST, lần sau PUT
    if (avatarFile) {
      const hasImageRecord = Boolean(user?.Imagesuser?.id);
      const ok = hasImageRecord ? await changeAvatar() : await uploadAvatar();
      if (!ok) return;
    }

    // 3) update user info
    const hasProfileChanges =
      updatedUser &&
      (updatedUser.name !== user.name ||
        updatedUser.email !== user.email ||
        updatedUser.phonenumber !== user.phonenumber);

    if (hasProfileChanges) {
      try {
        const response = await updateUser(user.id, updatedUser);
        if (!response) {
          setError("Failed to update user information.");
          return;
        }
      } catch (err) {
        console.error(err);
        setError("Failed to update user information. Please try again.");
        return;
      }
    }

    // 4) refresh user (NHƯNG merge giữ Imagesuser để tránh mất avatar nếu backend không include)
    try {
      const fresh = await getUserById(user.id);
      const merged = mergeUserKeepingImagesuser(fresh);
      persistUser(merged);

      setName(merged.name || "");
      setEmail(merged.email || "");
      setPhonenumber(merged.phonenumber || "");
    } catch (e) {
      console.error("getUserById error:", e);
      // nếu refresh fail vẫn không sao vì localStorage đã có Imagesuser sau upload/change
    }

    // reset form
    setUpdatedUser(null);
    setAvatarFile(null);
    setAvatarButton(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };

  const isDisabled =
    !!error ||
    (!avatarFile &&
      (!updatedUser ||
        (updatedUser.name === user?.name &&
          updatedUser.email === user?.email &&
          updatedUser.phonenumber === user?.phonenumber)) &&
      currentPassword === "" &&
      newPassword === "" &&
      confirmPassword === "");

  // ưu tiên preview, nếu không có thì lấy url thật; kèm version để bust cache
  const avatarUrl =
    avatar ||
    (user?.Imagesuser?.url
      ? `${user.Imagesuser.url}?v=${user.updatedAt || ""}`
      : "/images/noavatar.png");

  return (
    <div className="px-2 py-5">
      <div>
        <h1 className="text-3xl font-bold">Account</h1>
        <div id="roadmap" className="flex items-center mt-2">
          <a className="text-(--primary)" href="/dashboard">
            Dashboard
          </a>
          <label className="ml-3 mr-3">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.59467 3.96967C6.30178 4.26256 6.30178 4.73744 6.59467 5.03033L10.5643 9L6.59467 12.9697C6.30178 13.2626 6.30178 13.7374 6.59467 14.0303C6.88756 14.3232 7.36244 14.3232 7.65533 14.0303L12.4205 9.26516C12.5669 9.11872 12.5669 8.88128 12.4205 8.73484L7.65533 3.96967C7.36244 3.67678 6.88756 3.67678 6.59467 3.96967Z"
                fill="#A3A9B6"
              />
            </svg>
          </label>
          <a className="text-(--muted)" href="/account">
            Account
          </a>
        </div>
      </div>

      <div className="grid grid-cols-[20%_1fr] gap-5 mt-10">
        <div className="flex flex-col gap-3 font-medium">
          <div className="max-w-sm mx-auto bg-(--surface) rounded-xl shadow-md overflow-hidden w-full p-1">
            <div className="bg-(--primary) h-35 w-full rounded-sm"></div>
            <div className="flex flex-col items-center -mt-20 gap-5 mb-10">
              <Image
                src={avatarUrl}
                alt="user"
                width={150}
                height={150}
                className="rounded-full border-4 border-white"
                onClick={() => setAvatarButton((prev) => !prev)}
              />

              {avatarButton && (
                <div className="flex flex-col items-center">
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    id="avatar-upload"
                    onChange={handleAvatarChange}
                  />
                  <button
                    className="bg-(--primary) text-white px-4 py-2 rounded-md cursor-pointer hover:bg-gray-100"
                    onClick={() => document.getElementById("avatar-upload").click()}
                  >
                    {user?.Imagesuser?.id ? "Change Avatar" : "Upload Avatar"}
                  </button>
                </div>
              )}

              <h2 className="mt-2 text-xl font-semibold text-(--text)">{user ? user.name : ""}</h2>
              <p className="text-md text-(--text2)">{user ? user.username : ""}</p>
              <p className="text-md text-(--text2)">{user && user.Role ? user.Role.name : ""}</p>
            </div>
          </div>
        </div>

        <div className='w-full bg-(--surface) pb-10'>
          <div className="mt-10 mx-auto w-4/5">
            <p className='text-(--primary) text-xl'>Edit Your Profile</p>

            <div className="flex flex-col gap-1 mt-5">
              <label className='text-(--text2)'>Name</label>
              <input
                type="text"
                className="bg-gray-100 rounded-xs p-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex w-full gap-5 mt-5 justify-between">
              <div className="flex flex-col gap-1 w-3/7">
                <label className='text-(--text2) '>Email</label>
                <input
                  type="text"
                  className='bg-(--surface2) rounded-xs p-2 text-(--text)'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1 w-3/7">
                <label className='text-(--text2)'>Phone Number</label>
                <input
                  type="text"
                  className='bg-(--surface2) rounded-xs p-2 text-(--text)'
                  value={phonenumber}
                  onChange={(e) => setPhonenumber(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-5">
              <label className='text-(--text2)'>Password Change</label>
              <input
                type="password"
                className='bg-(--surface2) rounded-xs p-2 text-(--text)'
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <input
                type="password"
                className='bg-(--surface2) rounded-xs p-2 text-(--text)'
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                className='bg-(--surface2) rounded-xs p-2 text-(--text)'
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div className="w-full text-left mt-5 text-sm text-red-500">{error}</div>
            </div>

            <div className="flex justify-end gap-5 items-center mt-5 mr-5">
              <button className="px-4 py-2 rounded-xs cursor-pointer" onClick={handleCancel}>
                Cancel
              </button>
              <button
                className={`bg-(--primary) text-white px-4 py-2 rounded-xs cursor-pointer${isDisabled ? " disabled bg-(--muted)" : ""}`}
                onClick={isDisabled ? undefined : handleSaveChanges}
                disabled={isDisabled}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
