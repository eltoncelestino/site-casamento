// "use client"

// import { useEffect, useState } from "react"
// import { supabase } from "@/lib/supabase"
// import { useRouter } from "next/navigation"
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts"

// // Nova interface para as confirmações
// interface Confirmation {
//   id: string
//   nome: string
//   comparecera: boolean
//   created_at: string
// }

// interface Contribution {
//   id: string
//   name: string
//   amount: number
//   receipt_url?: string
//   created_at: string
// }

// interface Gift {
//   id: string
//   name: string
//   selected: boolean
//   selected_by: string
//   updated_at: string
// }

// export default function AdminPage() {
//   const router = useRouter()
//   const [contributions, setContributions] = useState<Contribution[]>([])
//   const [gifts, setGifts] = useState<Gift[]>([])
//   const [confirmations, setConfirmations] = useState<Confirmation[]>([]) // Estado para confirmações
//   const [view, setView] = useState<"pix" | "gifts" | "rsvp">("pix") // Adicionado "rsvp"
//   const [loading, setLoading] = useState(true)
//   const [checkingAuth, setCheckingAuth] = useState(true)

//   useEffect(() => {
//     checkUser()
//   }, [])

//   async function checkUser() {
//     const { data: { user } } = await supabase.auth.getUser()
//     if (!user) {
//       router.push("/admin/login")
//       return
//     }
//     fetchData()
//     setCheckingAuth(false)
//   }

//   async function fetchData() {
//     setLoading(true)
    
//     // Busca contribuições PIX
//     const { data: pixData } = await supabase
//       .from("pix_contributions")
//       .select("*")
//       .order("created_at", { ascending: false })

//     // Busca presentes selecionados
//     const { data: giftsData } = await supabase
//       .from("gifts")
//       .select("*")
//       .eq("selected", true)
//       .order("name", { ascending: true })

//     // Busca confirmações de presença
//     const { data: rsvpData } = await supabase
//       .from("confirmacoes")
//       .select("*")
//       .order("created_at", { ascending: false })

//     setContributions(pixData || [])
//     setGifts(giftsData || [])
//     setConfirmations(rsvpData || [])
//     setLoading(false)
//   }

//   async function handleLogout() {
//     await supabase.auth.signOut()
//     router.push("/admin/login")
//   }

//   if (checkingAuth) {
//     return <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">Verificando acesso...</div>
//   }

//   const totalPix = contributions.reduce((acc, item) => acc + Number(item.amount), 0)
//   const totalConfirmados = confirmations.filter(c => c.comparecera).length

//   // Gráfico para PIX
//   const groupedByDate = contributions.reduce((acc: any, item) => {
//     const date = new Date(item.created_at).toLocaleDateString("pt-BR")
//     if (!acc[date]) acc[date] = 0
//     acc[date] += Number(item.amount)
//     return acc
//   }, {})

//   const chartData = Object.keys(groupedByDate).map((date) => ({
//     date,
//     total: groupedByDate[date],
//   })).reverse()

//   return (
//     <main className="min-h-screen bg-[#FAF7F2] px-6 py-12">
//       <div className="max-w-6xl mx-auto">
        
//         {/* HEADER */}
//         <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
//           <div>
//             <h1 className="text-4xl font-bold text-[#C65D3B]">Painel do Casal 💍</h1>
//             <p className="text-stone-500">Acompanhe os presentes, contribuições e convidados</p>
//           </div>

//           <div className="flex gap-3">
//             <button onClick={fetchData} className="bg-white p-3 rounded-full shadow-sm border border-stone-200 hover:bg-stone-50 transition">🔄</button>
//             <button onClick={handleLogout} className="bg-[#C65D3B] text-white px-6 py-2 rounded-full font-bold hover:bg-[#A34320] transition shadow-md">Sair</button>
//           </div>
//         </div>

//         {/* SWITCH DE ABAS ATUALIZADO */}
//         <div className="flex flex-wrap gap-4 mb-8 bg-stone-200/50 p-1 rounded-2xl w-fit">
//           <button onClick={() => setView("pix")} className={`px-6 py-3 rounded-xl font-bold transition ${view === "pix" ? "bg-white text-[#C65D3B] shadow-md" : "text-stone-500 hover:text-stone-700"}`}>PIX</button>
//           <button onClick={() => setView("gifts")} className={`px-6 py-3 rounded-xl font-bold transition ${view === "gifts" ? "bg-white text-[#C65D3B] shadow-md" : "text-stone-500 hover:text-stone-700"}`}>Presentes</button>
//           <button onClick={() => setView("rsvp")} className={`px-6 py-3 rounded-xl font-bold transition ${view === "rsvp" ? "bg-white text-[#C65D3B] shadow-md" : "text-stone-500 hover:text-stone-700"}`}>Presença (RSVP)</button>
//         </div>

