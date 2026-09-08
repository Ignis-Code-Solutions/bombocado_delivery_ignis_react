
import { useState } from 'react'
import { deletar } from '../../../services/Service'

interface Produto {
  id: number
  nome: string
  descricao: string
}

interface DeletarProdutoProps {
  aberto: boolean
  fechar: () => void
  produto: Produto | null
  atualizarProdutos: () => void
}

function DeletarProduto({
  aberto,
  fechar,
  produto,
  atualizarProdutos
}: DeletarProdutoProps) {
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  if (!aberto || !produto) {
    return null
  }

  const confirmarExclusao = async () => {
    setErro('')
    setCarregando(true)

    try {
      await deletar(`/produtos/${produto.id}`)

      atualizarProdutos()
      fechar()
    } catch {
      setErro('Não foi possível excluir o produto.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl md:p-8">
        <div className="mb-6">

          <h2 className="text-2xl font-bold text-zinc-900">
            Excluir Produto
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Tem certeza que deseja excluir o produto{' '}
            <span className="font-semibold text-zinc-700">
              {produto.nome}
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
            {carregando ? 'Excluindo...' : 'Excluir Produto'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeletarProduto
