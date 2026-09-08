import { useEffect, useState } from 'react'
import { buscar } from '../../services/Service'
import type Usuario from '../../models/Usuario'
import { useAuth } from '../../contexts/AuthContext'

function Clientes() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(1)
  const { token } = useAuth()
  const usuariosPorPagina = 10

  const carregarUsuarios = async () => {
    try {
      setCarregando(true)
      setErro('')

      const resposta = await buscar<any>('/usuarios/all', token)

      if (Array.isArray(resposta)) {
        setUsuarios(resposta)
      } else if (Array.isArray(resposta?.content)) {
        setUsuarios(resposta.content)
      } else if (Array.isArray(resposta?.data)) {
        setUsuarios(resposta.data)
      } else {
        setUsuarios([])
      }
    } catch (erro: any) {
      console.error('ERRO AO CARREGAR CLIENTES:', erro)
      console.error('STATUS:', erro?.response?.status)
      console.error('RESPOSTA:', erro?.response?.data)
      console.error('URL:', erro?.config?.url)
      console.error('BASE URL:', erro?.config?.baseURL)

      setErro('Não foi possível carregar os clientes.')
      setUsuarios([])
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarUsuarios()
  }, [])

  useEffect(() => {
    setPaginaAtual(1)
  }, [busca])

  const clientesFiltrados = usuarios.filter((usuario) => {
    const nome = usuario.nome?.toLowerCase() || ''
    const email = usuario.usuario?.toLowerCase() || ''
    const termoBusca = busca.toLowerCase()

    return (
      nome.includes(termoBusca) ||
      email.includes(termoBusca)
    )
  })

  const totalPaginas = Math.ceil(
    clientesFiltrados.length / usuariosPorPagina
  )

  const indiceInicial = (paginaAtual - 1) * usuariosPorPagina
  const indiceFinal = indiceInicial + usuariosPorPagina

  const clientesDaPagina = clientesFiltrados.slice(
    indiceInicial,
    indiceFinal
  )

  return (
    <main className="min-h-screen bg-[#fff8f5] px-6 py-8 md:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-orange-600">
            painel • clientes
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
            Clientes
          </h1>

          <p className="mt-2 text-sm text-zinc-500 md:text-base">
            Acompanhe os clientes cadastrados no BOMbocado.
          </p>
        </div>

        <div className="my-8 flex flex-col gap-3 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
          <div className="relative">
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
              placeholder="Buscar cliente por nome ou e-mail..."
              className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-zinc-900">
                Clientes
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Clientes cadastrados no sistema
              </p>
            </div>

            <span className="text-sm text-zinc-400">
              {clientesFiltrados.length} clientes
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
                  <th className="w-20 px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    ID
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Cliente
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    E-mail
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Telefone
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
                      Carregando clientes...
                    </td>
                  </tr>
                ) : clientesFiltrados.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-14 text-center text-sm text-zinc-400"
                    >
                      Nenhum cliente encontrado
                    </td>
                  </tr>
                ) : (
                  clientesDaPagina.map((usuario) => (
                    <tr
                      key={usuario.id}
                      className="border-b border-zinc-100 transition hover:bg-[#fffaf8]"
                    >
                      <td className="px-5 py-4 text-sm font-semibold text-zinc-600">
                        #{usuario.id}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-sm font-bold text-orange-600">
                            {usuario.nome?.charAt(0).toUpperCase() || '?'}
                          </div>

                          <p className="text-sm font-semibold text-zinc-800">
                            {usuario.nome || '—'}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-zinc-500">
                        {usuario.usuario || '—'}
                      </td>

                      <td className="px-5 py-4 text-sm text-zinc-500">
                        {usuario.telefone || '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!carregando && clientesFiltrados.length > 0 && (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-zinc-400">
                Página {paginaAtual} de {totalPaginas}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setPaginaAtual((pagina) => Math.max(pagina - 1, 1))
                  }
                  disabled={paginaAtual === 1}
                  className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Anterior
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPaginaAtual((pagina) =>
                      Math.min(pagina + 1, totalPaginas)
                    )
                  }
                  disabled={paginaAtual === totalPaginas}
                  className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default Clientes