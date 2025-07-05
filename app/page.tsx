"use client"; // Penting karena menggunakan Navbar dan Link

import Link from "next/link";
import Navbar from "./components/Navbar"; // Sesuaikan path jika perlu

export default function Home() {
  return (
    <>
      <Navbar /> {/* Tambahkan Navbar di homepage baru */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-4">
        <h1 className="text-4xl md:text-5xl font-bold text-[#E6521F] mb-6 text-center">
          Selamat Datang di Resep Rakyat!
        </h1>
        <p className="text-lg text-[#FB9E3A] mb-8 text-center max-w-2xl">
          Temukan berbagai resep lezat dari seluruh dunia. Mulai jelajahi
          koleksi resep kami sekarang!
        </p>
        <Link
          href="/menu"
          className="inline-flex items-center justify-center bg-[#EA2F14] hover:bg-[#E6521F] text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg text-xl"
        >
          Jelajahi Resep
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5 ml-2"
          >
            <path
              fillRule="evenodd"
              d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </>
  );
}
