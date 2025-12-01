import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

const kanit = Kanit({
    subsets: ["thai", "latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-kanit",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Demo",
    description: "ระบบประเมิน",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="th">
            <body
                className={`${kanit.variable} ${kanit.className} antialiased bg-gray-50`}
            >
                <div className="min-h-screen flex flex-col">
                    <NavBar />

                    <main className="flex-1 relative flex flex-col justify-center">
                        {children}
                    </main>
                    <Footer />
                </div>
            </body>
        </html>
    );
}
