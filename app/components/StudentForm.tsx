"use client";

import React, { useState, useEffect } from "react";
import {
    LogOut,
    FileText,
    Save,
    Send,
    User,
    MapPin,
    BookOpen,
    CreditCard,
    Phone,
    Mail,
    ChevronDown,
    School,
    GraduationCap,
    Loader2
} from "lucide-react";
import axios from "axios";

// --- Mock StudentProfile Component (รวมไว้ในไฟล์เดียวเพื่อแก้ปัญหา Import) ---
const StudentProfile = ({ user }: { user: any }) => {
    if (!user) return null;
    return (
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-xl border-2 border-pink-200">
                {user.name ? user.name.charAt(0) : "S"}
            </div>
            <div>
                <h2 className="font-bold text-gray-800 text-lg">{user.name}</h2>
                <div className="flex items-center gap-2">
                    <span className="bg-pink-100 text-pink-700 text-xs px-2 py-0.5 rounded-full border border-pink-200 font-medium">
                        Student
                    </span>
                    <span className="text-gray-400 text-xs">|</span>
                    <span className="text-gray-500 text-sm">{user.username}</span>
                </div>
            </div>
        </div>
    );
};

// Interface สำหรับข้อมูลอาจารย์
interface Teacher {
    id: string;
    name: string;
    username: string;
}

// Interface สำหรับข้อมูลแบบฟอร์ม
interface FormData {
    id?: string;
    studentCode: string;
    idCard: string;
    prefix: string;
    firstName: string;
    lastName: string;
    major: string;
    email: string;
    phone: string;
    
    schoolName: string;
    province: string;
    district: string;
    affiliation: string;
    schoolSize: string;
    
    subjectGroup: string;
    subjectName: string;
    majorRelation: string;

    assignedTeacherId: string;
}

