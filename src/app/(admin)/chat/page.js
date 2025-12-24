"use client"
import { useState, useRef, useEffect } from "react";
import { getSocket } from "@/libs/socket";

export default function ChatBox() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [chatRooms, setChatRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [adminId, setAdminId] = useState(null);
    const messagesEndRef = useRef(null);

    // Lấy thông tin admin từ localStorage
    useEffect(() => {
        try {
            const raw = localStorage.getItem("userData");
            const parsed = raw ? JSON.parse(raw) : null;
            if (parsed?.id) setAdminId(parsed.id);
        } catch (e) {
            console.error("[chat:admin] failed to parse userData:", e);
        }
    }, []);

    // Lấy danh sách chat rooms
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`)
            .then(res => res.json())
            .then(data => {
                setChatRooms(data);
            })
            .catch(err => console.error(err));
    }, []);

    // Load tin nhắn khi chọn room
    useEffect(() => {
        if (!selectedRoom) return;

        const socket = getSocket();
        if (socket) {
            socket.emit("admin_join_room", selectedRoom.room);
        } else {
            console.warn("[chat:admin] socket unavailable when joining room");
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${selectedRoom.room}`)
            .then(res => res.json())
            .then(data => {
                const mapped = data.map(item => ({
                    from: item.senderrole === "user" ? "user" : "admin",
                    text: item.content,
                }));
                setMessages(mapped);
            })
            .catch(err => {
                console.error(err);
            });
    }, [selectedRoom]);

    // Lắng nghe tin nhắn mới từ user/admin
    useEffect(() => {
        if (!selectedRoom) return;

        const socket = getSocket();
        if (!socket) {
            console.log("Hệ thống không sẵn sàng. Thử lại sau.");
            return;
        }

        const handleReceiveMessage = (data) => {
            const incomingRoom = data?.room ?? data?.roomId ?? data?.room_id;
            // Bỏ kiểm tra room vì backend có thể không gửi room field
            if (incomingRoom && incomingRoom !== selectedRoom.room) return;

            const incomingRole = data?.senderrole ?? data?.senderRole ?? data?.role;
            const incomingText = data?.content ?? data?.message ?? data?.text ?? "";
            const incomingSenderId = data?.senderid ?? data?.senderId ?? data?.userid ?? data?.userId;

            if (!incomingText) return;

            setMessages(prev => [
                ...prev,
                {
                    from: incomingRole === "user" ? "user" : "admin",
                    text: incomingText,
                    senderid: incomingSenderId
                }
            ]);
        };

        socket.on("receive_message", handleReceiveMessage);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
        };
    }, [selectedRoom]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!message.trim() || !selectedRoom) return;

        const socket = getSocket();
        if (!socket) return;

        const outgoingText = message.trim();
        setMessage("");
        socket.emit("send_message", {
            room: selectedRoom.room,
            senderid: adminId,
            senderrole: "admin",
            content: outgoingText,
            productid: null,
        });
    };

    return (
        <div className='px-2 py-5'>

            <div className="mt-5 flex gap-4 h-[80vh] w-[80%] mx-auto">
                {/* Main chat area */}
                <div className="flex-1 bg-(--surface) rounded-md flex flex-col">
                    {selectedRoom ? (
                        <>
                            {/* Chat header */}
                            <div className="px-6 py-4 border-b border-(--border)">
                                <h3 className="font-semibold text-(--text)">
                                    {`Chat with ${selectedRoom.sender.name}`}
                                </h3>
                            </div>

                            {/* Lịch sử chat */}
                            <div className="flex-1 overflow-y-auto px-6 py-4 gap-3">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`mb-4 flex ${msg.from === "admin" ? "justify-end" : "justify-start"}`}>
                                        <div className={`px-3 py-2 rounded-full max-w-md ${msg.from === "admin" ? "bg-(--primary) text-white rounded-br-none"
                                            : "bg-(--surface2) text-(--text) rounded-bl-none"}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Thanh nhập tin nhắn */}
                            <div className="w-auto flex justify-between rounded-full shadow-xl border border-(--border) mx-6 mb-6 px-4 py-4 bg-(--surface2)">
                                <input
                                    type="text"
                                    placeholder={`Write a message...`}
                                    className="w-full outline-none bg-transparent text-(--text)"
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && handleSend()}
                                />
                                <button onClick={handleSend}>
                                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18.0693 8.51001L9.50929 4.23001C3.75929 1.35001 1.39929 3.71001 4.27929 9.46001L5.14929 11.2C5.39929 11.71 5.39929 12.3 5.14929 12.81L4.27929 14.54C1.39929 20.29 3.74929 22.65 9.50929 19.77L18.0693 15.49C21.9093 13.57 21.9093 10.43 18.0693 8.51001ZM14.8393 12.75H9.43929C9.02929 12.75 8.68929 12.41 8.68929 12C8.68929 11.59 9.02929 11.25 9.43929 11.25H14.8393C15.2493 11.25 15.5893 11.59 15.5893 12C15.5893 12.41 15.2493 12.75 14.8393 12.75Z" fill="var(--primary)" />
                                    </svg>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-(--text2)">
                            {`Select a chat to start messaging`}
                        </div>
                    )}
                </div>

                {/* Sidebar - Danh sách chat rooms */}
                <div className="w-80 bg-(--surface) rounded-md flex flex-col">
                    <div className="px-4 py-4 border-b border-(--border)">
                        <h3 className="font-semibold text-(--text)">Chat List</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {chatRooms.length === 0 ? (
                            <div className="p-4 text-center text-(--text2)">
                                {`No chats available`}
                            </div>
                        ) : (
                            chatRooms.map((room, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedRoom(room)}
                                    className={`px-4 py-3 border-b border-(--border) cursor-pointer hover:bg-(--surface2) transition ${selectedRoom?.room === room.room ? 'bg-(--surface2)' : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-(--primary) flex items-center justify-center text-white font-semibold">
                                            {room.username ? room.username.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-(--text) truncate">
                                                {room.sender.name || `User #${room.userid}`}
                                            </div>
                                            <div className="text-sm text-(--text2) truncate">
                                                {room.lastmessage || `Start a conversation`}
                                            </div>
                                        </div>
                                        {room.unreadcount > 0 && (
                                            <div className="w-6 h-6 rounded-full bg-(--primary) text-white text-xs flex items-center justify-center">
                                                {room.unreadcount}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}