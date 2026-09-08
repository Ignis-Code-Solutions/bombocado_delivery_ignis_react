import { useEffect, useState } from 'react'
import { buscar } from '../../../services/Service'
import type Categoria from '../../../models/Categoria'
import EditarCategoria from '../editarcategoria/EditarCategoria'
import DeletarCategoria from '../deletarcategoria/DeletarCategoria'
import ModalCategoria from '../modalcategoria/ModalCategoria'
import { useAuth } from '../../../contexts/AuthContext'

function CategoriasAdmin() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [busca, setBusca] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [editarAberto, setEditarAberto] = useState(false)
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<Categoria | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [deletarAberto, setDeletarAberto] = useState(false)
  const { token } = useAuth()

  const carregarCategorias = async () => {
    try {
      setCarregando(true)
      setErro('')

      const resposta = await buscar<any>('/categorias', token)

      if (Array.isArray(resposta)) {
        setCategorias(resposta)
      } else if (Array.isArray(resposta?.content)) {
        setCategorias(resposta.content)
      } else if (Array.isArray(resposta?.data)) {
        setCategorias(resposta.data)
      } else {
        setCategorias([])
      }
    } catch {
      setErro('Não foi possível carregar as categorias.')
      setCategorias([])
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarCategorias()
  }, [])

  const abrirEdicao = (categoria: Categoria) => {
    setCategoriaSelecionada(categoria)
    setEditarAberto(true)
  }

  const fecharEdicao = () => {
    setEditarAberto(false)
    setCategoriaSelecionada(null)
  }

  const abrirExclusao = (categoria: Categoria) => {
  setCategoriaSelecionada(categoria)
  setDeletarAberto(true)
}

const fecharExclusao = () => {
  setDeletarAberto(false)
  setCategoriaSelecionada(null)
}

  const categoriasFiltradas = categorias.filter((categoria) =>
    categoria.nome.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-[#fff8f5] px-6 py-8 md:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-orange-600">
              painel • categorias
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
              Categorias
            </h1>

            <p className="mt-2 text-sm text-zinc-500 md:text-base">
              Acompanhe categorias, edite e exclua.
            </p>
          </div>

          <button
            onClick={() => setModalAberto(true)}
            className="flex w-fit items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 hover:shadow-md"
          >
            <span className="text-lg leading-none">+</span>
            Adicionar Categoria
          </button>
        </div>

        <div className="mb-5 mt-5 flex flex-col gap-3 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm md:flex-row">
          <div className="relative flex-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            <input
              type="text"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Buscar Categoria..."
              className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-zinc-900">
                Categorias
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Gerencie as categorias cadastradas
              </p>
            </div>

            <span className="text-sm text-zinc-400">
              {categoriasFiltradas.length} categorias
            </span>
          </div>

          {erro && (
            <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {erro}
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-zinc-100">
            <table className="w-full min-w-175">
              <thead className="bg-[#fff7f3]">
                <tr className="border-b border-zinc-100">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Categoria
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Descrição
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Status
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
                      colSpan={4}
                      className="px-5 py-14 text-center text-sm text-zinc-400"
                    >
                      Carregando categorias...
                    </td>
                  </tr>
                ) : categoriasFiltradas.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-14 text-center text-sm text-zinc-400"
                    >
                      Nenhuma categoria encontrada
                    </td>
                  </tr>
                ) : (
                  categoriasFiltradas.map((categoria) => (
                    <tr
                      key={categoria.id}
                      className="border-b border-zinc-100 transition hover:bg-[#fffaf8]"
                    >
                      <td className="px-5 py-4 text-sm font-semibold text-zinc-800">
                        {categoria.nome}
                      </td>

                      <td className="max-w-xs px-5 py-4 text-sm text-zinc-500">
                        {categoria.descricao}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                          ATIVA
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => abrirEdicao(categoria)}
                            className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600 transition hover:border-orange-300 hover:text-orange-600"
                          >
                            Editar
                          </button>

                          <button 
                          onClick={() => abrirExclusao(categoria)}
                          className="rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50">
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ModalCategoria
        aberto={modalAberto}
        fechar={() => setModalAberto(false)}
        atualizarCategorias={carregarCategorias}
      />

      <EditarCategoria
        aberto={editarAberto}
        fechar={fecharEdicao}
        categoria={categoriaSelecionada}
        atualizarCategorias={carregarCategorias}
      />

      <DeletarCategoria
        aberto={deletarAberto}
        fechar={fecharExclusao}
        categoria={categoriaSelecionada}
        atualizarCategorias={carregarCategorias}
      />
    </main>
  )
}

export default CategoriasAdmin
