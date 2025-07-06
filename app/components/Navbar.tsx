"use client"; // Penting untuk menggunakan hooks seperti useState dan useEffect

import { useState, useEffect } from "react"; // Import useState dan useEffect
import { MdGrass } from "react-icons/md";
import Link from "next/link"; // Import Link from next/link

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false); // State untuk melacak apakah halaman sudah di-scroll

  // Efek untuk menambahkan dan menghapus event listener scroll
  useEffect(() => {
    const handleScroll = () => {
      // Periksa apakah posisi scroll Y lebih besar dari 20px (atau nilai lain yang Anda inginkan)
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    // Tambahkan event listener saat komponen di-mount
    window.addEventListener("scroll", handleScroll);

    // Hapus event listener saat komponen di-unmount untuk mencegah memory leaks
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]); // Dependensi: hanya jalankan ulang efek jika nilai 'scrolled' berubah

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full z-50 first-bgs flex justify-evenly text-white items-center transition-all duration-300 ease-in-out
          ${scrolled ? "h-16 p-3" : "h-24 p-5"}`} // Mengurangi tinggi dan padding saat di-scroll
      >
        <Link href={"/"}>
          <div className="flex items-center justify-center gap-3">
            <span>Name</span>
            <MdGrass
              className={`transition-all duration-300 ease-in-out third-text ${
                scrolled ? "text-3xl" : "text-5xl"
              }`}
            />{" "}
            {/* Mengurangi ukuran ikon */}
          </div>
        </Link>
        <div>
          <ul className="flex items-center justify-center gap-5">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/menu">Menu</Link>
            </li>
            <li>
              <Link href="#">About</Link>
            </li>
          </ul>
        </div>
      </div>
      {/* Tambahkan div kosong ini untuk memberikan ruang agar konten tidak tertutup Navbar fixed */}
      <div className={`${scrolled ? "h-16" : "h-24"}`}></div>
    </>
  );
}
