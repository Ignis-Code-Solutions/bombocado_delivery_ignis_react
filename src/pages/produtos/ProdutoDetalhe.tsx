import {
  ArrowLeftIcon,
  CalendarBlankIcon,
  ClockIcon,
  MapPinIcon,
  PackageIcon,
  ShieldCheckIcon,
  StorefrontIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react'
import axios from 'axios'
import {
  useCallback,
  useEffect,
  useState,
} from 'react'
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom'

import Nutriscore from '../../components/nutriscore/Nutriscore'
import { useAuth } from '../../contexts/AuthContext'
import type Produto from '../../models/Produto'
import { buscar } from '../../services/Service'

function ProdutoDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    token,
    isAuthenticated,
    logout,
  } = useAuth()

  const [produto, setProduto] =
    useState<Produto | null>(null)

  const [carregando, setCarregando] =
    useState(true)

  const [erro, setErro] =
    useState('')

  const carregarProduto = useCallback(
    async (produtoId: string) => {
      try {
        setCarregando(true)
        setErro('')

        const resposta =
          await buscar<Produto>(
            `/produtos/${produtoId}`,
            token,
          )

        setProduto(resposta)
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
            error.response?.status ===
            404
          ) {
            setErro(
              'O produto solicitado não foi encontrado.',
            )

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
          'Não foi possível carregar os detalhes do produto.',
        )
      } finally {
        setCarregando(false)
      }
    },
    [
      token,
      logout,
      navigate,
    ],
  )

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', {
        replace: true,
      })

      return
    }

    if (!id) {
      navigate('/produtos', {
        replace: true,
      })

      return
    }

    const carregar = async () => {
      await carregarProduto(id)
    }

    void carregar()
  }, [
    id,
    isAuthenticated,
    carregarProduto,
    navigate,
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

  if (carregando) {
    return (
      <main className="min-h-screen bg-surface">
        <header className="border-b border-outline/40 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="h-8 w-40 animate-pulse rounded bg-neutral-light" />
          </div>
        </header>

        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
            <div className="aspect-4/3 animate-pulse rounded-card bg-neutral-light lg:aspect-square" />

            <div className="space-y-5">
              <div className="h-7 w-28 animate-pulse rounded-full bg-neutral-light" />

              <div className="h-12 w-4/5 animate-pulse rounded bg-neutral-light" />

              <div className="h-5 w-full animate-pulse rounded bg-neutral-light" />

              <div className="h-5 w-3/4 animate-pulse rounded bg-neutral-light" />

              <div className="h-12 w-44 animate-pulse rounded bg-neutral-light" />

              <div className="h-40 animate-pulse rounded-card bg-neutral-light" />
            </div>
          </div>
        </section>
      </main>
    )
  }

  if (erro || !produto) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface p-4">
        <section className="w-full max-w-lg rounded-card bg-white p-7 text-center shadow-card sm:p-9">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-error-soft text-error">
            <WarningCircleIcon
              size={30}
              weight="fill"
            />
          </div>

          <h1 className="mt-5 text-2xl font-extrabold sm:text-3xl">
            Produto indisponível
          </h1>

          <p className="mt-3 text-sm leading-6 text-ink-soft">
            {erro ||
              'Não foi possível encontrar este produto.'}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {id && (
              <button
                type="button"
                onClick={() =>
                  void carregarProduto(id)
                }
                className="flex h-12 items-center justify-center rounded-button bg-primary px-6 font-bold text-white transition hover:bg-primary-dark"
              >
                Tentar novamente
              </button>
            )}

            <Link
              to="/produtos"
              className="flex h-12 items-center justify-center gap-2 rounded-button border border-outline px-6 font-bold text-ink-soft transition hover:border-primary hover:text-primary"
            >
              <ArrowLeftIcon
                size={19}
                weight="bold"
              />

              Voltar aos produtos
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-surface">
      <header className="sticky top-0 z-30 border-b border-outline/40 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            to="/produtos"
            className="shrink-0 font-headline text-2xl font-extrabold text-primary-dark sm:text-3xl"
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
        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10 xl:gap-14">
          <div className="lg:sticky lg:top-24">
            <div className="aspect-4/3 overflow-hidden rounded-card bg-white shadow-card sm:aspect-16/11 lg:aspect-square">
              {produto.imagem ? (
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-neutral-light text-ink-muted">
                  <PackageIcon
                    size={72}
                    weight="duotone"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="min-w-0">
            {produto.categoria?.nome && (
              <span className="inline-flex max-w-full truncate rounded-full bg-primary-soft px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-primary-dark">
                {produto.categoria.nome}
              </span>
            )}

            <h1 className="mt-4 wrap-break-word text-3xl font-extrabold leading-tight sm:text-4xl lg:text-[2.65rem] xl:text-5xl">
              {produto.nome}
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-6 text-ink-soft sm:text-base sm:leading-7">
              {produto.descricao}
            </p>

            <div className="mt-6 border-y border-outline/40 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
                Preço
              </p>

              <p className="mt-1 font-headline text-3xl font-extrabold text-primary-dark sm:text-4xl">
                {formatarPreco(
                  produto.preco,
                )}
              </p>
            </div>

            <section className="mt-6 rounded-card bg-white p-5 shadow-card sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-muted">
                    Informação nutricional
                  </p>

                  <p className="mt-1 text-sm text-ink-soft">
                    Classificação retornada pelo produto.
                  </p>
                </div>

                <Nutriscore
                  valor={produto.nutriscore}
                />
              </div>

              <div className="my-5 h-px bg-outline/40" />

              <div className="grid gap-3 sm:grid-cols-2">
                {produto.tempoEntrega !==
                  null && (
                  <div className="flex items-center gap-3 rounded-button bg-surface p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                      <ClockIcon
                        size={22}
                        weight="duotone"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-ink-muted">
                        Tempo de entrega
                      </p>

                      <p className="mt-1 text-sm font-bold text-ink sm:text-base">
                        {
                          produto.tempoEntrega
                        }{' '}
                        minutos
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 rounded-button bg-surface p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <CalendarBlankIcon
                      size={22}
                      weight="duotone"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-ink-muted">
                      Data de validade
                    </p>

                    <p className="mt-1 text-sm font-bold text-ink sm:text-base">
                      {formatarData(
                        produto.dataValidade,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {produto.usuario && (
              <section className="mt-5 rounded-card bg-white p-5 shadow-card sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-muted">
                  Disponibilizado por
                </p>

                <div className="mt-4 flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-soft text-primary sm:h-14 sm:w-14">
                    {produto.usuario.imagem ? (
                      <img
                        src={
                          produto.usuario.imagem
                        }
                        alt={
                          produto.usuario.nome
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <StorefrontIcon
                        size={27}
                        weight="duotone"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-lg font-bold sm:text-xl">
                      {produto.usuario.nome}
                    </h2>

                    {produto.usuario.endereco && (
                      <div className="mt-2 flex items-start gap-2 text-sm leading-5 text-ink-soft">
                        <MapPinIcon
                          size={17}
                          className="mt-0.5 shrink-0"
                        />

                        <span className="wrap-break-word">
                          {
                            produto.usuario
                              .endereco
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            <div className="mt-5 flex items-start gap-3 rounded-card border border-primary/10 bg-primary-soft p-4 sm:p-5">
              <ShieldCheckIcon
                size={24}
                weight="duotone"
                className="mt-0.5 shrink-0 text-primary"
              />

              <div>
                <p className="text-sm font-bold text-ink">
                  Confira antes de solicitar
                </p>

                <p className="mt-1 text-sm leading-6 text-ink-soft">
                  Verifique as informações do produto
                  e principalmente a data de validade
                  antes de concluir qualquer solicitação.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-card bg-white p-4 shadow-card sm:p-5">
              <button
                type="button"
                disabled
                title="A integração com o carrinho será realizada pela funcionalidade responsável pelo carrinho."
                className="flex h-12 w-full cursor-not-allowed items-center justify-center rounded-button bg-primary px-6 font-headline font-bold text-white opacity-60"
              >
                Adicionar ao carrinho
              </button>

              <p className="mt-2 text-center text-xs leading-5 text-ink-muted">
                Integração com o carrinho em desenvolvimento.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ProdutoDetalhe