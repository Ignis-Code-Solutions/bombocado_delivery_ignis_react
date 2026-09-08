import React, { useState, useEffect, type JSX } from "react";
import { Heart, Leaf, Utensils, ShoppingBag } from "lucide-react";
import { buscar } from "../../services/Service";
import { useAuth } from "../../contexts/AuthContext"; // Usa o Hook que você criou
import type Produto from "../../models/Produto";

export default function Solidario(): JSX.Element {
  // Pega o token diretamente do seu hook useAuth
  const { token } = useAuth();

  const [produtosBackend, setProdutosBackend] = useState<Produto[]>([]);
  const [promocoes, setPromocoes] = useState<Produto[]>([]);
  const [doacoes, setDoacoes] = useState<Produto[]>([]);

  // Estado para guardar a doação que o usuário clicou
  const [doacaoSelecionada, setDoacaoSelecionada] = useState<Produto | null>(
    null,
  );

  // Função que o botão "Selecionar e Doar" vai executar
  function handleDoar() {
    if (!doacaoSelecionada) {
      alert("Por favor, selecione uma opção de doação primeiro!");
      return;
    }

    // Aqui você integraria com o Carrinho de Compras futuramente
    alert(
      `Doação "${doacaoSelecionada.nome}" no valor de R$ ${doacaoSelecionada.preco} adicionada com sucesso!`,
    );
  }

  // Chamada à API tipada com o seu Service
  useEffect(() => {
    if (token) {
      const carregarProdutos = async () => {
        try {
          // O seu buscar<T> já aplica o header de Authorization internamente
          const dados = await buscar<Produto[]>("/produtos", token);
          setProdutosBackend(dados);
        } catch (error) {
          console.error("Erro ao carregar os produtos do backend:", error);
        }
      };

      carregarProdutos();
    }
  }, [token]);

  // Filtro de Categorias
  useEffect(() => {
    if (produtosBackend.length > 0) {
      const listaPromocoes: Produto[] = produtosBackend.filter((p: Produto) => {
        const nomeCategoria = (p.categoria?.nome || "").toLowerCase();
        return (
          nomeCategoria.includes("surpresa") ||
          nomeCategoria.includes("promoção")
        );
      });

      const listaDoacoes: Produto[] = produtosBackend.filter((p: Produto) => {
        const nomeCategoria = (p.categoria?.nome || "").toLowerCase();
        return (
          nomeCategoria.includes("doação") || nomeCategoria.includes("solidári")
        );
      });

      setPromocoes(listaPromocoes);
      setDoacoes(listaDoacoes);
    }
  }, [produtosBackend]);

  return (
    <div className="min-h-screen bg-orange-50/30 pb-20 font-sans">
      {/* SEÇÃO 1: Impacto Real (Hero) */}
      <section className="max-w-7xl mx-auto px-4 pt-8 pb-12">
        <div className="bg-orange-50 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between border border-orange-100 shadow-sm">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <span className="text-orange-600 font-semibold text-sm flex items-center gap-2 mb-4 bg-orange-100 w-fit px-3 py-1 rounded-full">
              <Leaf size={16} /> Impacto Real Hoje
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Economize bem, <br />
              evite o desperdício
            </h1>

            <div className="flex gap-4 mt-8">
              <div className="bg-white px-4 py-3 rounded-xl shadow-sm border border-orange-50 flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                  <Utensils size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">1.240</p>
                  <p className="text-xs text-gray-500">refeições salvas</p>
                </div>
              </div>
              <div className="bg-white px-4 py-3 rounded-xl shadow-sm border border-orange-50 flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                  <Leaf size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">850 kg</p>
                  <p className="text-xs text-gray-500">CO₂ evitados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: Lotes Disponíveis */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-orange-600 font-bold flex items-center gap-2">
            <ShoppingBag size={20} /> Lotes Disponíveis Agora
          </span>
          <span className="text-sm text-gray-500 ml-auto">Rápido resgate</span>
        </div>

        {promocoes.map((produto: Produto) => {
          // 1. Converte a string para número
          const precoNumero: number = parseFloat(produto.preco) || 0;
          // 2. Faz o cálculo com a variável convertida
          const precoOriginalCalculado: number = precoNumero / 0.3;

          return (
            <div
              key={produto.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative flex flex-col h-full"
            >
              {/* ... resto do seu código da imagem e título ... */}

              <div className="flex items-center justify-between mt-auto pt-2">
                <div>
                  {/* 3. Usa as variáveis convertidas aqui: */}
                  <p className="text-xs text-gray-400 line-through">
                    R$ {precoOriginalCalculado.toFixed(2).replace(".", ",")}
                  </p>
                  <p className="text-xl font-bold text-orange-600">
                    R$ {precoNumero.toFixed(2).replace(".", ",")}
                  </p>
                </div>
                <button className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-full font-bold h-10 w-10 flex items-center justify-center transition-colors">
                  +
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {/* SEÇÃO 3: Doação Solidária (Doações filtradas do Backend) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-blue-900 rounded-3xl p-8 md:p-12 text-white relative shadow-lg">
          <div className="relative z-10">
            <span className="text-blue-200 text-sm font-semibold flex items-center gap-2 mb-3">
              <Heart size={16} fill="currentColor" /> Ação Solidária Direta
            </span>
            <h2 className="text-3xl font-bold mb-2">
              Doe uma Marmita Quentinha
            </h2>
            <p className="text-blue-200 mb-8 flex items-center gap-2">
              <span className="bg-blue-800 p-1 rounded-full">
                <Heart size={14} />
              </span>{" "}
              Entregue para: ONGs Parceiras do Centro de SP
            </p>

            {doacoes.length === 0 ? (
              <p className="text-blue-200 font-medium mb-6">
                Nenhuma opção de doação cadastrada no momento.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {doacoes.map((doacao: Produto) => {
                  const precoNumero: number = parseFloat(doacao.preco) || 0;
                  // Verifica se este card é o que está selecionado no momento
                  const isSelecionado = doacaoSelecionada?.id === doacao.id;

                  return (
                    <div
                      key={doacao.id}
                      onClick={() => setDoacaoSelecionada(doacao)} // Marca como selecionado ao clicar
                      className={`bg-white rounded-2xl p-6 text-center cursor-pointer transition-all transform flex flex-col justify-center
                        ${isSelecionado ? "ring-4 ring-orange-500 md:-translate-y-2" : "hover:ring-4 hover:ring-blue-500"}
                      `}
                    >
                      <h3 className="font-bold text-gray-900">{doacao.nome}</h3>
                      <p className="text-sm text-gray-500 mt-2 mb-4 line-clamp-2">
                        {doacao.descricao}
                      </p>
                      <p className="text-blue-600 font-bold text-xl mt-auto">
                        R$ {precoNumero.toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Botão atualizado com onClick e verificação de disable */}
            <button
              onClick={handleDoar}
              disabled={doacoes.length === 0}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2
                ${
                  doacoes.length === 0
                    ? "bg-blue-800 text-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500 text-white"
                }
              `}
            >
              <Heart size={20} fill="currentColor" /> Selecionar e Doar
            </button>

            <p className="text-center text-xs text-blue-300 mt-4">
              100% repassado • Acompanhe a entrega com foto no menu Pedidos
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
