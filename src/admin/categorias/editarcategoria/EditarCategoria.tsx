
import { useEffect, useState } from 'react'
import { atualizar } from '../../../services/Service'

interface Categoria {
  id: number
  nome: string
  descricao: string
}

interface EditarCategoriaProps {
  aberto: boolean
  fechar: () => void
  categoria: Categoria | null
  atualizarCategorias: () => void
}

function EditarCategoria({
  aberto,
  fechar,
  categoria,
  atualizarCategorias
}: EditarCategoriaProps) {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (categoria) {
      setNome(categoria.nome)
      setDescricao(categoria.descricao)
      setErro('')
    }
  }, [categoria])

  if (!aberto || !categoria) {
    return null
  }

  const salvar = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      await atualizar('/categorias', {
        id: categoria.id,
        nome,
        descricao
      })

      atualizarCategorias()
      fechar()
    } catch {
      setErro('Não foi possível atualizar a categoria.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl md:p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-orange-600">
              painel • categorias
            </p>

            <h2 className="text-2xl font-bold text-zinc-900">
              Editar Categoria
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Atualize as informações da categoria.
            </p>
          </div>

          <button
            type="button"
            onClick={fechar}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={salvar} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-700">
              Nome
            </label>

            <input
              type="text"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              required
              placeholder="Digite o nome da categoria"
              className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-700">
              Descrição
            </label>

            <textarea
              value={descricao}
              onChange={(event) => setDescricao(event.target.value)}
              required
              rows={4}
              placeholder="Digite a descrição da categoria"
              className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
            />
          </div>

          {erro && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {erro}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={fechar}
              className="rounded-xl border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={carregando}
              className="rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditarCategoria
