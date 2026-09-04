import {
  ArrowLeftIcon,
  HeartIcon,
  LeafIcon,
  MagnifyingGlassIcon,
  PackageIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react'
import axios from 'axios'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  Link,
  useNavigate,
} from 'react-router-dom'

import Nutriscore from '../../components/nutriscore/Nutriscore'
import { useAuth } from '../../contexts/AuthContext'
import type Produto from '../../models/Produto'
import { buscar } from '../../services/Service'

function ProdutosSaudaveis() {
  const navigate = useNavigate()

  const {
    token,
    logout,
  } = useAuth()

  const [produtos, setProdutos] =
    useState<Produto[]>([])

  const [carregando, setCarregando] =
    useState(true)

  const [erro, setErro] =
    useState('')

  const [busca, setBusca] =
    useState('')

  const carregarProdutos =
    useCallback(async () => {
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
              'Não foi possível conectar ao servidor.',
            )

            return
          }
        }

        setErro(
          'Não foi possível carregar os produtos saudáveis.',
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
    const carregar = async () => {
      await carregarProdutos()
    }

    void carregar()
  }, [carregarProdutos])

  const produtosSaudaveis =
    useMemo(() => {
      return produtos.filter(
        (produto) => {
          const nutriscore =
            produto.nutriscore
              ?.trim()
              .toUpperCase()

          return (
            nutriscore === 'A' ||
            nutriscore === 'B'
          )
        },
      )
    }, [produtos])

  const produtosFiltrados =
    useMemo(() => {
      const termo = busca
        .trim()
        .toLocaleLowerCase(
          'pt-BR',
        )

      if (!termo) {
        return produtosSaudaveis
      }

      return produtosSaudaveis.filter(
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
    }, [
      busca,
      produtosSaudaveis,
    ])

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

  return (
    <main className="min-h-screen bg-surface">
      <header className="sticky top-0 z-30 border-b border-outline/40 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
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
            className="flex h-10 items-center justify-center gap-2 rounded-button px-2 text-sm font-bold text-primary transition hover:bg-primary-soft hover:text-primary-dark sm:px-4"
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

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="overflow-hidden rounded-card bg-primary-soft shadow-card">
          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center lg:p-8">
            <div>
              <div className="flex items-center gap-2 text-primary">
                <LeafIcon
                  size={22}
                  weight="duotone"
                />

                <p className="text-xs font-bold uppercase tracking-[0.18em] sm:text-sm">
                  Opções saudáveis
                </p>
              </div>

              <h1 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl">
                Recomendações de produtos saudáveis
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft sm:text-base">
                Produtos classificados com Nutriscore A ou B,
                com base nas informações retornadas pela API.
              </p>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-primary shadow-card sm:h-20 sm:w-20">
              <HeartIcon
                size={34}
                weight="duotone"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-button border border-outline/60 bg-white px-4 py-3 text-xs leading-5 text-ink-muted">
          Esta seleção é uma adaptação no Front-end.
          Atualmente o Backend não possui um endpoint
          específico de recomendações saudáveis, então
          o filtro utiliza o Nutriscore dos produtos reais.
        </div>

        <div className="mt-6 rounded-card bg-white p-4 shadow-card sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <label
                htmlFor="busca-saudaveis"
                className="sr-only"
              >
                Buscar opções saudáveis
              </label>

              <MagnifyingGlassIcon
                size={20}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
              />

              <input
                id="busca-saudaveis"
                type="search"
                value={busca}
                onChange={(event) =>
                  setBusca(
                    event.target.value,
                  )
                }
                placeholder="Buscar produto saudável..."
                className="h-12 w-full rounded-button border border-outline bg-surface pl-12 pr-4 text-sm outline-none transition placeholder:text-ink-muted focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {!carregando &&
              !erro && (
                <p className="text-sm text-ink-soft">
                  <strong className="text-ink">
                    {
                      produtosFiltrados.length
                    }
                  </strong>{' '}
                  {produtosFiltrados.length ===
                  1
                    ? 'produto saudável'
                    : 'produtos saudáveis'}
                </p>
              )}
          </div>
        </div>

        {carregando && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({
              length: 4,
            }).map(
              (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-card bg-white shadow-card"
                >
                  <div className="aspect-4/3 animate-pulse bg-neutral-light" />

                  <div className="space-y-3 p-5">
                    <div className="h-6 w-3/4 animate-pulse rounded bg-neutral-light" />

                    <div className="h-4 w-full animate-pulse rounded bg-neutral-light" />

                    <div className="h-10 w-32 animate-pulse rounded bg-neutral-light" />
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
                Não foi possível carregar
              </h2>

              <p className="mt-2 text-sm text-ink-soft">
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
                Nenhuma opção saudável encontrada
              </h2>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-ink-soft">
                {busca
                  ? 'Tente buscar por outro produto ou categoria.'
                  : 'Ainda não existem produtos com Nutriscore A ou B disponíveis.'}
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
                    className="group flex flex-col overflow-hidden rounded-card bg-white shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-card-hover"
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
                        <span className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-primary shadow-sm">
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

                      <div className="mt-5 rounded-button bg-surface p-4">
                        <Nutriscore
                          valor={
                            produto.nutriscore
                          }
                        />
                      </div>

                      <div className="mt-auto pt-5">
                        <div className="flex items-end justify-between gap-3">
                          <div>
                            <p className="text-xs text-ink-muted">
                              Preço
                            </p>

                            <p className="font-headline text-xl font-extrabold text-primary-dark">
                              {formatarPreco(
                                produto.preco,
                              )}
                            </p>
                          </div>

                          <Link
                            to={`/produtos/${produto.id}`}
                            className="rounded-button bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary-dark"
                          >
                            Ver produto
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

export default ProdutosSaudaveis