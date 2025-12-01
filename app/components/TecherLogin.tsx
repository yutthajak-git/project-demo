"use client";

import { useState } from "react";
import {
    GraduationCap,
    CreditCard,
    Lock,
    ArrowLeft,
    Loader2,
    AlertCircle,
} from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TecherLogin = () => {
    const router = useRouter();

    // 1. เพิ่ม State สำหรับเก็บค่าจาก Form
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // 2. ฟังก์ชัน Login เชื่อมต่อหลังบ้าน
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(""); // เคลียร์ Error เดิม

        // Trim whitespace from inputs
        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();

        // Validate inputs
        if (!trimmedUsername || !trimmedPassword) {
            setError("กรุณากรอกชื่อผู้ใช้งานและรหัสผ่าน");
            setIsLoading(false);
            return;
        }

        try {
            // ยิง API ไปที่หลังบ้าน (Port 3005)
            // สามารถใช้ environment variable: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005"
            const apiUrl =
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";

            // ✅ ส่ง request ไป login พร้อมระบุ Role เป็น "TEACHER"
            const response = await axios.post(`${apiUrl}/auth/login`, {
                username: trimmedUsername,
                password: trimmedPassword,
                role: "TEACHER", // ✨ เพิ่มบรรทัดนี้: บังคับว่าฉันต้องการ Login เข้ามาในฐานะ Teacher นะ
            });

            const data = response.data;

            if (data.success) {
                // ✅ Login สำเร็จ: บันทึกข้อมูลสำคัญลงเครื่อง
                localStorage.setItem("token", data.token); // บัตรผ่าน (JWT)
                localStorage.setItem("currentUser", JSON.stringify(data.user)); // ข้อมูลเบื้องต้น (ID, Name)

                // ดีดไปหน้า Profile ทันที
                router.push("/profile/assessor");
            }
        } catch (err) {
            console.error("Login Error:", err);
            // แสดง Error message จากหลังบ้าน หรือข้อความ default
            let msg = "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง";
            if (axios.isAxiosError(err)) {
                // Handle network errors
                if (err.code === "ECONNREFUSED" || err.code === "ERR_NETWORK") {
                    msg =
                        "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่อ";
                } else if (err.response) {
                    // ✅ Server responded with error status
                    const status = err.response.status;

                    // ตรวจสอบว่ามี message จาก backend หรือไม่
                    if (err.response.data?.message) {
                        msg = err.response.data.message;
                    } else {
                        // ถ้าไม่มี message ให้แสดงข้อความตาม status code
                        const statusMessages: Record<number, string> = {
                            401: "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง",
                            403: "คุณไม่มีสิทธิ์เข้าถึงระบบ กรุณาติดต่อผู้ดูแลระบบ",
                            500: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้งในภายหลัง",
                        };

                        msg =
                            statusMessages[status] ||
                            "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
                    }
                } else {
                    msg = err.message || msg;
                }
            } else if (err instanceof Error) {
                msg = err.message;
            }
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* แก้ไข: ลบ jsx prop ออกเพื่อให้เป็น style tag ปกติ */}
            <style>{`
                .teacher-login-container {
                    background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
                    min-height: 100vh;
                }
                .fade-in {
                    animation: fadeIn 0.6s ease-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="flex flex-col items-center justify-center w-full p-4 teacher-login-container">
                <div className="fade-in w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                        {/* Header สีส้ม */}
                        <div className="bg-orange-600 px-8 py-8 text-white relative overflow-hidden">
                            {/* Decorative Circle */}
                            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
                            <div className="absolute -left-6 -bottom-6 w-20 h-20 bg-black opacity-5 rounded-full blur-xl"></div>

                            <div className="relative z-10">
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    <GraduationCap
                                        size={32}
                                        className="text-orange-100"
                                    />
                                    อาจารย์ / ผู้ประเมิน
                                </h2>
                                <p className="text-orange-100 text-sm mt-2 ml-11 opacity-90">
                                    Evaluator Authentication
                                </p>
                            </div>
                        </div>

                        {/* Form Body */}
                        <div className="p-8 pt-10">
                            {/* แสดง Error Message ถ้ามี */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-3 rounded-r-lg animate-pulse">
                                    <AlertCircle size={20} />
                                    <span className="text-sm font-medium">
                                        {error}
                                    </span>
                                </div>
                            )}

                            <form className="space-y-6" onSubmit={handleLogin}>
                                {/* Input: Username */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                                        Username / Email
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-orange-600 text-gray-400">
                                            <CreditCard size={20} />
                                        </div>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => {
                                                setUsername(e.target.value);
                                                setError(""); // Clear error when user types
                                            }}
                                            placeholder="Username"
                                            className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all bg-gray-50/50 focus:bg-white text-gray-800 placeholder-gray-400"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Input: รหัสผ่าน */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                                        Password
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-orange-600 text-gray-400">
                                            <Lock size={20} />
                                        </div>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                setError(""); // Clear error when user types
                                            }}
                                            placeholder="••••••••"
                                            className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all bg-gray-50/50 focus:bg-white text-gray-800 placeholder-gray-400"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-200 transition-all transform active:scale-[0.98] mt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2
                                                size={24}
                                                className="animate-spin"
                                            />
                                            กำลังเข้าสู่ระบบ...
                                        </>
                                    ) : (
                                        "เข้าสู่ระบบ"
                                    )}
                                </button>
                            </form>

                            {/* Footer Links */}
                            <div className="mt-8 text-center">
                                <Link
                                    href="/role"
                                    className="inline-flex items-center text-sm text-gray-500 hover:text-orange-600 transition-colors gap-2 font-medium"
                                >
                                    <ArrowLeft size={16} />
                                    เลือกประเภทผู้ใช้งานใหม่
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TecherLogin;
