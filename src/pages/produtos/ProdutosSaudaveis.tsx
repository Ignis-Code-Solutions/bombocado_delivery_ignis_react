import { ArrowLeftIcon, HeartIcon, LeafIcon, PackageIcon, WarningCircleIcon } from '@phosphor-icons/react'
import axios from 'axios'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
            className="flex items-center gap-2 text-sm font-bold text-primary transition hover:text-primary-dark"
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

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="rounded-card bg-primary-soft p-6 sm:p-8 lg:flex lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary">
              <LeafIcon
                size={24}
                weight="duotone"
              />

              <p className="text-sm font-bold uppercase tracking-[0.16em]">
                Opções saudáveis
              </p>
            </div>

            <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              Recomendações de produtos saudáveis
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft sm:text-base">
              Nesta seleção aparecem produtos
              cadastrados com Nutriscore A ou B.
            </p>
          </div>

          <div className="mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-white text-primary shadow-card lg:mt-0">
            <HeartIcon
              size={32}
              weight="duotone"
            />
          </div>
        </div>

        <div className="mt-6 rounded-button border border-outline/60 bg-white px-4 py-3 text-xs leading-5 text-ink-muted">
          Esta seleção é uma adaptação no Front-end:
          atualmente o Backend não possui um endpoint
          específico de recomendações saudáveis. O
          filtro utiliza o campo Nutriscore retornado
          pelos produtos reais da API.
        </div>

        {carregando && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-card bg-white shadow-card"
              >
                <div className="h-48 animate-pulse bg-neutral-light" />

                <div className="space-y-3 p-5">
                  <div className="h-6 w-3/4 animate-pulse rounded bg-neutral-light" />

                  <div className="h-4 w-full animate-pulse rounded bg-neutral-light" />

                  <div className="h-10 w-32 animate-pulse rounded bg-neutral-light" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!carregando &&
          erro && (
            <section className="mt-8 rounded-card bg-white p-8 text-center shadow-card">
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
          produtosSaudaveis.length ===
            0 && (
            <section className="mt-8 rounded-card bg-white p-8 text-center shadow-card">
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
                Ainda não existem produtos com
                Nutriscore A ou B disponíveis.
              </p>
            </section>
          )}

        {!carregando &&
          !erro &&
          produtosSaudaveis.length >
            0 && (
            <>
              <p className="mt-8 text-sm text-ink-soft">
                <strong className="text-ink">
                  {
                    produtosSaudaveis.length
                  }
                </strong>{' '}
                {produtosSaudaveis.length ===
                1
                  ? 'produto saudável encontrado'
                  : 'produtos saudáveis encontrados'}
              </p>

              <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {produtosSaudaveis.map(
                  (produto) => (
                    <article
                      key={produto.id}
                      className="overflow-hidden rounded-card bg-white shadow-card transition hover:-translate-y-1 hover:shadow-card-hover"
                    >
                      <div className="h-48 overflow-hidden bg-neutral-light">
                        {produto.imagem ? (
                          <img
                            src={produto.imagem}
                            alt={produto.nome}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-ink-muted">
                            <PackageIcon
                              size={42}
                              weight="duotone"
                            />
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        {produto.categoria?.nome && (
                          <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary-dark">
                            {
                              produto
                                .categoria
                                .nome
                            }
                          </span>
                        )}

                        <h2 className="mt-3 text-xl font-bold">
                          {produto.nome}
                        </h2>

                        <p className="mt-2 line-clamp-2 text-sm leading-5 text-ink-soft">
                          {
                            produto.descricao
                          }
                        </p>

                        <div className="mt-5">
                          <Nutriscore
                            valor={
                              produto.nutriscore
                            }
                          />
                        </div>

                        <div className="mt-5 flex items-end justify-between gap-3">
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
                            className="rounded-button bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-primary-dark"
                          >
                            Ver produto
                          </Link>
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

export default ProdutosSaudaveis