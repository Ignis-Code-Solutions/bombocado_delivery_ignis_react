
import { useState } from 'react'
import { deletar } from '../../../services/Service'

interface Categoria {
  id: number
  nome: string
  descricao: string
}

interface DeletarCategoriaProps {
  aberto: boolean
  fechar: () => void
  categoria: Categoria | null
  atualizarCategorias: () => void
}

function DeletarCategoria({
  aberto,
  fechar,
  categoria,
  atualizarCategorias
}: DeletarCategoriaProps) {
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  if (!aberto || !categoria) {
    return null
  }

  const confirmarExclusao = async () => {
    setErro('')
    setCarregando(true)

    try {
      await deletar(`/categorias/${categoria.id}`)

      atualizarCategorias()
      fechar()
    } catch {
      setErro('Não foi possível excluir a categoria.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl md:p-8">
        <div className="mb-6">
          <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-red-500">
            painel • categorias
          </p>

          <h2 className="text-2xl font-bold text-zinc-900">
            Excluir Categoria
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Tem certeza que deseja excluir a categoria{' '}
            <span className="font-semibold text-zinc-700">
              {categoria.nome}
            </span>
            ?
          </p>

          <p className="mt-2 text-sm text-zinc-400">
            Essa ação não poderá ser desfeita.
          </p>
        </div>

        {erro && (
          <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {erro}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={fechar}
            disabled={carregando}
            className="rounded-xl border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={confirmarExclusao}
            disabled={carregando}
            className="rounded-xl bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {carregando ? 'Excluindo...' : 'Excluir Categoria'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeletarCategoria
