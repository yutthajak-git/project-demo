"use client";
import Link from "next/link";
import { GraduationCap, School, ArrowRight, ArrowLeft } from "lucide-react";
import "./css/role.css";

const Role = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full role-container">
            <div
                id="role-select-section"
                className="fade-in w-full py-6" // ลด padding ลงเล็กน้อยเพราะเราจัดกลางจอแล้ว
            >
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800">
                            เลือกสถานะเพื่อเข้าสู่ระบบ
                        </h2>
                        <p className="text-gray-500 mt-2">
                            กรุณาเลือกประเภทผู้ใช้งานของคุณ
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Card 1: นักศึกษา */}
                        <Link
                            href="/login/student"
                            className="group bg-white rounded-3xl p-8 shadow-xl border-2 border-transparent hover:border-pink-500 transition-all duration-300 text-center relative overflow-hidden block hover:-translate-y-1 hover:shadow-2xl"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-pink-500"></div>
                            <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-pink-600 transition-colors duration-300">
                                <GraduationCap
                                    size={40}
                                    className="text-pink-600 group-hover:text-white transition-colors duration-300"
                                />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                นักศึกษา
                            </h3>
                            <p className="text-gray-500 mb-6">
                                สำหรับกรอกข้อมูลแบบรายงาน
                                <br />
                                และส่งข้อมูลผลงาน
                            </p>
                            <span className="text-pink-600 font-semibold group-hover:underline flex items-center justify-center gap-2">
                                เข้าสู่ระบบนักศึกษา
                                <ArrowRight size={16} />
                            </span>
                        </Link>

                        {/* Card 2: อาจารย์ */}
                        <Link
                            href="/login/teacher"
                            className="group bg-white rounded-3xl p-8 shadow-xl border-2 border-transparent hover:border-orange-500 transition-all duration-300 text-center relative overflow-hidden block hover:-translate-y-1 hover:shadow-2xl"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-orange-500"></div>
                            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-500 transition-colors duration-300">
                                <School
                                    size={40}
                                    className="text-orange-500 group-hover:text-white transition-colors duration-300"
                                />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                อาจารย์ / ผู้ประเมิน
                            </h3>
                            <p className="text-gray-500 mb-6">
                                สำหรับอาจารย์นิเทศก์ และครูพี่เลี้ยง
                                <br />
                                เพื่อประเมินผลนักศึกษา
                            </p>
                            <span className="text-orange-500 font-semibold group-hover:underline flex items-center justify-center gap-2">
                                เข้าสู่ระบบผู้ประเมิน
                                <ArrowRight size={16} />
                            </span>
                        </Link>
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            href="/"
                            className="text-gray-400 hover:text-gray-600 transition flex items-center justify-center gap-2 hover:scale-105"
                        >
                            <ArrowLeft size={16} />
                            กลับหน้าหลัก
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Role;
