import { ArrowLeftIcon, ClockIcon, FloppyDiskIcon, ImageIcon, PackageIcon, TagIcon, WarningCircleIcon,
} from '@phosphor-icons/react'
import axios from 'axios'
import { type ChangeEvent, type FormEvent, useEffect, useState, } from 'react'
import { Link, useNavigate, useParams, } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import type Categoria from '../../models/Categoria'
import type Produto from '../../models/Produto'
import {
  atualizar,
  buscar,
  cadastrar,
} from '../../services/Service'

interface FormProdutoState {
  nome: string
  descricao: string
  preco: string
  imagem: string
  tempoEntrega: string
  dataValidade: string
  categoriaId: string
}

const estadoInicial: FormProdutoState = {
  nome: '',
  descricao: '',
  preco: '',
  imagem: '',
  tempoEntrega: '',
  dataValidade: '',
  categoriaId: '',
}

function FormProduto() {
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    token,
    isAuthenticated,
    logout,
  } = useAuth()

  const editando = Boolean(id)

  const [formProduto, setFormProduto] =
    useState<FormProdutoState>(estadoInicial)

  const [categorias, setCategorias] =
    useState<Categoria[]>([])

  const [carregandoPagina, setCarregandoPagina] =
    useState(true)

  const [salvando, setSalvando] =
    useState(false)

  const [erro, setErro] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', {
        replace: true,
      })

      return
    }

    const carregarDados = async () => {
      try {
        setErro('')

        const categoriasResposta =
          await buscar<Categoria[]>(
            '/categorias',
            token,
          )

        setCategorias(categoriasResposta)

        if (id) {
          const produtoResposta =
            await buscar<Produto>(
              `/produtos/${id}`,
              token,
            )

          setFormProduto({
            nome: produtoResposta.nome ?? '',
            descricao:
              produtoResposta.descricao ?? '',
            preco:
              produtoResposta.preco?.toString() ??
              '',
            imagem:
              produtoResposta.imagem ?? '',
            tempoEntrega:
              produtoResposta.tempoEntrega !== null
                ? produtoResposta.tempoEntrega.toString()
                : '',
            dataValidade:
              produtoResposta.dataValidade ?? '',
            categoriaId:
              produtoResposta.categoria?.id
                ? produtoResposta.categoria.id.toString()
                : '',
          })
        }
      } catch (error) {
        console.error(error)

        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            logout()

            navigate('/login', {
              replace: true,
            })

            return
          }

          if (error.response?.status === 404) {
            setErro(
              'O produto solicitado não foi encontrado.',
            )

            return
          }

          if (error.code === 'ECONNABORTED') {
            setErro(
              'O servidor demorou para responder. Tente novamente.',
            )

            return
          }

          if (!error.response) {
            setErro(
              'Não foi possível conectar ao servidor. O Render pode estar iniciando.',
            )

            return
          }
        }

        setErro(
          'Não foi possível carregar os dados necessários.',
        )
      } finally {
        setCarregandoPagina(false)
      }
    }

    void carregarDados()
  }, [
    id,
    isAuthenticated,
    logout,
    navigate,
    token,
  ])

  function atualizarEstado(
    event: ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >,
  ) {
    const { name, value } = event.target

    setFormProduto({
      ...formProduto,
      [name]: value,
    })

    if (erro) {
      setErro('')
    }
  }

  function validarFormulario(): string | null {
    if (!formProduto.nome.trim()) {
      return 'Informe o nome do produto.'
    }

    if (!formProduto.descricao.trim()) {
      return 'Informe a descrição do produto.'
    }

    if (!formProduto.preco.trim()) {
      return 'Informe o preço do produto.'
    }

    const preco = Number(
      formProduto.preco.replace(',', '.'),
    )

    if (
      Number.isNaN(preco) ||
      preco <= 0
    ) {
      return 'Informe um preço válido maior que zero.'
    }

    if (!formProduto.dataValidade) {
      return 'Informe a data de validade.'
    }

    if (!formProduto.categoriaId) {
      return 'Selecione uma categoria.'
    }

    if (formProduto.tempoEntrega) {
      const tempo = Number(
        formProduto.tempoEntrega,
      )

      if (
        Number.isNaN(tempo) ||
        tempo <= 0
      ) {
        return 'Informe um tempo de entrega válido.'
      }
    }

    return null
  }

  async function salvarProduto(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const erroValidacao =
      validarFormulario()

    if (erroValidacao) {
      setErro(erroValidacao)
      return
    }

    const preco = Number(
      formProduto.preco.replace(',', '.'),
    )

    const payload = {
      ...(id && {
        id: Number(id),
      }),

      nome: formProduto.nome.trim(),

      descricao:
        formProduto.descricao.trim(),

      preco,

      imagem:
        formProduto.imagem.trim() ||
        null,

      tempoEntrega:
        formProduto.tempoEntrega
          ? Number(
              formProduto.tempoEntrega,
            )
          : null,

      dataValidade:
        formProduto.dataValidade,

      categoria: {
        id: Number(
          formProduto.categoriaId,
        ),
      },
    }

    try {
      setSalvando(true)
      setErro('')

      if (id) {
        await atualizar<Produto>(
          '/produtos',
          payload,
          token,
        )
      } else {
        await cadastrar<Produto>(
          '/produtos',
          payload,
          token,
        )
      }

      navigate('/produtos', {
        replace: true,
        state: {
          produtoSalvo: true,
          acao: editando
            ? 'editado'
            : 'cadastrado',
        },
      })
    } catch (error) {
      console.error(error)

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          logout()

          navigate('/login', {
            replace: true,
          })

          return
        }

        if (error.response?.status === 400) {
          setErro(
            'Não foi possível salvar o produto. Verifique os dados informados.',
          )

          return
        }

        if (error.response?.status === 404) {
          setErro(
            'Produto ou categoria não encontrado.',
          )

          return
        }

        if (error.code === 'ECONNABORTED') {
          setErro(
            'O servidor demorou para responder. Tente novamente.',
          )

          return
        }

        if (!error.response) {
          setErro(
            'Não foi possível conectar ao servidor.',
          )

          return
        }
      }

      setErro(
        'Não foi possível salvar o produto.',
      )
    } finally {
      setSalvando(false)
    }
  }

  if (carregandoPagina) {
    return (
      <main className="min-h-screen bg-surface p-4">
        <div className="mx-auto max-w-3xl py-10">
          <div className="rounded-card bg-white p-8 shadow-card">
            <div className="h-8 w-52 animate-pulse rounded bg-neutral-light" />

            <div className="mt-8 space-y-5">
              {Array.from({
                length: 6,
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-12 animate-pulse rounded-button bg-neutral-light"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-surface">
      <header className="border-b border-outline/50 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/produtos"
            className="font-headline text-2xl font-extrabold text-primary-dark sm:text-3xl"
          >
            BOM
            <span className="text-primary">
              bocado
            </span>
          </Link>

          <Link
            to="/produtos"
            className="flex items-center gap-2 text-sm font-bold text-primary"
          >
            <ArrowLeftIcon
              size={19}
              weight="bold"
            />

            <span className="hidden sm:inline">
              Voltar aos produtos
            </span>
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="mb-7">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
            Produtos
          </p>

          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
            {editando
              ? 'Editar produto'
              : 'Cadastrar produto'}
          </h1>

          <p className="mt-3 text-sm leading-6 text-ink-soft sm:text-base">
            {editando
              ? 'Atualize as informações do produto selecionado.'
              : 'Preencha as informações para disponibilizar um novo produto.'}
          </p>
        </div>

        <form
          onSubmit={salvarProduto}
          className="rounded-card bg-white p-5 shadow-card sm:p-8"
        >
          {erro && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-button bg-error-soft p-4 text-sm font-medium text-error"
            >
              <WarningCircleIcon
                size={21}
                weight="fill"
                className="shrink-0"
              />

              <span>
                {erro}
              </span>
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="nome"
                className="mb-2 block text-sm font-semibold"
              >
                Nome do produto
              </label>

              <div className="relative">
                <PackageIcon
                  size={20}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
                />

                <input
                  id="nome"
                  name="nome"
                  type="text"
                  value={formProduto.nome}
                  onChange={atualizarEstado}
                  placeholder="Ex.: Suco de laranja natural"
                  disabled={salvando}
                  className="h-12 w-full rounded-button border border-outline bg-white pl-12 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="descricao"
                className="mb-2 block text-sm font-semibold"
              >
                Descrição
              </label>

              <textarea
                id="descricao"
                name="descricao"
                value={formProduto.descricao}
                onChange={atualizarEstado}
                placeholder="Descreva o produto..."
                rows={4}
                disabled={salvando}
                className="w-full resize-none rounded-button border border-outline bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="preco"
                className="mb-2 block text-sm font-semibold"
              >
                Preço
              </label>

              <div className="relative">
                <TagIcon
                  size={20}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
                />

                <input
                  id="preco"
                  name="preco"
                  type="text"
                  inputMode="decimal"
                  value={formProduto.preco}
                  onChange={atualizarEstado}
                  placeholder="8,50"
                  disabled={salvando}
                  className="h-12 w-full rounded-button border border-outline bg-white pl-12 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="tempoEntrega"
                className="mb-2 block text-sm font-semibold"
              >
                Tempo de entrega
              </label>

              <div className="relative">
                <ClockIcon
                  size={20}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
                />

                <input
                  id="tempoEntrega"
                  name="tempoEntrega"
                  type="number"
                  min="1"
                  value={
                    formProduto.tempoEntrega
                  }
                  onChange={atualizarEstado}
                  placeholder="20"
                  disabled={salvando}
                  className="h-12 w-full rounded-button border border-outline bg-white pl-12 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                />
              </div>

              <p className="mt-1 text-xs text-ink-muted">
                Informe em minutos.
              </p>
            </div>

            <div>
              <label
                htmlFor="categoriaId"
                className="mb-2 block text-sm font-semibold"
              >
                Categoria
              </label>

              <select
                id="categoriaId"
                name="categoriaId"
                value={
                  formProduto.categoriaId
                }
                onChange={atualizarEstado}
                disabled={salvando}
                className="h-12 w-full rounded-button border border-outline bg-white px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
              >
                <option value="">
                  Selecione uma categoria
                </option>

                {categorias.map(
                  (categoria) => (
                    <option
                      key={categoria.id}
                      value={categoria.id}
                    >
                      {categoria.nome}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div>
              <label
                htmlFor="dataValidade"
                className="mb-2 block text-sm font-semibold"
              >
                Data de validade
              </label>

              <input
                id="dataValidade"
                name="dataValidade"
                type="date"
                value={
                  formProduto.dataValidade
                }
                onChange={atualizarEstado}
                disabled={salvando}
                className="h-12 w-full rounded-button border border-outline bg-white px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="imagem"
                className="mb-2 block text-sm font-semibold"
              >
                URL da imagem
                <span className="ml-1 font-normal text-ink-muted">
                  (opcional)
                </span>
              </label>

              <div className="relative">
                <ImageIcon
                  size={20}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
                />

                <input
                  id="imagem"
                  name="imagem"
                  type="url"
                  value={formProduto.imagem}
                  onChange={atualizarEstado}
                  placeholder="https://..."
                  disabled={salvando}
                  className="h-12 w-full rounded-button border border-outline bg-white pl-12 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              to="/produtos"
              className="flex h-12 items-center justify-center rounded-button border border-outline px-6 text-sm font-bold text-ink-soft transition hover:border-primary hover:text-primary"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={salvando}
              className="flex h-12 items-center justify-center gap-2 rounded-button bg-primary px-6 font-headline font-bold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FloppyDiskIcon
                size={20}
                weight="bold"
              />

              {salvando
                ? 'Salvando...'
                : editando
                  ? 'Salvar alterações'
                  : 'Cadastrar produto'}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default FormProduto