"use client";
import { use, useEffect, useState } from "react";
import { getAllOrders } from "@/service/orderService";

import {
    CircularProgressbarWithChildren,
    buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "../styles/globals.css";

export default function SaleProgress() {
    const [percentage, setPercentage] = useState(0);
    const target = 50000000;
    const [revenue, setRevenue] = useState(0);
    const [revenueToday, setRevenueToday] = useState(0);
    const [todayPercentage, setTodayPercentage] = useState(0);


    useEffect(() => {
        const fetchRevenue = async () => {
            const orders = await getAllOrders();
            if (!orders) return;
            // Lấy ngày đầu tháng và hôm nay
            const now = new Date();
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
            // Tính tổng revenue từ đầu tháng đến hôm nay
            const total = orders
                .filter(order => {
                    const created = new Date(order.createdAt);
                    return created >= firstDay && created <= now;
                })
                .reduce((sum, order) => sum + (Number(order.totalprice) || 0), 0);
            setRevenue(total);

            now.setHours(0, 0, 0, 0);
            const tomorrow = new Date(now);
            tomorrow.setDate(now.getDate() + 1);
            // Tính tổng revenue trong hôm nay
            const totalToday = orders
                .filter(order => {
                    const created = new Date(order.createdAt);
                    return created >= now && created < tomorrow;
                })
                .reduce((sum, order) => sum + (Number(order.totalprice) || 0), 0);
            setRevenueToday(totalToday);
        };
        fetchRevenue();
    }, []);

    useEffect(() => {
        if (revenue === 0) {
            setTodayPercentage(0);
        } else {
            const calculatedTodayPercentage = Math.min(
                Math.round((revenueToday / (target / 30)) * 100),
                100
            );
            setTodayPercentage(calculatedTodayPercentage);
        }
    }, [revenueToday]);

    useEffect(() => {
        if (revenue === 0) {
            setPercentage(0);
        } else {
            const calculatedPercentage = Math.min(
                Math.round((revenue / target) * 100),
                100
            );
            setPercentage(calculatedPercentage);
        }
    }, [revenue]);

    return (
        <div className="bg-(--surface) rounded-md p-4 shadow-md w-full max-w-sm h-full">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-md font-semibold text-(--text2)">Sales Progress</h3>
                    <p className="text-sm text-(--muted)">This Month</p>
                </div>
                {/* <button className="text-gray-400 text-xl font-bold">⋮</button> */}
            </div>

            {/* Half circle */}
            <div className="w-full flex justify-center mt-5 mb-10">
                <div className="relative w-full h-0 pb-[50%]" >
                    <CircularProgressbarWithChildren
                        value={percentage}
                        strokeWidth={7}
                        circleRatio={0.5}
                        styles={buildStyles({
                            rotation: 0.75, // start from left
                            pathColor: "var(--primary)",
                            trailColor: "#f3f4f6",
                            strokeLinecap: "round",
                        })}
                    >
                        <div className="-mt-9 text-center">
                            <div className="text-2xl font-semibold text-(--text2)">{percentage}%</div>
                            <div className={`text-xs  rounded-full px-2 py-0.5 mt-1 ${todayPercentage > 0 ? "bg-green-100 text-green-600" :
                                (todayPercentage < 0 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600")}`}>
                                {todayPercentage > 0 ? "+" : (todayPercentage < 0 ? "-" : "")}{todayPercentage}%
                            </div>
                        </div>
                    </CircularProgressbarWithChildren>
                </div>
            </div>

            <p className="text-center text-sm text-(--text2)">
                You succeed earn <span className="font-semibold text-(--text2)">{Number(revenueToday).toLocaleString()} VND</span> today
            </p>

            <div className="flex justify-between mt-4 text-center text-sm text-(--text2)">
                <div className="flex-1 justify-center">
                    <div className="text-(--muted)">Target </div>
                    <div className="font-semibold text-xl">{Number(target / 1000000).toLocaleString()}M VND </div>
                </div>
                <div className="flex-1 justify-center">
                    <div className="text-(--muted)">Revenue</div>
                    <div className="font-semibold text-lg">{Number(revenue / 1000000).toLocaleString()}M VND </div>
                </div>
                <div className="flex-1 justify-center">
                    <div className="text-(--muted)">Today</div>
                    <div className="font-semibold text-lg">{Number(revenueToday).toLocaleString()} VND</div>
                </div>
            </div>
        </div>
    );
}