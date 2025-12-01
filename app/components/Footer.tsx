import "./css/footer.css";

const Footer = () => {
    return (
        // ลบ <div> ที่ครอบอยู่ออก ให้เหลือแต่ footer เพียวๆ หรือใส่ w-full
        <footer className="footer">
            <div className="footer-title">
                &copy; 2025 Faculty of Education. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