//         {loading ? (
//           <div className="text-center py-20 text-stone-400">Carregando informações...</div>
//         ) : (
//           <>
//             {/* CONTEÚDO PIX E PRESENTES (Mantidos como no seu código...) */}
//             {view === "pix" && (
//                 /* ... seu código original do PIX ... */
//                 <div className="animate-in fade-in duration-500">
//                     <div className="grid md:grid-cols-3 gap-6 mb-10">
//                         <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100">
//                             <h3 className="text-stone-500 font-medium">Total em PIX</h3>
//                             <p className="text-4xl font-black text-green-600 mt-2">{totalPix.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
//                         </div>
//                     </div>
//                     {/* Renderize a tabela de PIX aqui conforme seu código original */}
//                 </div>
//             )}

//             {/* NOVA ABA: PRESENÇA (RSVP) */}
//             {view === "rsvp" && (
//               <div className="animate-in fade-in duration-500">
//                 <div className="grid md:grid-cols-3 gap-6 mb-10">
//                   <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100">
//                     <h3 className="text-stone-500 font-medium">Confirmaram Presença</h3>
//                     <p className="text-4xl font-black text-green-600 mt-2">{totalConfirmados}</p>
//                   </div>
//                   <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100">
//                     <h3 className="text-stone-500 font-medium">Não poderão ir</h3>
//                     <p className="text-4xl font-black text-red-400 mt-2">{confirmations.length - totalConfirmados}</p>
//                   </div>
//                 </div>

//                 <div className="bg-white rounded-[2.5rem] shadow-sm border border-stone-100 overflow-hidden">
//                   <table className="w-full">
//                     <thead>
//                       <tr className="bg-stone-50 text-stone-500 text-sm uppercase tracking-widest text-left">
//                         <th className="p-6">Nome do Convidado</th>
//                         <th className="p-6">Status</th>
//                         <th className="p-6">Data da Resposta</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-stone-100">
//                       {confirmations.map((item) => (
//                         <tr key={item.id} className="hover:bg-stone-50/50 transition">
//                           <td className="p-6 font-semibold text-stone-900">{item.nome}</td>
//                           <td className="p-6">
//                             {item.comparecera ? (
//                               <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Confirmado</span>
//                             ) : (
//                               <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Não irá</span>
//                             )}
//                           </td>
//                           <td className="p-6 text-stone-400 text-sm">
//                             {new Date(item.created_at).toLocaleDateString("pt-BR")}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                   {confirmations.length === 0 && (
//                     <div className="p-20 text-center text-stone-400">Ninguém respondeu ao RSVP ainda.</div>
//                   )}
//                 </div>
//               </div>
//             )}
            
//             {/* CONTEÚDO PRESENTES (Seu código original aqui...) */}
//             {view === "gifts" && (
//                 <div className="animate-in fade-in duration-500">
//                     {/* ... sua tabela de presentes ... */}
//                 </div>
//             )}
//           </>
//         )}
//       </div>
//     </main>
//   )
// }



"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import * as XLSX from "xlsx"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts"

const COLORS = ["#C65D3B", "#E8A87C", "#41B3A3", "#2A9D8F", "#264653"]

export default function AdminPage() {
  const [tab, setTab] = useState("dashboard")
  const [gifts, setGifts] = useState<any[]>([])
  const [confirmacoes, setConfirmacoes] = useState<any[]>([])
  const [pix, setPix] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState<any>({
    id: null,
    name: "",
    description: "",
    price: "",
    product_url: "",
    image: null
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)

    const { data: g } = await supabase.from("gifts").select("*")
    const { data: c } = await supabase.from("confirmacoes").select("*")
    const { data: p } = await supabase.from("pix_contributions").select("*")

    setGifts(g || [])
    setConfirmacoes(c || [])
    setPix(p || [])
    setLoading(false)
  }

  // =============================
  // CRUD PRESENTES
  // =============================

  async function salvarPresente() {
    if (!form.name || !form.price) {
      alert("Nome e valor são obrigatórios")
      return
    }

    let imageUrl = null

    if (form.image) {
      const fileName = `gift-${Date.now()}`
      const { error } = await supabase.storage
        .from("receipts")
        .upload(fileName, form.image)

      if (!error) {
        const { data } = supabase.storage
          .from("receipts")
          .getPublicUrl(fileName)

        imageUrl = data.publicUrl
      }
    }

    if (form.id) {
      await supabase.from("gifts")
        .update({
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          product_url: form.product_url,
          ...(imageUrl && { image_url: imageUrl })
        })
        .eq("id", form.id)
    } else {
      await supabase.from("gifts").insert({
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        product_url: form.product_url,
        image_url: imageUrl
      })
    }

    setForm({
      id: null,
      name: "",
      description: "",
      price: "",
      product_url: "",
      image: null
    })

    fetchData()
  }

  async function editarPresente(g: any) {
    setForm({ ...g, image: null })
    setTab("presentes")
  }

  async function removerPresente(id: string) {
    await supabase.from("gifts").delete().eq("id", id)
    fetchData()
  }

  // =============================
  // CONFIRMAÇÕES
  // =============================

  async function alternarPresenca(id: string, atual: boolean) {
    await supabase
      .from("confirmacoes")
      .update({ comparecera: !atual })
      .eq("id", id)

    fetchData()
  }

  async function excluirConfirmacao(id: string) {
    await supabase.from("confirmacoes").delete().eq("id", id)
    fetchData()
  }

  // =============================
  // EXPORTAR EXCEL
  // =============================

  function exportarExcel() {
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(gifts), "Presentes")
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(confirmacoes), "Confirmacoes")
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(pix), "PIX")
    XLSX.writeFile(wb, "casamento-relatorio.xlsx")
  }

  if (loading) return <div className="p-10">Carregando...</div>

  const totalPix = pix.reduce((acc, p) => acc + Number(p.amount || 0), 0)
  const confirmados = confirmacoes.filter(c => c.comparecera).length
  const ausentes = confirmacoes.filter(c => !c.comparecera).length

  const pixData = pix.map(p => ({
    name: p.name || "Anônimo",
    value: parseFloat(p.amount || 0)
  }))

  return (
    <div className="flex min-h-screen bg-[#F8F5F2]">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-lg p-6 hidden md:block">
        <h1 className="text-2xl font-bold text-[#C65D3B] mb-8">
          Painel Admin
        </h1>

        {["dashboard", "presentes", "confirmacoes", "pix"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`block w-full text-left px-4 py-3 rounded-xl mb-3 transition
            ${tab === t
                ? "bg-[#C65D3B] text-white"
                : "hover:bg-gray-100"}`}
          >
            {t.toUpperCase()}
          </button>
        ))}

        <button
          onClick={exportarExcel}
          className="mt-6 bg-green-600 text-white w-full py-3 rounded-xl"
        >
          Exportar Excel
        </button>
      </aside>

      {/* CONTEÚDO */}
      <div className="flex-1 p-8 space-y-8">

        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <>
            <div className="grid md:grid-cols-3 gap-6">
              <StatCard title="Total PIX" value={`R$ ${totalPix.toFixed(2)}`} />
              <StatCard title="Confirmados" value={confirmados} />
              <StatCard title="Ausentes" value={ausentes} />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="font-semibold mb-4">PIX por Pessoa</h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={pixData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#C65D3B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* PRESENTES */}
        {tab === "presentes" && (
          <>
            <div className="bg-white p-6 rounded-2xl shadow grid md:grid-cols-2 gap-4">
              <input placeholder="Nome"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="p-3 border rounded-xl"
              />
              <input placeholder="Valor"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                className="p-3 border rounded-xl"
              />
              <input placeholder="Link"
                value={form.product_url}
                onChange={e => setForm({ ...form, product_url: e.target.value })}
                className="p-3 border rounded-xl md:col-span-2"
              />
              <textarea placeholder="Descrição"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="p-3 border rounded-xl md:col-span-2"
              />
              <input type="file"
                onChange={e => setForm({ ...form, image: e.target.files?.[0] })}
                className="md:col-span-2"
              />
              <button
                onClick={salvarPresente}
                className="bg-[#C65D3B] text-white py-3 rounded-xl md:col-span-2"
              >
                {form.id ? "Atualizar" : "Cadastrar"}
              </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gifts.map(g => (
                <div key={g.id} className="bg-white rounded-2xl shadow-md p-5 flex flex-col">
                  {g.image_url && (
                    <img src={g.image_url}
                      className="h-40 w-full object-cover rounded-xl mb-4" />
                  )}
                  <h3 className="font-semibold">{g.name}</h3>
                  <p className="text-sm text-gray-500">{g.description}</p>
                  <p className="text-[#C65D3B] font-bold mt-2">
                    R$ {Number(g.price).toFixed(2)}
                  </p>
                  <div className="mt-auto flex gap-2 pt-4">
                    <button
                      onClick={() => editarPresente(g)}
                      className="flex-1 bg-[#E8A87C] text-white py-2 rounded-lg">
                      Editar
                    </button>
                    <button
                      onClick={() => removerPresente(g.id)}
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg">
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* CONFIRMAÇÕES */}
        {tab === "confirmacoes" && (
          <div className="grid md:grid-cols-2 gap-6">
            {confirmacoes.map(c => (
              <div key={c.id} className="bg-white p-5 rounded-2xl shadow">
                <h3 className="font-semibold">{c.nome}</h3>
                <p className={c.comparecera ? "text-green-600" : "text-red-500"}>
                  {c.comparecera ? "Confirmado" : "Não vai"}
                </p>
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => alternarPresenca(c.id, c.comparecera)}
                    className="bg-[#C65D3B] text-white px-4 py-2 rounded-lg">
                    Alterar
                  </button>
                  <button
                    onClick={() => excluirConfirmacao(c.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg">
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PIX */}
        {tab === "pix" && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pixData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={130}
                  label
                >
                  {pixData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

      </div>
    </div>
  )
}

function StatCard({ title, value }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold text-[#C65D3B] mt-2">
        {value}
      </h2>
    </div>
  )
}