"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

// ==========================================
// ส่วนของการตั้งค่า Axios (รวมไว้ในไฟล์นี้เลยเพื่อให้พร้อมใช้งานทันที)
// ==========================================
const api = axios.create({
    baseURL: "http://localhost:3005", // ตรวจสอบให้ตรงกับ Port ของ Backend
    headers: {
        "Content-Type": "application/json",
    },
});

// ✅ Request Interceptor: ดักทุก Request เพื่อใส่ Token
api.interceptors.request.use(
    (config) => {
        // เช็คว่ารันใน Browser ไหม (เผื่อใช้ Next.js Server Side)
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (token) {
                // แนบ Header ตาม format ที่ Backend ต้องการ: "Bearer <token>"
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ✅ Response Interceptor: จัดการ Error และ Auto Logout
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // ถ้า Backend ตอบกลับมาว่า 401 (Unauthorized) แสดงว่า Token ผิดหรือหมดอายุ
        if (error.response?.status === 401) {
            if (typeof window !== "undefined") {
                // ลบ Token ทิ้งแล้วดีดไปหน้า Login
                localStorage.removeItem("token");
                localStorage.removeItem("currentUser");
                // window.location.href = '/login'; // เปิดบรรทัดนี้เมื่อมีหน้า Login แล้ว
            }
        }
        return Promise.reject(error);
    }
);
// ==========================================

// ประกาศ Type ของข้อมูลที่จะดึงมา
interface StudentData {
    firstName: string;
    lastName: string;
    studentCode: string;
    major: string;
    email: string;
}

const StudentProfile = () => {
    const [profile, setProfile] = useState<StudentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // ตรวจสอบว่ารันบน Browser หรือไม่
                if (typeof window === "undefined") return;

                const storedUser = localStorage.getItem("currentUser");

                if (storedUser) {
                    const user = JSON.parse(storedUser);

                    // ยิง API ด้วย Axios Instance ที่เราสร้างด้านบน
                    // ตัว Interceptor จะแนบ Token ไปให้เองอัตโนมัติ
                    const response = await api.get(
                        `/forms/my-forms/${user.id}`
                    );
                    const data = response.data;

                    if (data && data.length > 0) {
                        // เอาฟอร์มล่าสุดมาแสดง
                        const latestForm = data[data.length - 1];
                        setProfile({
                            firstName: latestForm.firstName || user.name,
                            lastName: latestForm.lastName || "",
                            studentCode: latestForm.studentCode || "-",
                            major: latestForm.major || "-",
                            email: latestForm.email || "-",
                        });
                    } else {
                        // กรณี User ใหม่ (ยังไม่มีฟอร์ม)
                        setProfile({
                            firstName: user.name,
                            lastName: "",
                            studentCode: "รอการบันทึกข้อมูล",
                            major: "รอการบันทึกข้อมูล",
                            email: "-",
                        });
                    }
                } else {
                    setError("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบ");
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError("ไม่สามารถดึงข้อมูลได้ หรือเซสชั่นหมดอายุ");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading)
        return (
            <div className="flex items-center gap-5 p-4 animate-pulse bg-white rounded-lg border border-gray-100">
                <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded"></div>
                </div>
            </div>
        );

    if (error)
        return (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm flex items-center gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                    />
                </svg>
                {error}
            </div>
        );

    return (
        <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 max-w-md">
            <div className="flex items-center gap-5">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-50 to-white overflow-hidden border-2 border-pink-100 shadow-sm flex items-center justify-center">
                        {/* Cartoon Avatar SVG */}
                        <svg
                            viewBox="0 0 100 100"
                            className="w-full h-full"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {/* Face circle */}
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="#FFE5B4"
                                stroke="#E8D5B7"
                                strokeWidth="2"
                            />

                            {/* Brown wavy hair */}
                            <path
                                d="M 20 35 Q 25 25, 30 30 Q 35 20, 40 28 Q 45 18, 50 30 Q 55 18, 60 28 Q 65 20, 70 30 Q 75 25, 80 35 L 85 20 L 85 15 L 15 15 L 15 20 Z"
                                fill="#8B4513"
                            />
                            <path
                                d="M 25 30 Q 30 25, 35 30 Q 40 22, 45 30 Q 50 22, 55 30 Q 60 25, 65 30"
                                stroke="#654321"
                                strokeWidth="1.5"
                                fill="none"
                            />

                            {/* Yellow shirt */}
                            <ellipse
                                cx="50"
                                cy="75"
                                rx="35"
                                ry="20"
                                fill="#FFD700"
                            />
                            <ellipse
                                cx="50"
                                cy="75"
                                rx="30"
                                ry="15"
                                fill="#FFEB3B"
                            />

                            {/* X eyes (distressed) */}
                            <g
                                stroke="#000"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            >
                                <line x1="38" y1="45" x2="42" y2="49" />
                                <line x1="42" y1="45" x2="38" y2="49" />
                                <line x1="58" y1="45" x2="62" y2="49" />
                                <line x1="62" y1="45" x2="58" y2="49" />
                            </g>

                            {/* Wide gritted-teeth mouth */}
                            <path
                                d="M 40 60 Q 45 65, 50 65 Q 55 65, 60 60"
                                stroke="#000"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                fill="none"
                            />
                            <line
                                x1="45"
                                y1="62"
                                x2="45"
                                y2="68"
                                stroke="#000"
                                strokeWidth="2"
                            />
                            <line
                                x1="50"
                                y1="62"
                                x2="50"
                                y2="68"
                                stroke="#000"
                                strokeWidth="2"
                            />
                            <line
                                x1="55"
                                y1="62"
                                x2="55"
                                y2="68"
                                stroke="#000"
                                strokeWidth="2"
                            />

                            {/* Speech bubble */}
                            <g opacity="0.8">
                                <ellipse
                                    cx="75"
                                    cy="30"
                                    rx="8"
                                    ry="6"
                                    fill="#fff"
                                    stroke="#ccc"
                                    strokeWidth="1"
                                />
                                <path
                                    d="M 70 33 L 68 38 L 72 35 Z"
                                    fill="#fff"
                                    stroke="#ccc"
                                    strokeWidth="1"
                                />
                                <text
                                    x="75"
                                    y="32"
                                    fontSize="6"
                                    textAnchor="middle"
                                    fill="#666"
                                >
                                    !
                                </text>
                            </g>
                        </svg>
                    </div>
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-gray-800 leading-tight">
                        {profile?.firstName} {profile?.lastName}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-1.5 font-medium">
                        <span className="bg-gray-100 px-2 py-1 rounded-md text-gray-600 font-mono tracking-tight border border-gray-200">
                            {profile?.studentCode}
                        </span>
                        <span className="text-gray-300">|</span>
                        <span className="text-pink-600">{profile?.major}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
