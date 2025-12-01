"use client";
import Link from "next/link";
import "./css/landing.css";

const LandingPage = () => {
    return (
        <div className="relative isolate lg:px-8">
            {/* Background Effect */}
            <div
                className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 opacity-0 animate-[fade-in-page_0.8s_ease-out_forwards]"
                aria-hidden="true"
            >
                <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-36.125rem -translate-x-1/2 rotate-30deg bg-linear-to-tr from-pink-200 to-pink-600 opacity-30 sm:left-[calc(50%-30rem)] sm:w-72.1875rem background-polygon" />
            </div>

            {/* Content */}
            <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56 opacity-0 animate-[fade-in-page_0.8s_ease-out_forwards] delay-150">
                <div className="text-center">
                    {/* Heading */}
                    <h1 className="opacity-0 translate-y-5 animate-[fade-up_0.8s_ease-out_forwards] text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl bg-clip-text">
                        ระบบประเมินนักศึกษาฝึกงาน
                        <br />
                        <span className="text-pink-600">
                            ด้านการปฏิบัติงานและการปฏิบัติตน
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="opacity-0 translate-y-5 animate-[fade-up_0.8s_ease-out_forwards] delay-300 mt-6 text-lg leading-8 text-gray-600 max-w-xl mx-auto font-light">
                        แพลตฟอร์มกลางสำหรับการส่งข้อมูลผลงานของนักศึกษาฝึกงาน
                        <br />
                        และการประเมินผลโดยอาจารย์
                    </p>

                    {/* Buttons */}
                    <div className="opacity-0 translate-y-5 animate-[fade-up_0.8s_ease-out_forwards] delay-450 mt-10 flex items-center justify-center gap-x-6">
                        <Link
                            href="/role"
                            className="px-10 py-4 bg-pink-600 text-white rounded-full font-bold text-lg hover:bg-pink-700 transition shadow-lg shadow-pink-200 transform hover:scale-105"
                        >
                            เข้าสู่ระบบใช้งาน
                        </Link>

                        <Link
                            href="/manual"
                            className="px-10 py-4 bg-white text-pink-600 border-2 border-pink-100 rounded-full font-bold text-lg hover:border-pink-600 transition"
                        >
                            คู่มือการใช้งาน
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
