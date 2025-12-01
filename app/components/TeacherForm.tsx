"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
    Users,
    LogOut,
    ClipboardList,
    CheckCircle2,
    ChevronDown,
    Send,
    MapPin,
    BookOpen,
    Phone,
    Mail,
    User,
    History,
    Star,
    Clock,
} from "lucide-react";

// Mock router (ใช้จริงให้ใช้ import { useRouter } from 'next/navigation')
const router = {
    push: (path: string) => {
        window.location.href = path;
    },
};

interface Student {
    id: string;
    name: string;
    username: string;
}

interface TeacherProfile {
    id: string;
    name: string;
    username?: string;
    email?: string;
}

interface Evaluation {
    id: string;
    score: number;
    feedback: string | null;
    createdAt: string;
}

interface InternshipForm {
    id: string;
    status: string;
    createdAt: string;
    updatedAt?: string; // เพิ่ม updatedAt
    student: Student;
    evaluations?: Evaluation[]; // เพิ่มรับข้อมูลการประเมิน

    // ข้อมูลจาก StudentForm
    studentCode?: string;
    prefix?: string;
    firstName?: string;
    lastName?: string;
    major?: string;
    email?: string;
    phone?: string;

    schoolName?: string;
    province?: string;
    district?: string;
    affiliation?: string;
    schoolSize?: string;

    subjectGroup?: string;
    subjectName?: string;
    majorRelation?: string;

    companyName?: string;
    topic?: string;
}

