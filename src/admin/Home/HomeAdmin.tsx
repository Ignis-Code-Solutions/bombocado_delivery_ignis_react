import { useEffect, useState } from 'react'
import { buscar } from '../../services/Service'
import type Categoria from '../../models/Categoria'
import type Produto from '../../models/Produto'
import { Link } from 'react-router-dom'
import VisualizarProduto from './VizualizarProduto'
import EditarProduto from '../produtos/editarproduto/EditarProduto'
import { useAuth } from '../../contexts/AuthContext'

function HomeAdmin() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [carregando, setCarregando] = useState(true)
  const [visualizarAberto, setVisualizarAberto] = useState(false)
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null)
  const [editarAberto, setEditarAberto] = useState(false)
  const { token } = useAuth()

  const carregarDados = async () => {
    try {
      setCarregando(true)

      const [produtosResposta, categoriasResposta] = await Promise.all([
        buscar<any>('/produtos', token),
        buscar<any>('/categorias', token)
      ])

      if (Array.isArray(produtosResposta)) {
        setProdutos(produtosResposta)
      } else if (Array.isArray(produtosResposta?.content)) {
        setProdutos(produtosResposta.content)
      } else if (Array.isArray(produtosResposta?.data)) {
        setProdutos(produtosResposta.data)
      } else {
        setProdutos([])
      }

      if (Array.isArray(categoriasResposta)) {
        setCategorias(categoriasResposta)
      } else if (Array.isArray(categoriasResposta?.content)) {
        setCategorias(categoriasResposta.content)
      } else if (Array.isArray(categoriasResposta?.data)) {
        setCategorias(categoriasResposta.data)
      } else {
        setCategorias([])
      }
    } catch {
      setProdutos([])
      setCategorias([])
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  const abrirVisualizacao = (produto: Produto) => {
    setProdutoSelecionado(produto)
    setVisualizarAberto(true)
  }

  const fecharVisualizacao = () => {
    setVisualizarAberto(false)
    setProdutoSelecionado(null)
  }

  const abrirEdicao = () => {
    setVisualizarAberto(false)
    setEditarAberto(true)
  }

  const fecharEdicao = () => {
    setEditarAberto(false)
    setProdutoSelecionado(null)
  }

  return (
    <main className="min-h-screen bg-[#fff8f5] px-6 py-8 md:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-orange-600">
              painel • visão geral
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
              Visão Geral
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-zinc-500 md:text-base">
              Acompanhe Pedidos, Produtos, Categorias e Clientes em tempo real.
            </p>
          </div>

          <button className="flex h-11 w-fit items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 hover:shadow-md">
            <span className="text-lg">+</span>
          </button>
        </div>

        <div className="rounded-2xl mt-5 border border-zinc-100 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-zinc-900">
                Produtos
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Produtos e categorias cadastrados no sistema
              </p>
            </div>

            <Link
              to="/admin/produtos"
              className="w-fit text-sm font-semibold text-orange-600 transition hover:text-orange-700"
            >
              Ver todos
            </Link>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-orange-50 p-5">
              <p className="text-sm font-medium text-orange-700">
                Produtos cadastrados
              </p>

              <p className="mt-2 text-3xl font-bold text-orange-900">
                {carregando ? '—' : produtos.length}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-5">
              <p className="text-sm font-medium text-blue-700">
                Categorias cadastradas
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-900">
                {carregando ? '—' : categorias.length}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-100">
            <table className="w-full min-w-175">
              <thead className="bg-[#fff7f3]">
                <tr className="border-b border-zinc-100">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    ID
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Produto
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Categoria
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Preço
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Tempo de entrega
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {carregando ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-14 text-center text-sm text-zinc-400"
                    >
                      Carregando produtos...
                    </td>
                  </tr>
                ) : produtos.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-14 text-center text-sm text-zinc-400"
                    >
                      Nenhum produto encontrado
                    </td>
                  </tr>
                ) : (
                  produtos.slice(0, 5).map((produto) => (
                    <tr
                      key={produto.id}
                      className="border-b border-zinc-100 transition hover:bg-[#fffaf8]"
                    >
                      <td className="px-5 py-4 text-sm font-semibold text-zinc-600">
                        #{produto.id}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {produto.imagem ? (
                            <img
                              src={produto.imagem}
                              alt={produto.nome}
                              className="h-11 w-11 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">
                              🍴
                            </div>
                          )}

                          <span className="text-sm font-semibold text-zinc-800">
                            {produto.nome}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-zinc-500">
                        {produto.categoria?.nome || '—'}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-zinc-800">
                        R$ {Number(produto.preco).toFixed(2).replace('.', ',')}
                      </td>

                      <td className="px-5 py-4 text-sm text-zinc-500">
                        {produto.tempoEntrega
                          ? `${produto.tempoEntrega} min`
                          : '—'}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => abrirVisualizacao(produto)}
                          className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600 transition hover:border-orange-300 hover:text-orange-600"
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <VisualizarProduto
        aberto={visualizarAberto}
        fechar={fecharVisualizacao}
        editar={abrirEdicao}
        produto={produtoSelecionado}
      />

      <EditarProduto
        aberto={editarAberto}
        fechar={fecharEdicao}
        produto={produtoSelecionado}
        atualizarProdutos={carregarDados}
      />
    </main>
  )
}

export default HomeAdmin
