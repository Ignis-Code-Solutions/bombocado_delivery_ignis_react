import { useEffect, useState } from 'react'
import { buscar, cadastrar } from '../../../services/Service'
import { useAuth } from '../../../contexts/AuthContext'

interface Categoria {
  id: number
  nome: string
  descricao: string
}

interface ModalProdutoProps {
  aberto: boolean
  fechar: () => void
  atualizarProdutos: () => void
}

function ModalProduto({
  aberto,
  fechar,
  atualizarProdutos
}: ModalProdutoProps) {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [preco, setPreco] = useState('')
  const [imagem, setImagem] = useState('')
  const [tempoEntrega, setTempoEntrega] = useState('')
  const [nutriscore, setNutriscore] = useState('')
  const [dataValidade, setDataValidade] = useState('')
  const [categoria, setCategoria] = useState('')
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [carregando, setCarregando] = useState(false)
  const [carregandoCategorias, setCarregandoCategorias] = useState(false)
  const [erro, setErro] = useState('')
  const { token } = useAuth()

  useEffect(() => {
    if (!aberto) {
      return
    }

    const carregarCategorias = async () => {
      setCarregandoCategorias(true)
      setErro('')

      try {
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
        setCarregandoCategorias(false)
      }
    }

    carregarCategorias()
  }, [aberto])

  if (!aberto) {
    return null
  }

  const salvar = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      await cadastrar('/produtos', {
        nome,
        descricao,
        preco: Number(preco),
        imagem,
        tempoEntrega: tempoEntrega ? Number(tempoEntrega) : null,
        nutriscore: nutriscore || null,
        dataValidade,
        categoria: {
          id: Number(categoria)
        }
      },
    token
  )

      setNome('')
      setDescricao('')
      setPreco('')
      setImagem('')
      setTempoEntrega('')
      setNutriscore('')
      setDataValidade('')
      setCategoria('')

      atualizarProdutos()
      fechar()
    } catch {
      setErro('Não foi possível cadastrar o produto.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-6 backdrop-blur-sm">
      <div className="my-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl md:p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-orange-600">
              painel • produtos • adicionar produto
            </p>

            <h2 className="text-2xl font-bold text-zinc-900">
              Adicionar Produto
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Cadastre um novo produto no catálogo.
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
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-zinc-700">
                Nome
              </label>

              <input
                type="text"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                required
                placeholder="Digite o nome do produto"
                className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-zinc-700">
                Descrição
              </label>

              <textarea
                value={descricao}
                onChange={(event) => setDescricao(event.target.value)}
                required
                rows={3}
                placeholder="Digite a descrição do produto"
                className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-700">
                Preço
              </label>

              <input
                type="number"
                step="0.01"
                min="0"
                value={preco}
                onChange={(event) => setPreco(event.target.value)}
                required
                placeholder="0,00"
                className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-700">
                Categoria
              </label>

              <select
                value={categoria}
                onChange={(event) => setCategoria(event.target.value)}
                required
                disabled={carregandoCategorias}
                className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-700 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">
                  {carregandoCategorias
                    ? 'Carregando categorias...'
                    : 'Selecione uma categoria'}
                </option>

                {categorias.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-700">
                Tempo de entrega
              </label>

              <input
                type="number"
                min="0"
                value={tempoEntrega}
                onChange={(event) => setTempoEntrega(event.target.value)}
                placeholder="Em minutos"
                className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-700">
                Nutriscore
              </label>

              <select
                value={nutriscore}
                onChange={(event) => setNutriscore(event.target.value)}
                className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-700 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
              >
                <option value="">Selecione</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-700">
                Data de validade
              </label>

              <input
                type="date"
                value={dataValidade}
                onChange={(event) => setDataValidade(event.target.value)}
                required
                className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-700">
                Imagem
              </label>

              <input
                type="url"
                value={imagem}
                onChange={(event) => setImagem(event.target.value)}
                placeholder="URL da imagem"
                className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>

          {erro && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {erro}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-zinc-100 pt-6 sm:flex-row sm:justify-end">
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
              {carregando ? 'Salvando...' : 'Adicionar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalProduto
