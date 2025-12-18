"use client";

import {
    CircularProgressbarWithChildren,
    buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "../styles/globals.css";

export default function SaleProgress() {
    const percentage = 75.55;

    return (
        <div className="bg-white rounded-md p-4 shadow-md w-full max-w-sm h-full">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-md font-semibold text-gray-700">Sales Progress</h3>
                    <p className="text-sm text-[#667085]">This Quarter</p>
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
                            pathColor: "#f97316",
                            trailColor: "#f3f4f6",
                            strokeLinecap: "round",
                        })}
                    >
                        <div className="-mt-9 text-center">
                            <div className="text-2xl font-semibold text-gray-800">{percentage}%</div>
                            <div className="text-xs bg-green-100 text-green-600 rounded-full px-2 py-0.5 mt-1">
                                +10%
                            </div>
                        </div>
                    </CircularProgressbarWithChildren>
                </div>
            </div>

            <p className="text-center text-sm text-gray-500">
                You succeed earn <span className="font-semibold text-gray-800">$240</span> today,
                it's higher than yesterday
            </p>

            <div className="flex justify-between mt-4 text-center text-sm text-gray-700">
                <div className="flex-1 justify-center">
                    <div className="text-[#667085]">Target </div>
                    <div className="font-semibold text-xl">$20k <span className="text-[#F04438] text-2xl font-normal">↓</span></div>
                </div>
                <div className="flex-1 justify-center">
                    <div className="text-[#667085]">Revenue</div>
                    <div className="font-semibold text-lg">$16k <span className="text-[#0D894F] text-2xl font-normal">↑</span></div>
                </div>
                <div className="flex-1 justify-center">
                    <div className="text-[#667085]">Today</div>
                    <div className="font-semibold text-lg">$1.5k <span className="text-[#0D894F] text-2xl font-normal">↑</span></div>
                </div>
            </div>
        </div>
    );
}