const TeacherDashboard = () => {
    // State
    const [activeTab, setActiveTab] = useState<"pending" | "history">(
        "pending"
    );
    const [pendingForms, setPendingForms] = useState<InternshipForm[]>([]);
    const [historyForms, setHistoryForms] = useState<InternshipForm[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(
        null
    );

    const [expandedFormId, setExpandedFormId] = useState<string | null>(null);
    const [score, setScore] = useState<number | "">("");
    const [feedback, setFeedback] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initial Load
    useEffect(() => {
        const userStr = localStorage.getItem("currentUser");
        const token = localStorage.getItem("token");

        if (!userStr || !token) {
            router.push("/role");
            return;
        }

        const user = JSON.parse(userStr);
        setTeacherProfile(user);
        fetchData(user.id);
    }, []);

    // Fetch Data Function (เรียกทั้ง 2 แบบ)
    const fetchData = async (teacherId: string) => {
        setIsLoading(true);
        const apiUrl =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";

        try {
            const [pendingRes, historyRes] = await Promise.all([
                axios.get(`${apiUrl}/teacher/pending-forms/${teacherId}`),
                axios.get(`${apiUrl}/teacher/history-forms/${teacherId}`),
            ]);

            if (pendingRes.data.success) setPendingForms(pendingRes.data.data);
            if (historyRes.data.success) setHistoryForms(historyRes.data.data);
        } catch (error) {
            console.error("Failed to fetch forms", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        router.push("/role");
    };

    const toggleExpand = (id: string) => {
        if (expandedFormId === id) {
            setExpandedFormId(null);
        } else {
            setExpandedFormId(id);
            setScore("");
            setFeedback("");
        }
    };

    const handleSubmitEvaluation = async (formId: string) => {
        if (score === "" || score < 1 || score > 5) {
            alert("กรุณาเลือกคะแนนให้ถูกต้อง (1-5)");
            return;
        }

        if (!teacherProfile) return;

        setIsSubmitting(true);
        try {
            const apiUrl =
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";
            await axios.post(`${apiUrl}/teacher/evaluate`, {
                formId,
                teacherId: teacherProfile.id,
                score: Number(score),
                feedback: feedback,
            });

            alert("บันทึกผลการประเมินเรียบร้อยแล้ว");

            // Refresh Data
            fetchData(teacherProfile.id);
            setActiveTab("history"); // ย้ายไปหน้า History อัตโนมัติเพื่อให้เห็นผลลัพธ์
            setExpandedFormId(null);
        } catch (error) {
            console.error("Evaluation failed", error);
            alert("เกิดข้อผิดพลาดในการบันทึกผล");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper เพื่อเลือกแสดงข้อมูลตาม Tab
    const currentForms = activeTab === "pending" ? pendingForms : historyForms;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-uni-orange-600 font-medium animate-pulse">
                กำลังโหลดข้อมูล...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="py-10 w-full animate-in fade-in duration-500">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* --- Header Section --- */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border-l-4 border-uni-orange-500">
                        <div className="flex items-center gap-5 w-full md:w-auto">
                            <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-uni-orange-600 font-bold text-2xl border-2 border-orange-100 shadow-inner">
                                <Users size={32} className="text-orange-500" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                    อาจารย์นิเทศก์
                                    <span className="text-xs font-normal bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200">
                                        Teacher
                                    </span>
                                </h2>
                                <p className="text-gray-500 text-sm mt-1">
                                    ยินดีต้อนรับ, อ.
                                    {teacherProfile?.name || "อาจารย์"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="mt-4 md:mt-0 text-red-500 hover:text-red-700 text-sm font-medium px-5 py-2.5 border border-red-100 rounded-xl hover:bg-red-50 transition flex items-center gap-2 group w-full md:w-auto justify-center"
                        >
                            <LogOut
                                size={16}
                                className="group-hover:-translate-x-1 transition-transform"
                            />
                            ออกจากระบบ
                        </button>
                    </div>

                    {/* --- Tab Navigation --- */}
                    <div className="flex space-x-2 mb-6 bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 w-fit">
                        <button
                            onClick={() => setActiveTab("pending")}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${activeTab === "pending"
                                ? "bg-uni-orange-500 text-white shadow-md shadow-orange-200"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                }`}
                        >
                            <ClipboardList size={18} />
                            รอตรวจ
                            <span
                                className={`ml-1 text-xs px-2 py-0.5 rounded-full ${activeTab === "pending"
                                    ? "bg-white/20 text-white"
                                    : "bg-gray-100 text-gray-500"
                                    }`}
                            >
                                {pendingForms.length}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab("history")}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${activeTab === "history"
                                ? "bg-green-600 text-white shadow-md shadow-green-200"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                }`}
                        >
                            <History size={18} />
                            ประวัติการตรวจ
                            <span
                                className={`ml-1 text-xs px-2 py-0.5 rounded-full ${activeTab === "history"
                                    ? "bg-white/20 text-white"
                                    : "bg-gray-100 text-gray-500"
                                    }`}
                            >
                                {historyForms.length}
                            </span>
                        </button>
                    </div>

                    {/* --- Content Area --- */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
                        <div
                            className={`p-6 border-b border-gray-100 flex justify-between items-center ${activeTab === "history"
                                ? "bg-green-50/50"
                                : "bg-orange-50/30"
                                }`}
                        >
                            <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                                {activeTab === "pending" ? (
                                    <>
                                        <ClipboardList className="text-uni-orange-500" />
                                        รายการรอตรวจ
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="text-green-600" />
                                        รายการที่ตรวจแล้ว
                                    </>
                                )}
                            </h3>
                        </div>

                        <div className="p-6">
                            {currentForms.length === 0 ? (
                                <div className="text-center py-20 flex flex-col items-center">
                                    <div className="bg-gray-50 p-6 rounded-full mb-4">
                                        <div className="text-gray-300">
                                            {activeTab === "pending" ? (
                                                <CheckCircle2 size={48} />
                                            ) : (
                                                <History size={48} />
                                            )}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-400">
                                        {activeTab === "pending"
                                            ? "ไม่มีงานที่ต้องตรวจ"
                                            : "ยังไม่มีประวัติการตรวจ"}
                                    </h3>
                                    <p className="text-gray-400 mt-2">
                                        {activeTab === "pending"
                                            ? "นักศึกษายังไม่ได้ส่งแบบฟอร์ม หรือคุณตรวจครบหมดแล้ว"
                                            : "คุณยังไม่ได้ทำการตรวจแบบฟอร์มใดๆ"}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {currentForms.map((form) => (
                                        <div
                                            key={form.id}
                                            className={`border rounded-xl transition-all duration-300 bg-white ${expandedFormId === form.id
                                                ? activeTab === "pending"
                                                    ? "border-uni-orange-500 ring-1 ring-uni-orange-200"
                                                    : "border-green-500 ring-1 ring-green-200"
                                                : "border-gray-200 hover:shadow-md"
                                                }`}
                                        >
                                            {/* Card Header */}
                                            <div
                                                className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer gap-4"
                                                onClick={() =>
                                                    toggleExpand(form.id)
                                                }
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg ${activeTab ===
                                                            "history"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-gray-100 text-gray-500"
                                                            }`}
                                                    >
                                                        {form.student.name.charAt(
                                                            0
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-800 text-lg">
                                                            {form.student.name}
                                                        </h4>
                                                        <p className="text-gray-500 text-sm flex items-center gap-2">
                                                            <span className="text-gray-400">
                                                                รหัสนักศึกษา:
                                                            </span>
                                                            {form.studentCode ||
                                                                form.student
                                                                    .username}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                                                    <div className="text-right">
                                                        <div className="text-sm font-medium text-gray-800">
                                                            {form.schoolName ||
                                                                "ไม่ระบุโรงเรียน"}
                                                        </div>
                                                        <div className="text-xs text-gray-500 flex items-center justify-end gap-1">
                                                            {activeTab ===
                                                                "history" && (
                                                                    <Clock
                                                                        size={12}
                                                                    />
                                                                )}
                                                            {new Date(
                                                                activeTab ===
                                                                    "history" &&
                                                                    form.updatedAt
                                                                    ? form.updatedAt
                                                                    : form.createdAt
                                                            ).toLocaleDateString(
                                                                "th-TH",
                                                                {
                                                                    year: "numeric",
                                                                    month: "short",
                                                                    day: "numeric",
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                }
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={`p-2 rounded-full transition-transform duration-300 ${expandedFormId ===
                                                            form.id
                                                            ? "rotate-180 bg-gray-100"
                                                            : "bg-gray-50"
                                                            }`}
                                                    >
                                                        <ChevronDown
                                                            size={20}
                                                            className={
                                                                expandedFormId ===
                                                                    form.id
                                                                    ? "text-gray-800"
                                                                    : "text-gray-400"
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Expandable Content */}
                                            {expandedFormId === form.id && (
                                                <div className="px-6 pb-8 pt-2 border-t border-gray-100 bg-gray-50/30 animate-in slide-in-from-top-2">
                                                    {/* --- Student & School Info (Read Only) --- */}
                                                    <div className="grid md:grid-cols-2 gap-6 mb-8 mt-4">
                                                        {/* Personal Info */}
                                                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                                            <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                                                                <User
                                                                    size={18}
                                                                    className="text-pink-500"
                                                                />
                                                                ข้อมูลนักศึกษา
                                                            </h4>
                                                            <div className="space-y-3 text-sm">
                                                                <InfoRow
                                                                    label="ชื่อ-สกุล"
                                                                    value={`${form.prefix} ${form.firstName} ${form.lastName}`}
                                                                />
                                                                <InfoRow
                                                                    label="สาขาวิชา"
                                                                    value={
                                                                        form.major
                                                                    }
                                                                />
                                                                <InfoRow
                                                                    label="เบอร์โทร"
                                                                    value={
                                                                        form.phone
                                                                    }
                                                                    icon={
                                                                        <Phone
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                    }
                                                                />
                                                                <InfoRow
                                                                    label="อีเมล"
                                                                    value={
                                                                        form.email
                                                                    }
                                                                    icon={
                                                                        <Mail
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                    }
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* School Info */}
                                                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                                            <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                                                                <MapPin
                                                                    size={18}
                                                                    className="text-blue-500"
                                                                />
                                                                ข้อมูลการฝึกสอน
                                                            </h4>
                                                            <div className="space-y-3 text-sm">
                                                                <InfoRow
                                                                    label="โรงเรียน"
                                                                    value={
                                                                        form.schoolName
                                                                    }
                                                                />
                                                                <InfoRow
                                                                    label="จังหวัด"
                                                                    value={`${form.province
                                                                        } ${form.district
                                                                            ? `(${form.district})`
                                                                            : ""
                                                                        }`}
                                                                />
                                                                <InfoRow
                                                                    label="วิชาที่สอน"
                                                                    value={
                                                                        form.subjectName
                                                                    }
                                                                    icon={
                                                                        <BookOpen
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                    }
                                                                />
                                                                <InfoRow
                                                                    label="กลุ่มสาระฯ"
                                                                    value={
                                                                        form.subjectGroup
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* --- Evaluation Section (Dynamic based on Tab) --- */}
                                                    {activeTab === "pending" ? (
                                                        // 1. PENDING STATE: Show Grading Form
                                                        <div className="bg-orange-50 border border-orange-100 rounded-xl p-6">
                                                            <h4 className="font-bold text-uni-orange-700 mb-4 flex items-center gap-2">
                                                                <ClipboardList
                                                                    size={20}
                                                                />
                                                                ส่วนการประเมินผล
                                                                (สำหรับอาจารย์)
                                                            </h4>

                                                            <div className="grid gap-6">
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-4">
                                                                        คะแนนการประเมิน
                                                                        (1 - 5){" "}
                                                                        <span className="text-red-500">
                                                                            *
                                                                        </span>
                                                                    </label>
                                                                    <div className="flex flex-wrap gap-6 items-center">
                                                                        {[
                                                                            1,
                                                                            2,
                                                                            3,
                                                                            4,
                                                                            5,
                                                                        ].map(
                                                                            (
                                                                                value
                                                                            ) => (
                                                                                <label
                                                                                    key={
                                                                                        value
                                                                                    }
                                                                                    className="flex flex-col items-center gap-2 cursor-pointer group"
                                                                                >
                                                                                    <input
                                                                                        type="radio"
                                                                                        name={`score-${form.id}`}
                                                                                        value={
                                                                                            value
                                                                                        }
                                                                                        checked={
                                                                                            score ===
                                                                                            value
                                                                                        }
                                                                                        onChange={() =>
                                                                                            setScore(
                                                                                                value
                                                                                            )
                                                                                        }
                                                                                        className="sr-only"
                                                                                    />
                                                                                    <div
                                                                                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 font-bold ${score ===
                                                                                            value
                                                                                            ? "bg-uni-orange-600 text-white shadow-lg scale-110 ring-2 ring-offset-2 ring-uni-orange-600"
                                                                                            : "bg-white border border-gray-300 text-gray-500 hover:border-uni-orange-400 hover:text-uni-orange-500"
                                                                                            }`}
                                                                                    >
                                                                                        {
                                                                                            value
                                                                                        }
                                                                                    </div>
                                                                                </label>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                        ความคิดเห็น
                                                                        /
                                                                        ข้อเสนอแนะ

                                                                    </label>
                                                                    <textarea
                                                                        rows={3}
                                                                        value={
                                                                            feedback
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setFeedback(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        placeholder="เขียนข้อเสนอแนะถึงนักศึกษา..."
                                                                        className="w-full px-4 py-2.5 border border-orange-200 rounded-lg focus:ring-2 focus:ring-uni-orange-500 focus:border-uni-orange-500 outline-none transition-all resize-none bg-white"
                                                                    />
                                                                </div>

                                                                <div className="flex justify-end gap-3 pt-2">
                                                                    <button
                                                                        onClick={() =>
                                                                            toggleExpand(
                                                                                form.id
                                                                            )
                                                                        }
                                                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium border border-gray-200 bg-white"
                                                                    >
                                                                        ยกเลิก
                                                                    </button>
                                                                    <button
                                                                        onClick={() =>
                                                                            handleSubmitEvaluation(
                                                                                form.id
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            isSubmitting
                                                                        }
                                                                        className="px-6 py-2 bg-uni-orange-600 text-white rounded-lg hover:bg-uni-orange-700 hover:shadow-lg transition-all flex items-center gap-2 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                                                                    >
                                                                        {isSubmitting ? (
                                                                            "กำลังบันทึก..."
                                                                        ) : (
                                                                            <>
                                                                                <Send
                                                                                    size={
                                                                                        16
                                                                                    }
                                                                                />{" "}
                                                                                บันทึกผลการประเมิน
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        // 2. HISTORY STATE: Show Graded Result
                                                        <div className="bg-green-50 border border-green-200 rounded-xl p-6 relative overflow-hidden">
                                                            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                                                <CheckCircle2
                                                                    size={120}
                                                                    className="text-green-600"
                                                                />
                                                            </div>

                                                            <h4 className="font-bold text-green-800 mb-6 flex items-center gap-2 relative z-10">
                                                                <CheckCircle2
                                                                    size={20}
                                                                />
                                                                ผลการประเมิน
                                                                (ตรวจแล้ว)
                                                            </h4>

                                                            <div className="flex flex-col md:flex-row gap-8 relative z-10">
                                                                <div className="flex flex-col items-center justify-center bg-white p-6 rounded-2xl border border-green-100 shadow-sm min-w-[150px]">
                                                                    <span className="text-sm text-gray-500 font-medium mb-1">
                                                                        คะแนนที่ได้
                                                                    </span>
                                                                    <div className="text-5xl font-black text-green-600 flex items-end leading-none">
                                                                        {form
                                                                            .evaluations?.[0]
                                                                            ?.score ||
                                                                            "-"}
                                                                        <span className="text-lg text-gray-400 font-medium mb-1 ml-1">
                                                                            /5
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex gap-1 mt-3">
                                                                        {[
                                                                            1,
                                                                            2,
                                                                            3,
                                                                            4,
                                                                            5,
                                                                        ].map(
                                                                            (
                                                                                s
                                                                            ) => (
                                                                                <Star
                                                                                    key={
                                                                                        s
                                                                                    }
                                                                                    size={
                                                                                        16
                                                                                    }
                                                                                    className={`${s <=
                                                                                        (form
                                                                                            .evaluations?.[0]
                                                                                            ?.score ||
                                                                                            0)
                                                                                        ? "fill-yellow-400 text-yellow-400"
                                                                                        : "text-gray-200"
                                                                                        }`}
                                                                                />
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="flex-1">
                                                                    <div className="bg-white p-5 rounded-xl border border-green-100 shadow-sm h-full">
                                                                        <label className="block text-xs font-bold text-green-700 uppercase tracking-wide mb-2">
                                                                            ข้อเสนอแนะจากอาจารย์
                                                                        </label>
                                                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                                            {form
                                                                                .evaluations?.[0]
                                                                                ?.feedback ||
                                                                                "ไม่มีข้อเสนอแนะเพิ่มเติม"}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="mt-4 text-right text-xs text-green-700 font-medium relative z-10">
                                                                ตรวจเมื่อ:{" "}
                                                                {new Date(
                                                                    form.updatedAt ||
                                                                    ""
                                                                ).toLocaleString(
                                                                    "th-TH"
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Styles for Colors */}
            <style jsx global>{`
                .text-uni-orange-500 {
                    color: #f97316;
                }
                .text-uni-orange-600 {
                    color: #ea580c;
                }
                .text-uni-orange-700 {
                    color: #c2410c;
                }
                .bg-uni-orange-100 {
                    background-color: #ffedd5;
                }
                .bg-uni-orange-500 {
                    background-color: #f97316;
                }
                .bg-uni-orange-600 {
                    background-color: #ea580c;
                }
                .bg-uni-orange-700 {
                    background-color: #c2410c;
                }
            `}</style>
        </div>
    );
};

// Sub-component for Cleaner Code
const InfoRow = ({
    label,
    value,
    icon,
}: {
    label: string;
    value: any;
    icon?: React.ReactNode;
}) => (
    <div className="grid grid-cols-3 items-start">
        <span className="text-gray-500 col-span-1 flex items-center gap-1.5">
            {icon} {label}:
        </span>
        <span className="font-medium text-gray-800 col-span-2 wrap-break-words">
            {value || "-"}
        </span>
    </div>
);

export default TeacherDashboard;
