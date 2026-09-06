import {
  ArrowRightIcon,
  ClockIcon,
  LeafIcon,
  MagnifyingGlassIcon,
  PackageIcon,
  PencilSimpleIcon,
  PlusIcon,
  TagIcon,
  TrashIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react'
import axios from 'axios'
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import { AuthContext } from '../../contexts/AuthContext'
import type Produto from '../../models/Produto'
import { buscar } from '../../services/Service'

function Produtos() {
  const navigate = useNavigate()
  const location = useLocation()

  const authContext =
    useContext(AuthContext)

  if (!authContext) {
    throw new Error(
      'Produtos deve ser utilizado dentro de um AuthProvider.',
    )
  }

  const {
    token,
    isAuthenticated,
    logout,
  } = authContext

  const [produtos, setProdutos] =
    useState<Produto[]>([])

  const [carregando, setCarregando] =
    useState(true)

  const [erro, setErro] =
    useState('')

  const [busca, setBusca] =
    useState('')

  const state = location.state as
    | {
        produtoSalvo?: boolean
        produtoExcluido?: boolean
        acao?: string
      }
    | null

  const produtoSalvo =
    Boolean(state?.produtoSalvo)

  const produtoExcluido =
    Boolean(state?.produtoExcluido)

  const carregarProdutos =
    useCallback(async () => {
      if (!token) {
        return
      }

      try {
        setCarregando(true)
        setErro('')

        const resposta =
          await buscar<Produto[]>(
            '/produtos',
            token,
          )

        setProdutos(resposta)
      } catch (error) {
        console.error(error)

        if (axios.isAxiosError(error)) {
          if (
            error.response?.status ===
            401
          ) {
            logout()

            navigate('/login', {
              replace: true,
            })

            return
          }

          if (
            error.code ===
            'ECONNABORTED'
          ) {
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
          'Não foi possível carregar os produtos.',
        )
      } finally {
        setCarregando(false)
      }
    }, [
      token,
      logout,
      navigate,
    ])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', {
        replace: true,
      })

      return
    }

    const carregar = async () => {
      await carregarProdutos()
    }

    void carregar()
  }, [
    isAuthenticated,
    carregarProdutos,
    navigate,
  ])

  const produtosFiltrados =
    useMemo(() => {
      const termo = busca
        .trim()
        .toLocaleLowerCase(
          'pt-BR',
        )

      if (!termo) {
        return produtos
      }

      return produtos.filter(
        (produto) => {
          const nome =
            produto.nome
              ?.toLocaleLowerCase(
                'pt-BR',
              )

          const descricao =
            produto.descricao
              ?.toLocaleLowerCase(
                'pt-BR',
              )

          const categoria =
            produto.categoria?.nome
              ?.toLocaleLowerCase(
                'pt-BR',
              )

          return (
            nome?.includes(termo) ||
            descricao?.includes(
              termo,
            ) ||
            categoria?.includes(
              termo,
            )
          )
        },
      )
    }, [busca, produtos])

  function formatarPreco(
    preco: string,
  ) {
    const valor = Number(preco)

    if (Number.isNaN(valor)) {
      return 'R$ 0,00'
    }

    return new Intl.NumberFormat(
      'pt-BR',
      {
        style: 'currency',
        currency: 'BRL',
      },
    ).format(valor)
  }

  function formatarData(
    data: string,
  ) {
    const partes =
      data.split('-')

    if (partes.length !== 3) {
      return data
    }

    const [ano, mes, dia] =
      partes

    return `${dia}/${mes}/${ano}`
  }

  return (
    <main className="min-h-screen bg-surface">
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {produtoSalvo && (
          <div
            role="status"
            className="mb-5 rounded-button border border-success/20 bg-success-soft px-4 py-3 text-sm font-semibold text-success"
          >
            Produto{' '}
            {state?.acao ===
            'editado'
              ? 'editado'
              : 'cadastrado'}{' '}
            com sucesso!
          </div>
        )}

        {produtoExcluido && (
          <div
            role="status"
            className="mb-5 rounded-button border border-success/20 bg-success-soft px-4 py-3 text-sm font-semibold text-success"
          >
            Produto excluído com
            sucesso!
          </div>
        )}

        <div className="rounded-card bg-white p-5 shadow-card sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary sm:text-sm">
                BOMbocado
              </p>

              <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">
                Produtos disponíveis
              </h1>

              <p className="mt-3 text-sm leading-6 text-ink-soft sm:text-base">
                Encontre alimentos
                disponíveis na plataforma e
                descubra opções acessíveis e
                conscientes.
              </p>
            </div>

            <div className="grid w-full gap-3 sm:grid-cols-2 xl:w-auto">
              <Link
                to="/produtos/saudaveis"
                className="flex h-12 items-center justify-center gap-2 rounded-button border border-primary px-5 font-headline text-sm font-bold text-primary transition hover:bg-primary-soft"
              >
                <LeafIcon
                  size={20}
                  weight="bold"
                />

                Opções saudáveis
              </Link>

              <Link
                to="/produtos/cadastrar"
                className="flex h-12 items-center justify-center gap-2 rounded-button bg-primary px-5 font-headline text-sm font-bold text-white transition hover:bg-primary-dark"
              >
                <PlusIcon
                  size={20}
                  weight="bold"
                />

                Cadastrar produto
              </Link>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <label
                htmlFor="busca"
                className="sr-only"
              >
                Buscar produtos
              </label>

              <MagnifyingGlassIcon
                size={20}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
              />

              <input
                id="busca"
                name="busca"
                type="search"
                value={busca}
                onChange={(event) =>
                  setBusca(
                    event.target.value,
                  )
                }
                placeholder="Buscar produto ou categoria..."
                className="h-12 w-full rounded-button border border-outline bg-surface pl-12 pr-4 text-sm outline-none transition placeholder:text-ink-muted focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {!carregando &&
              !erro && (
                <p className="shrink-0 text-sm text-ink-soft">
                  <strong className="text-ink">
                    {
                      produtosFiltrados.length
                    }
                  </strong>{' '}
                  {produtosFiltrados.length ===
                  1
                    ? 'produto'
                    : 'produtos'}
                </p>
              )}
          </div>
        </div>

        {carregando && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({
              length: 8,
            }).map(
              (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-card bg-white shadow-card"
                >
                  <div className="aspect-4/3 animate-pulse bg-neutral-light" />

                  <div className="space-y-3 p-5">
                    <div className="h-4 w-24 animate-pulse rounded bg-neutral-light" />

                    <div className="h-6 w-3/4 animate-pulse rounded bg-neutral-light" />

                    <div className="h-4 w-full animate-pulse rounded bg-neutral-light" />

                    <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-light" />

                    <div className="h-10 w-full animate-pulse rounded-button bg-neutral-light" />
                  </div>
                </div>
              ),
            )}
          </div>
        )}

        {!carregando &&
          erro && (
            <section className="mt-6 rounded-card bg-white p-8 text-center shadow-card sm:p-10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-error-soft text-error">
                <WarningCircleIcon
                  size={30}
                  weight="fill"
                />
              </div>

              <h2 className="mt-5 text-2xl">
                Não foi possível
                carregar
              </h2>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-ink-soft">
                {erro}
              </p>

              <button
                type="button"
                onClick={() =>
                  void carregarProdutos()
                }
                className="mt-6 rounded-button bg-primary px-6 py-3 font-bold text-white transition hover:bg-primary-dark"
              >
                Tentar novamente
              </button>
            </section>
          )}

        {!carregando &&
          !erro &&
          produtosFiltrados.length ===
            0 && (
            <section className="mt-6 rounded-card bg-white p-8 text-center shadow-card sm:p-10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
                <PackageIcon
                  size={30}
                  weight="duotone"
                />
              </div>

              <h2 className="mt-5 text-2xl">
                Nenhum produto
                encontrado
              </h2>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-ink-soft">
                {busca
                  ? 'Tente buscar por outro nome ou categoria.'
                  : 'Ainda não existem produtos disponíveis.'}
              </p>
            </section>
          )}

        {!carregando &&
          !erro &&
          produtosFiltrados.length >
            0 && (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {produtosFiltrados.map(
                (produto) => (
                  <article
                    key={produto.id}
                    className="group flex min-w-0 flex-col overflow-hidden rounded-card bg-white shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-card-hover"
                  >
                    <Link
                      to={`/produtos/${produto.id}`}
                      className="relative block aspect-4/3 overflow-hidden bg-neutral-light"
                    >
                      {produto.imagem ? (
                        <img
                          src={produto.imagem}
                          alt={produto.nome}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-ink-muted">
                          <PackageIcon
                            size={46}
                            weight="duotone"
                          />
                        </div>
                      )}

                      {produto.categoria
                        ?.nome && (
                        <span className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-primary shadow-sm backdrop-blur">
                          {
                            produto
                              .categoria
                              .nome
                          }
                        </span>
                      )}
                    </Link>

                    <div className="flex flex-1 flex-col p-5">
                      <Link
                        to={`/produtos/${produto.id}`}
                        className="transition hover:text-primary"
                      >
                        <h2 className="line-clamp-2 min-h-14 text-lg font-bold leading-7 sm:text-xl">
                          {produto.nome}
                        </h2>
                      </Link>

                      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-ink-soft">
                        {
                          produto.descricao
                        }
                      </p>

                      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-ink-muted">
                        {produto.tempoEntrega !==
                          null && (
                          <div className="flex items-center gap-1.5">
                            <ClockIcon
                              size={16}
                              weight="bold"
                            />

                            <span>
                              {
                                produto.tempoEntrega
                              }{' '}
                              min
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5">
                          <TagIcon
                            size={16}
                            weight="bold"
                          />

                          <span>
                            {formatarData(
                              produto.dataValidade,
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="mt-auto pt-5">
                        <div className="flex items-end justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs text-ink-muted">
                              A partir de
                            </p>

                            <p className="truncate font-headline text-xl font-extrabold text-primary-dark">
                              {formatarPreco(
                                produto.preco,
                              )}
                            </p>
                          </div>

                          <Link
                            to={`/produtos/${produto.id}`}
                            aria-label={`Ver ${produto.nome}`}
                            title="Ver detalhes"
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white transition hover:bg-primary-dark"
                          >
                            <ArrowRightIcon
                              size={19}
                              weight="bold"
                            />
                          </Link>
                        </div>

                        <div className="mt-4 flex gap-2 border-t border-outline/40 pt-4">
                          <Link
                            to={`/produtos/editar/${produto.id}`}
                            aria-label={`Editar ${produto.nome}`}
                            title="Editar produto"
                            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-button bg-primary-soft px-3 text-sm font-bold text-primary transition hover:bg-primary hover:text-white"
                          >
                            <PencilSimpleIcon
                              size={18}
                              weight="bold"
                            />

                            <span className="hidden min-[430px]:inline sm:inline">
                              Editar
                            </span>
                          </Link>

                          <Link
                            to={`/produtos/deletar/${produto.id}`}
                            aria-label={`Excluir ${produto.nome}`}
                            title="Excluir produto"
                            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-button bg-error-soft px-3 text-sm font-bold text-error transition hover:bg-error hover:text-white"
                          >
                            <TrashIcon
                              size={18}
                              weight="bold"
                            />

                            <span className="hidden min-[430px]:inline sm:inline">
                              Excluir
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                ),
              )}
            </div>
          )}
      </section>
    </main>
  )
}

export default Produtos