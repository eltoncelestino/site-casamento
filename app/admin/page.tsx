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
  const [view, setView] = useState<"pix" | "gifts">("pix")
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

    // Busca apenas presentes que foram selecionados
    const { data: giftsData } = await supabase
      .from("gifts")
      .select("*")
      .eq("selected", true)
      .order("name", { ascending: true })

    setContributions(pixData || [])
    setGifts(giftsData || [])
    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        Verificando acesso...
      </div>
    )
  }

  const totalPix = contributions.reduce((acc, item) => acc + Number(item.amount), 0)

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
            <p className="text-stone-500">Acompanhe os presentes e contribuições</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchData}
              className="bg-white p-3 rounded-full shadow-sm hover:bg-stone-50 transition border border-stone-200"
              title="Atualizar dados"
            >
              🔄
            </button>
            <button
              onClick={handleLogout}
              className="bg-[#C65D3B] text-white px-6 py-2 rounded-full font-bold hover:bg-[#A34320] transition shadow-md"
            >
              Sair
            </button>
          </div>
        </div>

        {/* SWITCH DE ABAS */}
        <div className="flex gap-4 mb-8 bg-stone-200/50 p-1 rounded-2xl w-fit">
          <button
            onClick={() => setView("pix")}
            className={`px-8 py-3 rounded-xl font-bold transition ${view === "pix" ? "bg-white text-[#C65D3B] shadow-md" : "text-stone-500 hover:text-stone-700"}`}
          >
            Contribuições PIX
          </button>
          <button
            onClick={() => setView("gifts")}
            className={`px-8 py-3 rounded-xl font-bold transition ${view === "gifts" ? "bg-white text-[#C65D3B] shadow-md" : "text-stone-500 hover:text-stone-700"}`}
          >
            Presentes Escolhidos
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-stone-400">Carregando informações...</div>
        ) : (
          <>
            {/* CONTEÚDO PIX */}
            {view === "pix" && (
              <div className="animate-in fade-in duration-500">
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100">
                    <h3 className="text-stone-500 font-medium">Total em PIX</h3>
                    <p className="text-4xl font-black text-green-600 mt-2">
                      {totalPix.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </p>
                  </div>
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100">
                    <h3 className="text-stone-500 font-medium">Qtd. de PIX</h3>
                    <p className="text-4xl font-black text-[#C65D3B] mt-2">{contributions.length}</p>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100 mb-10">
                  <h3 className="text-2xl font-serif text-stone-800 font-bold mb-6">Evolução de Recebimento</h3>
                  <div style={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Bar dataKey="total" fill="#C65D3B" radius={[10, 10, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-sm border border-stone-100 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-stone-50 text-stone-500 text-sm uppercase tracking-widest text-left">
                        <th className="p-6">Convidado</th>
                        <th className="p-6">Valor</th>
                        <th className="p-6">Comprovante</th>
                        <th className="p-6">Data</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {contributions.map((item) => (
                        <tr key={item.id} className="hover:bg-stone-50/50 transition">
                          <td className="p-6 font-semibold text-stone-900">{item.name}</td>
                          <td className="p-6 text-green-600 font-bold">
                            {Number(item.amount).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </td>
                          <td className="p-6">
                            {item.receipt_url ? (
                              <a 
                                href={item.receipt_url} 
                                target="_blank" 
                                className="text-[#C65D3B] text-sm font-bold underline hover:text-[#A34320]"
                              >
                                Ver Imagem
                              </a>
                            ) : "—"}
                          </td>
                          <td className="p-6 text-stone-400 text-sm">
                            {new Date(item.created_at).toLocaleDateString("pt-BR")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CONTEÚDO PRESENTES */}
            {view === "gifts" && (
              <div className="animate-in fade-in duration-500">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 mb-10 inline-block">
                  <h3 className="text-stone-500 font-medium">Total de Presentes Escolhidos</h3>
                  <p className="text-4xl font-black text-[#C65D3B] mt-2">{gifts.length}</p>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-sm border border-stone-100 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-stone-50 text-stone-500 text-sm uppercase tracking-widest text-left">
                        <th className="p-6">Presente Escolhido</th>
                        <th className="p-6">Quem Escolheu</th>
                        <th className="p-6">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {gifts.map((gift) => (
                        <tr key={gift.id} className="hover:bg-stone-50/50 transition">
                          <td className="p-6 font-bold text-stone-800">{gift.name}</td>
                          <td className="p-6 font-medium text-[#C65D3B]">{gift.selected_by}</td>
                          <td className="p-6 text-xs font-bold text-green-500">
                            <span className="bg-green-50 px-3 py-1 rounded-full uppercase">Confirmado</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {gifts.length === 0 && (
                    <div className="p-20 text-center text-stone-400">Nenhum presente foi escolhido na lista ainda.</div>
                  )}
                </div>
              </div>  
            )}
          </>
        )}
      </div>
    </main>
  )
}