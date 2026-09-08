import type Produto from "../../models/Produto"

interface VisualizarProdutoProps {
  aberto: boolean
  fechar: () => void
  editar: () => void
  produto: Produto | null
}

function VisualizarProduto({
  aberto,
  fechar,
  editar,
  produto
}: VisualizarProdutoProps) {
  if (!aberto || !produto) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-800">
            Visualizar produto
          </h2>

          <button
            type="button"
            onClick={fechar}
            className="text-2xl text-zinc-400 transition hover:text-zinc-700"
          >
            ×
          </button>
        </div>

        <div className="space-y-5">
          <div className="flex flex-col items-center gap-4 rounded-xl bg-[#fff8f5] p-5 md:flex-row">
            {produto.imagem ? (
              <img
                src={produto.imagem}
                alt={produto.nome}
                className="h-32 w-32 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-orange-50 text-4xl text-orange-500">
                🍴
              </div>
            )}

            <div className="text-center md:text-left">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-orange-600">
                Produto #{produto.id}
              </p>

              <h3 className="text-2xl font-bold text-zinc-800">
                {produto.nome}
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                {produto.descricao}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-zinc-100 p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Preço
              </p>

              <p className="text-lg font-bold text-zinc-800">
                R$ {Number(produto.preco).toFixed(2).replace('.', ',')}
              </p>
            </div>

            <div className="rounded-lg border border-zinc-100 p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Categoria
              </p>

              <p className="text-sm font-semibold text-zinc-800">
                {produto.categoria?.nome || '—'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-zinc-100 p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Tempo de entrega
              </p>

              <p className="text-sm font-semibold text-zinc-800">
                {produto.tempoEntrega
                  ? `${produto.tempoEntrega} minutos`
                  : '—'}
              </p>
            </div>

            <div className="rounded-lg border border-zinc-100 p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Nutriscore
              </p>

              <p className="text-sm font-semibold text-zinc-800">
                {produto.nutriscore || '—'}
              </p>
            </div>

            <div className="rounded-lg border border-zinc-100 p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Validade
              </p>

              <p className="text-sm font-semibold text-zinc-800">
                {produto.dataValidade
                  ? produto.dataValidade.substring(0, 10)
                  : '—'}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-zinc-100 pt-5">
            <button
              type="button"
              onClick={editar}
              className="rounded-lg border border-orange-200 px-5 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
            >
              Editar
            </button>

            <button
              type="button"
              onClick={fechar}
              className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VisualizarProduto
