"use client"

import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="w-full bg-[#FAF7F2] border-b border-stone-200 sticky top-0 z-50">
      <div className="w-full px-8 py-6 flex justify-between items-center">
        
        <Link
          href="/"
          className="text-2xl font-serif tracking-widest text-[#C65D3B]"
        >
          CLARICE & ELTON
        </Link>

        <div className="flex gap-10 text-sm uppercase tracking-widest font-semibold text-[#4A443F]">
          
          <Link
            href="/"
            className="hover:text-[#C65D3B] transition"
          >
            Início
          </Link>

          <Link href="/confirmar-presenca">Confirmar Presença</Link>

          <Link href="/presentes">Presentes</Link>
          
          <Link href="/pix">PIX</Link>

          <Link
            href="/localizacao"
            className="hover:text-[#C65D3B] transition"
          >
            Localização
          </Link>

          <Link
            href="/admin"
            className="hover:text-[#C65D3B] transition"
          >
            Admin
          </Link>

        </div>

      </div>
    </nav>
  )
}