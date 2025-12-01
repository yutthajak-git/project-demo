"use client"; // ใส่ไว้เผื่ออนาคตมีการใช้ hook เช่น usePathname
import Link from "next/link";
import { GraduationCap } from "lucide-react"; // ใช้ Icon จาก Lucide จะสวยและเบากว่า
import "./css/navbar.css";

const NavBar = () => {
    return (
        // ลบ div ครอบนอกสุดออก เพราะ nav เป็น block element อยู่แล้ว
        <nav className="navbar-container">
            <div className="items-container">
                <div className="items">
                    {/* Logo Section */}
                    <div className="logo-header">
                        <div className="">
                            <Link href="/" className="logo-items">
                                {/* Icon Circle */}
                                <div className="item-icon">
                                    <GraduationCap size={24} />
                                </div>
                                {/* Text */}
                                <div className="item-title">
                                    <span className="item-maintitle">
                                        PROJECT-DEMO
                                    </span>
                                    <span className="item-subtitle">
                                        ระบบประเมินนักศึกษาฝึกสอน
                                    </span>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Menu Section */}
                    <div className="menu-section">
                        <Link href="/home" className="home-menu">
                            หน้าแรก
                        </Link>

                        {/* ปุ่มเข้าสู่ระบบ - ใช้ Link ครอบเพื่อให้กดแล้วไปหน้า Login */}
                        <Link href="/role" className="login-menu">
                            เข้าสู่ระบบ
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
