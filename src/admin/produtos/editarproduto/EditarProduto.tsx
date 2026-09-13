import { useEffect, useState } from 'react'

import {
  atualizar,
  buscar,
} from '../../../services/Service'

import type Produto from '../../../models/Produto'
import type Categoria from '../../../models/Categoria'

import { useAuth } from '../../../contexts/AuthContext'

interface EditarProdutoProps {
  aberto: boolean
  fechar: () => void
  produto: Produto | null
  atualizarProdutos: () => void
}

function EditarProduto({
  aberto,
  fechar,
  produto,
  atualizarProdutos,
}: EditarProdutoProps) {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [preco, setPreco] = useState('')
  const [imagem, setImagem] = useState('')
  const [tempoEntrega, setTempoEntrega] = useState('')
  const [nutriscore, setNutriscore] = useState('')
  const [dataValidade, setDataValidade] = useState('')
  const [categoria, setCategoria] = useState('')

  const [categorias, setCategorias] =
    useState<Categoria[]>([])

  const [carregando, setCarregando] =
    useState(false)

  const [erro, setErro] =
    useState('')

  const { token } = useAuth()

  useEffect(() => {
    if (produto) {
      setNome(
        produto.nome ?? '',
      )

      setDescricao(
        produto.descricao ?? '',
      )

      setPreco(
        String(produto.preco ?? ''),
      )

      setImagem(
        produto.imagem ?? '',
      )

      setTempoEntrega(
        produto.tempoEntrega !== null &&
        produto.tempoEntrega !== undefined
          ? String(produto.tempoEntrega)
          : '',
      )

      setNutriscore(
        produto.nutriscore
          ?.trim()
          .toUpperCase() ?? '',
      )

      setDataValidade(
        produto.dataValidade
          ? produto.dataValidade.substring(0, 10)
          : '',
      )

      setCategoria(
        produto.categoria?.id
          ? String(produto.categoria.id)
          : '',
      )

      setErro('')
    }
  }, [produto])

  useEffect(() => {
    if (aberto && token) {
      buscar<any>(
        '/categorias',
        token,
      )
        .then((resposta) => {
          if (
            Array.isArray(resposta)
          ) {
            setCategorias(
              resposta,
            )

            return
          }

          if (
            Array.isArray(
              resposta?.content,
            )
          ) {
            setCategorias(
              resposta.content,
            )

            return
          }

          if (
            Array.isArray(
              resposta?.data,
            )
          ) {
            setCategorias(
              resposta.data,
            )

            return
          }

          setCategorias([])
        })
        .catch((error) => {
          console.error(
            'Erro ao carregar categorias:',
            error,
          )

          setCategorias([])
        })
    }
  }, [
    aberto,
    token,
  ])

  if (
    !aberto ||
    !produto
  ) {
    return null
  }

  const salvar = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    setErro('')
    setCarregando(true)

    try {
      const payload = {
        id: produto.id,

        nome:
          nome.trim(),

        descricao:
          descricao.trim(),

        preco:
          Number(preco),

        imagem:
          imagem.trim(),

        tempoEntrega:
          tempoEntrega
            ? Number(
                tempoEntrega,
              )
            : null,

        nutriscore:
          nutriscore
            .trim()
            .toUpperCase(),

        dataValidade,

        categoria: {
          id: Number(
            categoria,
          ),
        },
      }

      console.log(
        'Payload enviado:',
        payload,
      )

      await atualizar(
        '/produtos',
        payload,
        token,
      )

      atualizarProdutos()
      fechar()
    } catch (error: any) {
      console.error(
        'Erro ao atualizar produto:',
        error,
      )

      console.error(
        'Resposta da API:',
        error?.response?.data,
      )

      setErro(
        error?.response?.data?.message ||
          'Não foi possível atualizar o produto.',
      )
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-800">
            Editar produto
          </h2>

          <button
            type="button"
            onClick={fechar}
            className="text-2xl text-zinc-400 transition hover:text-zinc-700"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={salvar}
          className="space-y-4"
        >

          <div>
            <label className="mb-1 block text-sm font-semibold text-zinc-700">
              Nome
            </label>

            <input
              type="text"
              value={nome}
              onChange={(event) =>
                setNome(
                  event.target.value,
                )
              }
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-orange-400"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-zinc-700">
              Descrição
            </label>

            <textarea
              value={descricao}
              onChange={(event) =>
                setDescricao(
                  event.target.value,
                )
              }
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-orange-400"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div>
              <label className="mb-1 block text-sm font-semibold text-zinc-700">
                Preço
              </label>

              <input
                type="number"
                step="0.01"
                value={preco}
                onChange={(event) =>
                  setPreco(
                    event.target.value,
                  )
                }
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-orange-400"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-zinc-700">
                Tempo de entrega
              </label>

              <input
                type="number"
                min="1"
                value={tempoEntrega}
                onChange={(event) =>
                  setTempoEntrega(
                    event.target.value,
                  )
                }
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-orange-400"
              />
            </div>

          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-zinc-700">
              Imagem
            </label>

            <input
              type="text"
              value={imagem}
              onChange={(event) =>
                setImagem(
                  event.target.value,
                )
              }
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-orange-400"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            <div>
              <label className="mb-1 block text-sm font-semibold text-zinc-700">
                Nutriscore
              </label>

              <select
                value={nutriscore}
                onChange={(event) =>
                  setNutriscore(
                    event.target.value,
                  )
                }
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-orange-400"
              >
                <option value="">
                  Não informado
                </option>

                <option value="A">
                  A
                </option>

                <option value="B">
                  B
                </option>

                <option value="C">
                  C
                </option>

                <option value="D">
                  D
                </option>

                <option value="E">
                  E
                </option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-zinc-700">
                Validade
              </label>

              <input
                type="date"
                value={dataValidade}
                onChange={(event) =>
                  setDataValidade(
                    event.target.value,
                  )
                }
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-orange-400"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-zinc-700">
                Categoria
              </label>

              <select
                value={categoria}
                onChange={(event) =>
                  setCategoria(
                    event.target.value,
                  )
                }
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-orange-400"
                required
              >
                <option value="">
                  Selecione
                </option>

                {categorias.map(
                  (item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.nome}
                    </option>
                  ),
                )}
              </select>
            </div>

          </div>

          {erro && (
            <p className="text-sm font-medium text-red-500">
              {erro}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={fechar}
              disabled={carregando}
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-50 disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={carregando}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
            >
              {carregando
                ? 'Salvando...'
                : 'Salvar'}
            </button>

          </div>

        </form>
      </div>
    </div>
  )
}

export default EditarProduto