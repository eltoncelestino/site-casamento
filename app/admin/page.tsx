"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

// Nova interface para as confirmações
interface Confirmation {
  id: string
  nome: string
  comparecera: boolean
  created_at: string
}

interface Contribution {
  id: string
  name: string
  amount: number
  receipt_url?: string
  created_at: string
}

interface Gift {
  id: string
  name: string
  selected: boolean
  selected_by: string
  updated_at: string
}

export default function AdminPage() {
  const router = useRouter()
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [gifts, setGifts] = useState<Gift[]>([])
  const [confirmations, setConfirmations] = useState<Confirmation[]>([]) // Estado para confirmações
  const [view, setView] = useState<"pix" | "gifts" | "rsvp">("pix") // Adicionado "rsvp"
  const [loading, setLoading] = useState(true)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/admin/login")
      return
    }
    fetchData()
    setCheckingAuth(false)
  }

  async function fetchData() {
    setLoading(true)
    
    // Busca contribuições PIX
    const { data: pixData } = await supabase
      .from("pix_contributions")
      .select("*")
      .order("created_at", { ascending: false })

    // Busca presentes selecionados
    const { data: giftsData } = await supabase
      .from("gifts")
      .select("*")
      .eq("selected", true)
      .order("name", { ascending: true })

    // Busca confirmações de presença
    const { data: rsvpData } = await supabase
      .from("confirmacoes")
      .select("*")
      .order("created_at", { ascending: false })

    setContributions(pixData || [])
    setGifts(giftsData || [])
    setConfirmations(rsvpData || [])
    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  if (checkingAuth) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">Verificando acesso...</div>
  }

  const totalPix = contributions.reduce((acc, item) => acc + Number(item.amount), 0)
  const totalConfirmados = confirmations.filter(c => c.comparecera).length

  // Gráfico para PIX
  const groupedByDate = contributions.reduce((acc: any, item) => {
    const date = new Date(item.created_at).toLocaleDateString("pt-BR")
    if (!acc[date]) acc[date] = 0
    acc[date] += Number(item.amount)
    return acc
  }, {})

  const chartData = Object.keys(groupedByDate).map((date) => ({
    date,
    total: groupedByDate[date],
  })).reverse()

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-6 py-12">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-[#C65D3B]">Painel do Casal 💍</h1>
            <p className="text-stone-500">Acompanhe os presentes, contribuições e convidados</p>
          </div>

          <div className="flex gap-3">
            <button onClick={fetchData} className="bg-white p-3 rounded-full shadow-sm border border-stone-200 hover:bg-stone-50 transition">🔄</button>
            <button onClick={handleLogout} className="bg-[#C65D3B] text-white px-6 py-2 rounded-full font-bold hover:bg-[#A34320] transition shadow-md">Sair</button>
          </div>
        </div>

        {/* SWITCH DE ABAS ATUALIZADO */}
        <div className="flex flex-wrap gap-4 mb-8 bg-stone-200/50 p-1 rounded-2xl w-fit">
          <button onClick={() => setView("pix")} className={`px-6 py-3 rounded-xl font-bold transition ${view === "pix" ? "bg-white text-[#C65D3B] shadow-md" : "text-stone-500 hover:text-stone-700"}`}>PIX</button>
          <button onClick={() => setView("gifts")} className={`px-6 py-3 rounded-xl font-bold transition ${view === "gifts" ? "bg-white text-[#C65D3B] shadow-md" : "text-stone-500 hover:text-stone-700"}`}>Presentes</button>
          <button onClick={() => setView("rsvp")} className={`px-6 py-3 rounded-xl font-bold transition ${view === "rsvp" ? "bg-white text-[#C65D3B] shadow-md" : "text-stone-500 hover:text-stone-700"}`}>Presença (RSVP)</button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-stone-400">Carregando informações...</div>
        ) : (
          <>
            {/* CONTEÚDO PIX E PRESENTES (Mantidos como no seu código...) */}
            {view === "pix" && (
                /* ... seu código original do PIX ... */
                <div className="animate-in fade-in duration-500">
                    <div className="grid md:grid-cols-3 gap-6 mb-10">
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100">
                            <h3 className="text-stone-500 font-medium">Total em PIX</h3>
                            <p className="text-4xl font-black text-green-600 mt-2">{totalPix.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                        </div>
                    </div>
                    {/* Renderize a tabela de PIX aqui conforme seu código original */}
                </div>
            )}

            {/* NOVA ABA: PRESENÇA (RSVP) */}
            {view === "rsvp" && (
              <div className="animate-in fade-in duration-500">
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100">
                    <h3 className="text-stone-500 font-medium">Confirmaram Presença</h3>
                    <p className="text-4xl font-black text-green-600 mt-2">{totalConfirmados}</p>
                  </div>
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100">
                    <h3 className="text-stone-500 font-medium">Não poderão ir</h3>
                    <p className="text-4xl font-black text-red-400 mt-2">{confirmations.length - totalConfirmados}</p>
                  </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-sm border border-stone-100 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-stone-50 text-stone-500 text-sm uppercase tracking-widest text-left">
                        <th className="p-6">Nome do Convidado</th>
                        <th className="p-6">Status</th>
                        <th className="p-6">Data da Resposta</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {confirmations.map((item) => (
                        <tr key={item.id} className="hover:bg-stone-50/50 transition">
                          <td className="p-6 font-semibold text-stone-900">{item.nome}</td>
                          <td className="p-6">
                            {item.comparecera ? (
                              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Confirmado</span>
                            ) : (
                              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Não irá</span>
                            )}
                          </td>
                          <td className="p-6 text-stone-400 text-sm">
                            {new Date(item.created_at).toLocaleDateString("pt-BR")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {confirmations.length === 0 && (
                    <div className="p-20 text-center text-stone-400">Ninguém respondeu ao RSVP ainda.</div>
                  )}
                </div>
              </div>
            )}
            
            {/* CONTEÚDO PRESENTES (Seu código original aqui...) */}
            {view === "gifts" && (
                <div className="animate-in fade-in duration-500">
                    {/* ... sua tabela de presentes ... */}
                </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}