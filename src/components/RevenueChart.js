"use client";
import React, { useState, useEffect } from 'react'
import { getAllOrders } from '@/service/orderService';
import { getImports } from '@/service/importService';

import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Area,
    AreaChart,
    ResponsiveContainer,
} from "recharts";


// Hàm format số tiền
const formatMoney = (value) => value?.toLocaleString('vi-VN') + ' VND';

// Custom Tooltip component
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded shadow text-sm border">
                <div><b>{label}</b></div>
                {payload.map((entry, idx) => (
                    <div key={idx} style={{ color: entry.color }}>
                        {entry.name}: <b>{formatMoney(entry.value)}</b>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default function RevenueChart() {
    const [orders, setOrders] = useState([]);
    const [imports, setImports] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const orderRes = await getAllOrders();
            const importRes = await getImports();
            setOrders(orderRes || []);
            setImports(importRes || []);
        };
        fetchData();
    }, []);

    // Tạo mảng 7 ngày gần nhất
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - i);
        days.push(new Date(d));
    }

    // Gom revenue và cost theo từng ngày
    const data = days.map(date => {
        const dayStr = date.toLocaleDateString('en-GB');
        const revenue = orders
            .filter(order => {
                const created = new Date(order.createdAt);
                return created.toLocaleDateString('en-GB') === dayStr;
            })
            .reduce((sum, order) => sum + (Number(order.totalprice) || 0), 0);
        const cost = imports
            .filter(imp => {
                const created = new Date(imp.createdAt);
                return created.toLocaleDateString('en-GB') === dayStr;
            })
            .reduce((sum, imp) => sum + (Number(imp.totalcost || imp.totalprice) || 0), 0);
        return {
            name: dayStr,
            Revenue: revenue,
            Cost: cost,
        };
    });


    return (
        <div className="bg-white rounded-md p-6 shadow-md">
            <h2 className="text-lg font-semibold text-gray-800">Statistics</h2>
            <p className="text-sm text-[#667085] mb-4">Revenue and Sales</p>
            <div className="w-full h-76">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
                            </linearGradient>
                            <linearGradient id="colorSale" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ff8200" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#ff8200" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 13, fontWeight: 500 }}/>
                        <YAxis
                            tickFormatter={(value) => `${value / 1000000}M `}
                            tick={{ fontSize: 13, fontWeight: 500 }}
                            allowDecimals={false}
                            domain={[0, 'auto']}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend verticalAlign="top" height={36} />
                        <Area
                            type="monotone"
                            dataKey="Revenue"
                            stroke="#22c55e"
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                        />
                        <Area
                            type="monotone"
                            dataKey="Cost"
                            stroke="#ff8200"
                            fillOpacity={1}
                            fill="url(#colorSale)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}