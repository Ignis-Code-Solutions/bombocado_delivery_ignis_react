import { ArrowRightIcon, ClockIcon, PackageIcon, PencilSimpleIcon, PlusIcon, SignOutIcon, TagIcon, TrashIcon,WarningCircleIcon, } from '@phosphor-icons/react'
import axios from 'axios'
import { useCallback, useContext, useEffect, useMemo, useState, } from 'react'
import { Link, useLocation, useNavigate, } from 'react-router-dom'
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
    usuario,
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

  function sair() {
    logout()

    navigate('/login', {
      replace: true,
    })
  }

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
      <header className="border-b border-outline/50 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/produtos"
            className="font-headline text-2xl font-extrabold text-primary-dark sm:text-3xl"
          >
            BOM
            <span className="text-primary">
              bocado
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs text-ink-muted">
                Olá,
              </p>

              <p className="max-w-40 truncate text-sm font-bold">
                {usuario?.nome ||
                  'usuário'}
              </p>
            </div>

            <button
              type="button"
              onClick={sair}
              className="flex h-10 items-center gap-2 rounded-button border border-outline px-3 text-sm font-semibold text-ink-soft transition hover:border-primary hover:text-primary"
            >
              <SignOutIcon
                size={19}
                weight="bold"
              />

              <span className="hidden sm:inline">
                Sair
              </span>
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {produtoSalvo && (
          <div
            role="status"
            className="mb-6 rounded-button bg-success-soft px-4 py-3 text-sm font-semibold text-success"
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
            className="mb-6 rounded-button bg-success-soft px-4 py-3 text-sm font-semibold text-success"
          >
            Produto excluído com
            sucesso!
          </div>
        )}

        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
              BOMbocado
            </p>

            <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
              Produtos disponíveis
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft sm:text-base">
              Encontre alimentos
              disponíveis na
              plataforma e descubra
              opções acessíveis e
              conscientes.
            </p>
          </div>

          <Link
            to="/produtos/cadastrar"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-button bg-primary px-5 font-headline font-bold text-white transition hover:bg-primary-dark lg:w-auto"
          >
            <PlusIcon
              size={20}
              weight="bold"
            />

            Cadastrar produto
          </Link>
        </div>

        <div className="mt-6">
          <label
            htmlFor="busca"
            className="sr-only"
          >
            Buscar produtos
          </label>

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
            className="h-12 w-full rounded-button border border-outline bg-white px-4 text-sm outline-none transition placeholder:text-ink-muted focus:border-primary focus:ring-2 focus:ring-primary/20 lg:max-w-sm"
          />
        </div>

        {carregando && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({
              length: 8,
            }).map(
              (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-card bg-white shadow-card"
                >
                  <div className="h-48 animate-pulse bg-neutral-light" />

                  <div className="space-y-3 p-5">
                    <div className="h-4 w-24 animate-pulse rounded bg-neutral-light" />

                    <div className="h-6 w-3/4 animate-pulse rounded bg-neutral-light" />

                    <div className="h-4 w-full animate-pulse rounded bg-neutral-light" />
                  </div>
                </div>
              ),
            )}
          </div>
        )}

        {!carregando &&
          erro && (
            <section className="mt-10 rounded-card bg-white p-8 text-center shadow-card">
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
            <section className="mt-10 rounded-card bg-white p-8 text-center shadow-card">
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

              <p className="mt-2 text-sm text-ink-soft">
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
            <>
              <p className="mt-8 text-sm text-ink-soft">
                <strong className="text-ink">
                  {
                    produtosFiltrados.length
                  }
                </strong>{' '}
                {produtosFiltrados.length ===
                1
                  ? 'produto encontrado'
                  : 'produtos encontrados'}
              </p>

              <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {produtosFiltrados.map(
                  (produto) => (
                    <article
                      key={
                        produto.id
                      }
                      className="group flex overflow-hidden rounded-card bg-white shadow-card transition hover:-translate-y-1 hover:shadow-card-hover sm:flex-col"
                    >
                      <div className="relative w-32 shrink-0 overflow-hidden bg-neutral-light sm:h-48 sm:w-full">
                        {produto.imagem ? (
                          <img
                            src={
                              produto.imagem
                            }
                            alt={
                              produto.nome
                            }
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full min-h-40 items-center justify-center text-ink-muted">
                            <PackageIcon
                              size={42}
                              weight="duotone"
                            />
                          </div>
                        )}

                        {produto
                          .categoria
                          ?.nome && (
                          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-primary shadow-sm">
                            {
                              produto
                                .categoria
                                .nome
                            }
                          </span>
                        )}
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
                        <h2 className="line-clamp-2 text-lg font-bold sm:text-xl">
                          {
                            produto.nome
                          }
                        </h2>

                        <p className="mt-2 line-clamp-2 text-sm leading-5 text-ink-soft">
                          {
                            produto.descricao
                          }
                        </p>

                        <div className="mt-4 space-y-2">
                          {produto.tempoEntrega !==
                            null && (
                            <div className="flex items-center gap-2 text-xs text-ink-muted">
                              <ClockIcon
                                size={
                                  17
                                }
                                weight="bold"
                              />

                              {
                                produto.tempoEntrega
                              }{' '}
                              min
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-xs text-ink-muted">
                            <TagIcon
                              size={
                                17
                              }
                              weight="bold"
                            />

                            Validade:{' '}
                            {formatarData(
                              produto.dataValidade,
                            )}
                          </div>
                        </div>

                        <div className="mt-auto pt-5">
                          <p className="text-xs text-ink-muted">
                            A partir de
                          </p>

                          <p className="font-headline text-xl font-extrabold text-primary-dark">
                            {formatarPreco(
                              produto.preco,
                            )}
                          </p>

                          <div className="mt-4 grid grid-cols-3 gap-2">
                            <Link
                              to={`/produtos/${produto.id}`}
                              aria-label={`Ver ${produto.nome}`}
                              className="flex h-10 items-center justify-center rounded-button bg-primary text-white transition hover:bg-primary-dark"
                            >
                              <ArrowRightIcon
                                size={
                                  19
                                }
                                weight="bold"
                              />
                            </Link>

                            <Link
                              to={`/produtos/editar/${produto.id}`}
                              aria-label={`Editar ${produto.nome}`}
                              className="flex h-10 items-center justify-center rounded-button bg-primary-soft text-primary transition hover:bg-primary hover:text-white"
                            >
                              <PencilSimpleIcon
                                size={
                                  19
                                }
                                weight="bold"
                              />
                            </Link>

                            <Link
                              to={`/produtos/deletar/${produto.id}`}
                              aria-label={`Excluir ${produto.nome}`}
                              className="flex h-10 items-center justify-center rounded-button bg-error-soft text-error transition hover:bg-error hover:text-white"
                            >
                              <TrashIcon
                                size={
                                  19
                                }
                                weight="bold"
                              />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  ),
                )}
              </div>
            </>
          )}
      </section>
    </main>
  )
}

export default Produtos