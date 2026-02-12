
import localFont from "next/font/local";
import { Josefin_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar/Navbar";


const josefin_Sans = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
});

const euclid = localFont({
  src: [
    {
      path: "./fonts/EuclidCircularB-Regular.ttf", // Make sure to rename them!
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/EuclidCircularB-Medium.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-euclid", // This is the name we use in Tailwind
});

export const metadata = {
  title: "Sbthinks", 
  description: "A blog dedicated to making physics simple and engaging.",
  icons: {
    icon: "/sb-logo.jpeg", // This sets your logo as the small tab icon (favicon)
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en"> 
      <body className={`${josefin_Sans.variable} ${euclid.variable} antialiased`}>
        
        {children}
      </body>
    </html>
  );
}
