import { useEffect, useState } from 'react'
import { buscar } from '../../../services/Service'
import ModalProduto from '../modalprodutos/ModalProduto'
import type Produto from '../../../models/Produto'
import DeletarProduto from '../deletarproduto/DeletarProduto'
import EditarProduto from '../editarproduto/EditarProduto'
import { useAuth } from '../../../contexts/AuthContext'

function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState('Todos')
  const [ordenacao, setOrdenacao] = useState('idCrescente')
  const [modalAberto, setModalAberto] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [editarAberto, setEditarAberto] = useState(false)
  const [deletarAberto, setDeletarAberto] = useState(false)
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null)
  const [paginaAtual, setPaginaAtual] = useState(1)
  const produtosPorPagina = 10
  const { token } = useAuth()

  const carregarProdutos = async () => {
    try {
      setCarregando(true)
      setErro('')

      const resposta = await buscar<any>('/produtos', token)

      if (Array.isArray(resposta)) {
        setProdutos(resposta)
      } else if (Array.isArray(resposta?.content)) {
        setProdutos(resposta.content)
      } else if (Array.isArray(resposta?.data)) {
        setProdutos(resposta.data)
      } else {
        setProdutos([])
      }
    } catch (erro: any) {
      console.error('ERRO AO CARREGAR PRODUTOS:', erro)
      console.error('STATUS:', erro?.response?.status)
      console.error('RESPOSTA:', erro?.response?.data)
      console.error('URL:', erro?.config?.url)
      console.error('BASE URL:', erro?.config?.baseURL)
      setErro('Não foi possível carregar os produtos.')
      setProdutos([])
    } finally {
      setCarregando(false)
    }
  }

  const abrirEdicao = (produto: Produto) => {
    setProdutoSelecionado(produto)
    setEditarAberto(true)
  }

  const fecharEdicao = () => {
    setEditarAberto(false)
    setProdutoSelecionado(null)
  }

  const abrirExclusao = (produto: Produto) => {
    setProdutoSelecionado(produto)
    setDeletarAberto(true)
  }

  const fecharExclusao = () => {
    setDeletarAberto(false)
    setProdutoSelecionado(null)
  }

  useEffect(() => {
    carregarProdutos()
  }, [])

  useEffect(() => {
    setPaginaAtual(1)
  }, [busca, filtro, ordenacao])

  const produtosFiltrados = produtos.filter((produto) => {
    const nome = produto.nome?.toLowerCase() || ''
    const termoBusca = busca.toLowerCase()

    const correspondeBusca = nome.includes(termoBusca)

    const categoria = produto.categoria?.nome || ''
    const correspondeFiltro =
      filtro === 'Todos' ||
      categoria.toLowerCase() === filtro.toLowerCase()

    return correspondeBusca && correspondeFiltro
  })

  const produtosOrdenados = [...produtosFiltrados].sort((a, b) => {
    switch (ordenacao) {
      case 'idCrescente':
        return a.id - b.id

      case 'idDecrescente':
        return b.id - a.id

      case 'az':
        return (a.nome || '').localeCompare(b.nome || '', 'pt-BR')

      case 'za':
        return (b.nome || '').localeCompare(a.nome || '', 'pt-BR')

      case 'precoMenor':
        return Number(a.preco) - Number(b.preco)

      case 'precoMaior':
        return Number(b.preco) - Number(a.preco)

      default:
        return a.id - b.id
    }
  })

  const totalPaginas = Math.ceil(
    produtosOrdenados.length / produtosPorPagina
  )

  const indiceInicial = (paginaAtual - 1) * produtosPorPagina
  const indiceFinal = indiceInicial + produtosPorPagina

  const produtosDaPagina = produtosOrdenados.slice(
    indiceInicial,
    indiceFinal
  )

  const irParaPaginaAnterior = () => {
    if (paginaAtual > 1) {
      setPaginaAtual(paginaAtual - 1)
    }
  }

  const irParaProximaPagina = () => {
    if (paginaAtual < totalPaginas) {
      setPaginaAtual(paginaAtual + 1)
    }
  }

  return (
    <main className="min-h-screen bg-[#fff8f5] px-6 py-8 md:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-orange-600">
              painel • produtos
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
              Produtos
            </h1>

            <p className="mt-2 text-sm text-zinc-500 md:text-base">
              Acompanhe produtos, edite e exclua.
            </p>
          </div>

          <button
            onClick={() => setModalAberto(true)}
            className="flex w-fit items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 hover:shadow-md"
          >
            <span className="text-lg leading-none">+</span>
            Adicionar Produto
          </button>
        </div>

        <div className="mb-5 mt-5 flex flex-col gap-3 rounded-2xl border border-zinc-100 bg-white p-4 md:flex-row">
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
              placeholder="Buscar produto..."
              className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <select
            value={filtro}
            onChange={(event) => setFiltro(event.target.value)}
            className="h-12 rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-medium text-zinc-600 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
          >
            <option value="Todos">Todas as categorias</option>
            <option value="Bebidas">Bebidas</option>
            <option value="Lanches">Lanches</option>
            <option value="Refeição">Refeição</option>
            <option value="Sobremesas">Sobremesas</option>
          </select>

          <select
            value={ordenacao}
            onChange={(event) => setOrdenacao(event.target.value)}
            className="h-12 rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-medium text-zinc-600 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
          >
            <option value="idCrescente">ID: do menor - maior</option>
            <option value="idDecrescente">ID: do maior - menor</option>
            <option value="az">Nome: A–Z</option>
            <option value="za">Nome: Z–A</option>
            <option value="precoMenor">Preço: do menor - maior</option>
            <option value="precoMaior">Preço: do maior - menor</option>
          </select>
        </div>

        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-zinc-900">
                Produtos
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Gerencie os produtos cadastrados
              </p>
            </div>

            <span className="text-sm text-zinc-400">
              {produtosOrdenados.length} produtos
            </span>
          </div>

          {erro && (
            <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {erro}
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-zinc-100">
            <table className="w-full min-w-225">
              <thead className="bg-[#fff7f3]">
                <tr className="border-b border-zinc-100">
                  <th className="w-20 px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
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
                    Validade
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
                      colSpan={7}
                      className="px-5 py-14 text-center text-sm text-zinc-400"
                    >
                      Carregando produtos...
                    </td>
                  </tr>
                ) : produtosOrdenados.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-14 text-center text-sm text-zinc-400"
                    >
                      Nenhum produto encontrado
                    </td>
                  </tr>
                ) : (
                  produtosDaPagina.map((produto) => (
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
                              className="h-12 w-12 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                              🍴
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-zinc-800">
                              {produto.nome}
                            </p>

                            <p className="mt-1 max-w-xs truncate text-xs text-zinc-400">
                              {produto.descricao}
                            </p>
                          </div>
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

                      <td className="px-5 py-4 text-sm text-zinc-500">
                        {produto.dataValidade || '—'}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => abrirEdicao(produto)}
                            className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600 transition hover:border-orange-300 hover:text-orange-600"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() => abrirExclusao(produto)}
                            className="rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                          >
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

          {!carregando && produtosOrdenados.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-zinc-400">
                Mostrando {indiceInicial + 1} até{' '}
                {Math.min(indiceFinal, produtosOrdenados.length)} de{' '}
                {produtosOrdenados.length} produtos
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={irParaPaginaAnterior}
                  disabled={paginaAtual === 1}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-lg font-semibold text-zinc-600 transition hover:border-orange-300 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Página anterior"
                >
                  ←
                </button>

                <span className="text-sm font-semibold text-zinc-600">
                  Página {paginaAtual} de {totalPaginas}
                </span>

                <button
                  onClick={irParaProximaPagina}
                  disabled={paginaAtual === totalPaginas}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-lg font-semibold text-zinc-600 transition hover:border-orange-300 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Próxima página"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ModalProduto
        aberto={modalAberto}
        fechar={() => setModalAberto(false)}
        atualizarProdutos={carregarProdutos}
      />

      <EditarProduto
        aberto={editarAberto}
        fechar={fecharEdicao}
        produto={produtoSelecionado}
        atualizarProdutos={carregarProdutos}
      />

      <DeletarProduto
        aberto={deletarAberto}
        fechar={fecharExclusao}
        produto={produtoSelecionado}
        atualizarProdutos={carregarProdutos}
      />
    </main>
  )
}

export default Produtos
