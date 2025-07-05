import React from "react";

interface CardProps {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  return (
    // Hapus bg-white dari sini jika Anda ingin Card transparan
    // atau jika Anda ingin warna latar belakang body terlihat di area Card.
    // Jika Anda ingin Card memiliki warna latar belakang yang berbeda dari body,
    // Anda bisa mengganti bg-white dengan warna lain di sini.
    <div className="rounded-lg p-4 mx-auto my-4 w-full max-w-6xl">
      {children}
    </div>
  );
};

export default Card;