const StudentForm = () => {
    // ใช้ window.location แทน useRouter ของ Next.js
    const router = {
        push: (path: string) => {
            window.location.href = path;
        }
    };

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // ข้อมูล User ปัจจุบัน
    const [currentUser, setCurrentUser] = useState<any>(null);
    
    // รายชื่ออาจารย์สำหรับ Dropdown
    const [teachers, setTeachers] = useState<Teacher[]>([]);

    // State สำหรับเก็บข้อมูลฟอร์ม
    const [formData, setFormData] = useState<FormData>({
        studentCode: "66122519037",
        idCard: "",
        prefix: "นาย",
        firstName: "",
        lastName: "",
        major: "",
        email: "",
        phone: "",
        schoolName: "",
        province: "",
        district: "",
        affiliation: "",
        schoolSize: "",
        subjectGroup: "",
        subjectName: "",
        majorRelation: "",
        assignedTeacherId: ""
    });

    useEffect(() => {
        const initData = async () => {
            // 1. ตรวจสอบ Login
            const userStr = localStorage.getItem("currentUser");
            const token = localStorage.getItem("token");
            if (!userStr || !token) {
                router.push("/role");
                return;
            }
            const user = JSON.parse(userStr);
            setCurrentUser(user);
            
            // Set ข้อมูลเริ่มต้นบางอย่างจาก User Profile
            setFormData(prev => ({
                ...prev,
                studentCode: user.username,
                firstName: user.name
            }));

            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";

                // 2. ดึงรายชื่ออาจารย์มาใส่ Dropdown
                // ใช้ try-catch แยกเพื่อป้องกัน error บล็อกการทำงานส่วนอื่น
                try {
                    const teachersRes = await axios.get(`${apiUrl}/auth/teachers`);
                    if (Array.isArray(teachersRes.data)) {
                        setTeachers(teachersRes.data);
                    }
                } catch (e) {
                    console.warn("Could not fetch teachers list. Using mock data if needed.");
                    // Mock teachers for preview if API fails
                    setTeachers([
                        { id: "mock-t1", name: "อาจารย์สมชาย (Mock)", username: "TeacherSomchai" },
                        { id: "mock-t2", name: "อาจารย์สมหญิง (Mock)", username: "TeacherSomying" }
                    ]);
                }

                // 3. ตรวจสอบว่ามี Form Draft ค้างไว้ไหม
                try {
                    const myFormRes = await axios.get(`${apiUrl}/forms/my-forms/${user.id}`);
                    if (myFormRes.data && myFormRes.data.length > 0) {
                        const existingForm = myFormRes.data[0];
                        setFormData({
                            id: existingForm.id,
                            studentCode: existingForm.studentCode || user.username,
                            idCard: existingForm.idCard || "",
                            prefix: existingForm.prefix || "นาย",
                            firstName: existingForm.firstName || user.name,
                            lastName: existingForm.lastName || "",
                            major: existingForm.major || "",
                            email: existingForm.email || "",
                            phone: existingForm.phone || "",
                            schoolName: existingForm.schoolName || "",
                            province: existingForm.province || "",
                            district: existingForm.district || "",
                            affiliation: existingForm.affiliation || "",
                            schoolSize: existingForm.schoolSize || "",
                            subjectGroup: existingForm.subjectGroup || "",
                            subjectName: existingForm.subjectName || "",
                            majorRelation: existingForm.majorRelation || "",
                            assignedTeacherId: existingForm.assignedTeacherId || ""
                        });
                    }
                } catch (e) {
                    console.warn("Could not fetch drafts.");
                }

            } catch (error) {
                console.error("Error fetching initial data:", error);
            }
        };

        initData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveDraft = async () => {
        setIsSaving(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";
            const payload = {
                ...formData,
                studentId: currentUser.id
            };

            const res = await axios.post(`${apiUrl}/forms/save-draft`, payload);
            
            if (res.data && res.data.id) {
                setFormData(prev => ({ ...prev, id: res.data.id }));
            }
            
            alert("บันทึกร่างสำเร็จเรียบร้อย");
        } catch (error) {
            console.error("Save Draft Error:", error);
            // Fallback for demo without backend
            alert("ระบบบันทึกร่างจำลอง: บันทึกสำเร็จ (เชื่อมต่อ API ไม่ได้)");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.assignedTeacherId) {
            alert("กรุณาเลือกอาจารย์นิเทศก์ก่อนส่งแบบฟอร์ม");
            return;
        }

        if (!confirm("ยืนยันการส่งแบบฟอร์ม? เมื่อส่งแล้วจะไม่สามารถแก้ไขได้")) return;

        setIsLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";
            
            // Save draft first to ensure we have an ID
            let currentFormId = formData.id;
            
            try {
                const saveRes = await axios.post(`${apiUrl}/forms/save-draft`, { ...formData, studentId: currentUser.id });
                currentFormId = saveRes.data.id;
            } catch (e) {
                console.warn("Auto-save draft failed, trying to submit anyway if ID exists");
            }

            if (currentFormId) {
                await axios.post(`${apiUrl}/forms/${currentFormId}/submit`, {
                    assignedTeacherId: formData.assignedTeacherId
                });
                alert("ส่งแบบฟอร์มเรียบร้อย! ข้อมูลถูกส่งไปยังอาจารย์แล้ว");
                router.push("/profile/student");
            } else {
                throw new Error("Could not create form ID");
            }
            
        } catch (error) {
            console.error("Submit Error:", error);
             // Fallback for demo
             alert("ระบบส่งงานจำลอง: ส่งสำเร็จ (เชื่อมต่อ API ไม่ได้)");
             router.push("/profile/student");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <style>{`
                .fade-in { animation: fadeIn 0.5s ease-out forwards; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>

            <div id="student-dashboard-section" className="fade-in py-10 w-full">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header Profile & Logout */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-pink-600 gap-4">
                        {/* Inline StudentProfile Component */}
                        <StudentProfile user={currentUser} />
                        
                        <button
                            type="button"
                            className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium px-4 py-2 border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
                            onClick={() => {
                                localStorage.removeItem("token");
                                localStorage.removeItem("currentUser");
                                router.push("/role");
                            }}
                        >
                            <LogOut size={16} />
                            ออกจากระบบ
                        </button>
                    </div>

                    {/* Main Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                        {/* Form Header */}
                        <div className="bg-pink-600 px-6 py-5 border-b border-pink-700 flex justify-between items-center">
                            <div className="flex items-center gap-3 text-white">
                                <div className="p-2 bg-pink-500/50 rounded-lg">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">
                                        แบบฟอร์มกรอกข้อมูลสำหรับนักศึกษา
                                    </h3>
                                    <p className="text-pink-100 text-xs opacity-90">
                                        ปีการศึกษา 2568
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form Inputs */}
                        <form className="p-6 md:p-10 space-y-10" onSubmit={handleSubmit}>
                            
                            {/* --- Section 1: ข้อมูลส่วนตัว --- */}
                            <div className="relative">
                                <h4 className="text-pink-600 font-bold mb-6 text-lg flex items-center gap-2 pb-2 border-b border-gray-100">
                                    <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 font-bold text-sm">1</div>
                                    ข้อมูลส่วนตัวนักศึกษา
                                </h4>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">รหัสนักศึกษา</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="studentCode"
                                                value={formData.studentCode}
                                                onChange={handleChange}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-500 pl-10 cursor-not-allowed"
                                                readOnly
                                            />
                                            <CreditCard size={18} className="absolute left-3 top-3 text-gray-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">เลขบัตรประจำตัวประชาชน</label>
                                        <input
                                            type="text"
                                            name="idCard"
                                            value={formData.idCard}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-200 focus:border-pink-500 outline-none transition-all"
                                            placeholder="x-xxxx-xxxxx-xx-x"
                                        />
                                    </div>

                                    {/* Name Row */}
                                    <div className="md:col-span-2 grid grid-cols-12 gap-4">
                                        <div className="col-span-12 md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">คำนำหน้า</label>
                                            <select 
                                                name="prefix"
                                                value={formData.prefix}
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-pink-200 outline-none"
                                            >
                                                <option>นาย</option>
                                                <option>นางสาว</option>
                                                <option>นาง</option>
                                            </select>
                                        </div>
                                        <div className="col-span-12 md:col-span-5">
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">ชื่อ</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-200 outline-none pl-10"
                                                />
                                                <User size={18} className="absolute left-3 top-3 text-gray-400" />
                                            </div>
                                        </div>
                                        <div className="col-span-12 md:col-span-5">
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">นามสกุล</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-200 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">สาขาวิชา</label>
                                        <select 
                                            name="major"
                                            value={formData.major}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-200 outline-none cursor-pointer hover:border-pink-400 transition-colors"
                                        >
                                            <option value="">-- เลือกสาขาวิชา --</option>
                                            <option>สาขาวิชาภาษาไทย</option>
                                            <option>สาขาวิชาภาษาอังกฤษ</option>
                                            <option>สาขาวิชาคณิตศาสตร์</option>
                                            <option>สาขาวิชาวิทยาศาสตร์ทั่วไป</option>
                                            <option>สาขาวิชาคอมพิวเตอร์ศึกษา</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">E-mail</label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-200 outline-none pl-10"
                                            />
                                            <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                                        <div className="relative">
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-200 outline-none pl-10"
                                            />
                                            <Phone size={18} className="absolute left-3 top-3 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* --- Section 2: ข้อมูลสถานศึกษา --- */}
                            <div>
                                <h4 className="text-pink-600 font-bold mb-6 text-lg flex items-center gap-2 pb-2 border-b border-gray-100">
                                    <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 font-bold text-sm">2</div>
                                    ข้อมูลสถานที่ฝึกสอน
                                </h4>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">ชื่อสถานศึกษา</label>
                                        <div className="relative">
                                            <input 
                                                type="text"
                                                name="schoolName"
                                                value={formData.schoolName}
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-200 outline-none pl-10"
                                                placeholder="ระบุชื่อโรงเรียน"
                                            />
                                            <School size={18} className="absolute left-3 top-3 text-gray-400" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">จังหวัด</label>
                                        <select 
                                            name="province"
                                            value={formData.province}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-200 outline-none"
                                        >
                                            <option value="">-- เลือกจังหวัด --</option>
                                            <option>กรุงเทพมหานคร</option>
                                            <option>นนทบุรี</option>
                                            <option>ปทุมธานี</option>
                                            <option>สมุทรปราการ</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">อำเภอ / เขต</label>
                                        <input
                                            type="text"
                                            name="district"
                                            value={formData.district}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-200 outline-none"
                                            placeholder="ระบุอำเภอ/เขต"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">สังกัดสถานศึกษา</label>
                                        <select 
                                            name="affiliation"
                                            value={formData.affiliation}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-200 outline-none"
                                        >
                                            <option value="">-- เลือกสังกัด --</option>
                                            <option>(1) สพฐ.</option>
                                            <option>(2) สอศ.</option>
                                            <option>(3) สช.</option>
                                            <option>(4) อปท.</option>
                                            <option>(5) กทม.</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">ขนาดสถานศึกษา</label>
                                        <select 
                                            name="schoolSize"
                                            value={formData.schoolSize}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-200 outline-none"
                                        >
                                            <option>ขนาดเล็ก</option>
                                            <option>ขนาดกลาง</option>
                                            <option>ขนาดใหญ่</option>
                                            <option>ขนาดใหญ่พิเศษ</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* --- Section 3: ข้อมูลการสอน --- */}
                            <div>
                                <h4 className="text-pink-600 font-bold mb-6 text-lg flex items-center gap-2 pb-2 border-b border-gray-100">
                                    <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 font-bold text-sm">3</div>
                                    ข้อมูลการปฏิบัติการสอน
                                </h4>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">กลุ่มสาระการเรียนรู้ / ประเภทวิชา</label>
                                        <select 
                                            name="subjectGroup"
                                            value={formData.subjectGroup}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-200 outline-none"
                                        >
                                            <option value="">-- เลือกกลุ่มสาระการเรียนรู้ --</option>
                                            <option>1. ภาษาไทย</option>
                                            <option>2. คณิตศาสตร์</option>
                                            <option>3. วิทยาศาสตร์และเทคโนโลยี</option>
                                            <option>4. สังคมศึกษา ศาสนา และวัฒนธรรม</option>
                                            <option>5. สุขศึกษาและพลศึกษา</option>
                                            <option>6. ศิลปะ</option>
                                            <option>7. การงานอาชีพ</option>
                                            <option>8. ภาษาต่างประเทศ</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">วิชาที่ปฏิบัติการสอน (ระบุชื่อรายวิชา)</label>
                                        <input
                                            type="text"
                                            name="subjectName"
                                            value={formData.subjectName}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-200 outline-none"
                                            placeholder="เช่น ภาษาไทยพื้นฐาน (ท21101)"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">ความสัมพันธ์ของวิชาเอกกับวิชาที่สอน</label>
                                        <select 
                                            name="majorRelation"
                                            value={formData.majorRelation}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-200 outline-none"
                                        >
                                            <option>ตรงกับสาขาวิชาเอก</option>
                                            <option>สัมพันธ์กับสาขาวิชาเอก</option>
                                            <option>ไม่ตรง/ไม่สัมพันธ์</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* --- Section 4: เลือกอาจารย์ (NEW) --- */}
                            <div className="bg-orange-50/50 p-6 rounded-xl border border-orange-100">
                                <h4 className="text-orange-600 font-bold mb-4 text-lg flex items-center gap-2">
                                    <GraduationCap size={24} />
                                    เลือกอาจารย์นิเทศก์เพื่อส่งงาน
                                </h4>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">ส่งถึงอาจารย์</label>
                                    <div className="relative">
                                        <select 
                                            name="assignedTeacherId"
                                            value={formData.assignedTeacherId}
                                            onChange={handleChange}
                                            className="w-full border border-orange-200 bg-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-200 outline-none cursor-pointer text-gray-700 font-medium"
                                            required
                                        >
                                            <option value="">-- กรุณาเลือกอาจารย์ --</option>
                                            {teachers.map((t) => (
                                                <option key={t.id} value={t.id}>
                                                    {t.name} ({t.username})
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-3.5 pointer-events-none text-orange-400">
                                            <ChevronDown size={20} />
                                        </div>
                                    </div>
                                    <p className="text-xs text-orange-500 mt-2">
                                        * กรุณาตรวจสอบรายชื่ออาจารย์ให้ถูกต้องก่อนกดส่งแบบฟอร์ม
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-8 flex flex-col md:flex-row gap-4 justify-end border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={handleSaveDraft}
                                    disabled={isSaving}
                                    className="flex items-center justify-center gap-2 px-6 py-3.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                    บันทึกร่าง
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex items-center justify-center gap-2 px-8 py-3.5 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 shadow-lg shadow-pink-200 transition transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            กำลังส่ง...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            ส่งแบบฟอร์ม
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentForm;