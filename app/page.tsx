"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

interface Gift {
  id: string
  name: string
  selected: boolean
  selected_by?: string
  image_url?: string
  product_url?: string
}

export default function Home() {
  const [step, setStep] = useState<"intro" | "name" | "list">("intro")
  const [gifts, setGifts] = useState<Gift[]>([])
  const [name, setName] = useState("")
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [successGift, setSuccessGift] = useState<Gift | null>(null)

  // Estados para o PIX
  const [pixName, setPixName] = useState("")
  const [amount, setAmount] = useState<number>(50)
  const [file, setFile] = useState<File | null>(null)
  const [pixLoading, setPixLoading] = useState(false)

  useEffect(() => {
    if (step === "list") fetchGifts()
  }, [step])

  async function fetchGifts() {
    const { data } = await supabase.from("gifts").select("*").order("name")
    setGifts(data || [])
  }

  async function selectGift(gift: Gift) {
    if (!name.trim()) {
      setStep("name")
      return
    }

    setLoadingId(gift.id)
    
    const { error } = await supabase
      .from("gifts")
      .update({ selected: true, selected_by: name })
      .eq("id", gift.id)
      .eq("selected", false)

    setLoadingId(null)

    if (!error) {
      const finalUrl = gift.product_url || "https://www.amazon.com.br/"
      setSuccessGift({ ...gift, product_url: finalUrl })
      fetchGifts()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      alert("Este presente acabou de ser escolhido por outra pessoa! ❤️")
      fetchGifts()
    }
  }

  async function handlePix(e: React.FormEvent) {
    e.preventDefault()
    if (!pixName || !file) return alert("Por favor, preencha seu nome e anexe o comprovante.")
    
    setPixLoading(true)
    try {
      const fileName = `${Date.now()}-${file.name}`
      await supabase.storage.from("receipts").upload(fileName, file)
      const { data: { publicUrl } } = supabase.storage.from("receipts").getPublicUrl(fileName)
      
      await supabase.from("pix_contributions").insert([
        { name: pixName, amount, receipt_url: publicUrl }
      ])

      alert("Recebemos sua contribuição! Muito obrigado pelo carinho! ❤️")
      setPixName(""); setFile(null); setAmount(50);
    } catch (err) {
      alert("Erro ao enviar. Tente novamente.")
    } finally {
      setPixLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#4A443F] font-light overflow-x-hidden">
      
      {/* DECORAÇÃO DE FUNDO */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#C65D3B]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#A34320]/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        
        {/* NAVEGAÇÃO */}
        <nav className="flex justify-between items-center mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
          <span className="text-xl font-serif tracking-widest text-[#C65D3B]">CLARICE & ELTON</span>
          {step !== "intro" && (
            <button 
              onClick={() => {setStep("intro"); setSuccessGift(null)}} 
              className="text-sm uppercase tracking-widest hover:text-[#C65D3B] transition-colors border-b border-transparent hover:border-[#C65D3B]"
            >
              ← Início
            </button>
          )}
        </nav>

        {/* ETAPA 1: HOME */}
        {step === "intro" && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-in fade-in zoom-in-95 duration-1000">
            <h1 className="text-7xl md:text-9xl font-serif text-[#C65D3B] mb-6">Clarice & Elton</h1>
            <p className="text-lg md:text-xl max-w-xl mx-auto mb-12 italic text-stone-500">
              "O amor aquece a alma como o pôr do sol ilumina o horizonte."
            </p>
            <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
              <button onClick={() => setStep("name")} className="flex-1 bg-[#C65D3B] text-white py-5 rounded-full font-medium shadow-lg hover:bg-[#A34320] transition-all">
                Lista de Presentes
              </button>
              <button onClick={() => {setStep("list"); setName("")}} className="flex-1 bg-white border border-stone-200 py-5 rounded-full font-medium shadow-sm hover:shadow-md transition-all">
                Presente via PIX
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 2: NOME */}
        {step === "name" && (
          <div className="max-w-lg mx-auto py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bg-white/70 backdrop-blur-xl p-12 rounded-[40px] shadow-2xl border border-white">
              <h2 className="text-3xl font-serif text-[#C65D3B] mb-6 text-center">Boas-vindas!</h2>
              <input 
                type="text" 
                placeholder="Seu nome completo" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white p-6 rounded-2xl mb-8 outline-none border border-stone-100 focus:border-[#C65D3B] text-center text-lg shadow-inner"
              />
              <button disabled={!name} onClick={() => setStep("list")} className="w-full bg-[#C65D3B] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#A34320] disabled:opacity-30 transition-all">
                Entrar na Lista
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 3: LISTA COMPLETA */}
        {step === "list" && (
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
            
            {/* SUCESSO AO ESCOLHER */}
            {successGift && (
              <div className="mb-16 bg-white/80 backdrop-blur-2xl border border-green-200 p-10 rounded-[40px] shadow-2xl text-center max-w-2xl mx-auto">
                <h3 className="text-2xl font-serif text-stone-800 mb-2">Excelente Escolha!</h3>
                <p className="text-stone-500 mb-8">Reservamos <b>{successGift.name}</b> para você.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href={successGift.product_url} target="_blank" className="bg-[#C65D3B] text-white px-10 py-5 rounded-full font-bold shadow-xl">
                    Ir para a Loja Agora
                  </a>
                  <button onClick={() => setSuccessGift(null)} className="px-10 py-5 rounded-full border border-stone-200 font-medium">
                    Continuar no Site
                  </button>
                </div>
              </div>
            )}

            <header className="text-center mb-20">
              <h2 className="text-5xl font-serif text-[#C65D3B] mb-4">Nossa Seleção</h2>
              <p className="text-stone-500 italic">Cada detalhe foi pensado para o nosso novo começo.</p>
            </header>

            {/* GRID DE PRESENTES (A parte que tinha sumido) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-32">
              {gifts.map((gift) => (
                <div key={gift.id} className="group bg-white rounded-[35px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-stone-50 flex flex-col">
                  <div className="relative h-80 overflow-hidden">
                    <img 
                      src={gift.image_url || "https://images.unsplash.com/photo-1520408222757-6f9f95d87d5d?q=80&w=800&auto=format&fit=crop"} 
                      alt={gift.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    {gift.selected && (
                      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-white/90 text-[#C65D3B] px-8 py-2 rounded-full font-bold text-xs tracking-[0.2em]">JÁ ESCOLHIDO</span>
                      </div>
                    )}
                  </div>
                  <div className="p-8 text-center flex-grow flex flex-col justify-between">
                    <h3 className="text-xl font-serif mb-6 text-stone-800">{gift.name}</h3>
                    {!gift.selected ? (
                      <button 
                        onClick={() => selectGift(gift)}
                        disabled={loadingId === gift.id}
                        className="w-full py-4 rounded-2xl border border-[#C65D3B] text-[#C65D3B] font-bold text-xs uppercase tracking-widest group-hover:bg-[#C65D3B] group-hover:text-white transition-all disabled:opacity-50"
                      >
                        {loadingId === gift.id ? "Reservando..." : "Escolher Presente"}
                      </button>
                    ) : (
                      <p className="text-sm text-stone-400 italic">Escolhido por {gift.selected_by}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* SEÇÃO PIX CORRIGIDA */}
            <div id="pix-section" className="max-w-4xl mx-auto pt-20 border-t border-stone-200">
              <div className="bg-[#C65D3B] rounded-[40px] md:rounded-[60px] p-8 md:p-20 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                
                <div className="relative grid md:grid-cols-2 gap-12 items-center">
                  <div className="text-left">
                    <h2 className="text-4xl font-serif mb-6">Mimo em PIX</h2>
                    <p className="text-white/80 mb-10 font-light text-lg">
                      Se preferir nos presentear de forma livre, utilize nossa chave:
                    </p>
                    {/* Chave com break-all para não vazar da caixa no mobile */}
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-[30px] border border-white/20">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-white/60 block mb-2 font-bold">Chave E-mail</span>
                      <p className="text-lg md:text-xl font-mono break-all select-all border-b border-white/20 pb-2">
                        clariceeelton@email.com
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handlePix} className="space-y-4 bg-white/5 p-6 md:p-8 rounded-[40px] border border-white/10">
                    <input type="text" placeholder="Seu Nome" required value={pixName} onChange={(e) => setPixName(e.target.value)} className="w-full bg-white text-stone-800 p-4 rounded-xl outline-none" />
                    <input type="number" placeholder="Valor (R$)" required value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full bg-white text-stone-800 p-4 rounded-xl outline-none" />
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] uppercase text-white/60 ml-2">Comprovante</label>
                      <input type="file" required accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-xs text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-white file:text-[#C65D3B] file:font-bold" />
                    </div>
                    <button disabled={pixLoading} className="w-full bg-white text-[#C65D3B] py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-stone-100 transition-all disabled:opacity-50">
                      {pixLoading ? "ENVIANDO..." : "Confirmar Envio"}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <footer className="mt-40 text-center pb-20 opacity-40">
              <p className="font-serif text-3xl text-[#C65D3B] mb-4">Clarice & Elton</p>
              <p className="text-xs uppercase tracking-[0.5em]">Com carinho, nos vemos em breve!</p>
            </footer>
          </div>
        )}
      </div>
    </main>
  )
}