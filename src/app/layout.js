import { Inter } from "next/font/google";

import "bootstrap/dist/css/bootstrap.css";
import "./globals.css";
import "./custom.scss";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ShaadiVite",
  description: "Important Information Inside",
  openGraph: {
    title: "ShaadiVite",
    description: "Important Information Inside",
    url: "https://shaadi1446.vercel.app", // Replace with your website URL
    images: [
      {
        url: "https://i.imgur.com/iRPQK7P.png", // Replace with your image URL
        width: 250, // Adjust the width and height as per your image dimensions
        height: 200,
      },
    ],
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body className={inter.className}>{children}</body>
    </html>
  );
}
