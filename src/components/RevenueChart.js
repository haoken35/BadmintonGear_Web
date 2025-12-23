"use client";
import React from 'react'

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Area,
    AreaChart,
    ResponsiveContainer,
} from "recharts";

export default function RevenueChart() {
    const data = [
        { name: "Jan", Revenue: 880, Cost: 770 },
        { name: "Feb", Revenue: 790, Cost: 660 },
        { name: "Mar", Revenue: 950, Cost: 890 },
        { name: "Apr", Revenue: 870, Cost: 1100 },
        { name: "May", Revenue: 930, Cost: 720 },
        { name: "Jun", Revenue: 1020, Cost: 800 },
        { name: "Jul", Revenue: 980, Cost: 850 },
        { name: "Aug", Revenue: 1200, Cost: 820 },
        { name: "Sep", Revenue: 1350, Cost: 880 },
        { name: "Oct", Revenue: 770, Cost: 740 },
        { name: "Nov", Revenue: 900, Cost: 1120 },
        { name: "Dec", Revenue: 850, Cost: 1000 },
    ];

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
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                        <Tooltip />
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