import { ArrowLeftIcon, CalendarBlankIcon, ClockIcon, MapPinIcon, PackageIcon, ShieldCheckIcon, StorefrontIcon, WarningCircleIcon, } 
from '@phosphor-icons/react'
import axios from 'axios'
import { useCallback, useEffect, useState, } from 'react'
import { Link, useNavigate, useParams, } from 'react-router-dom'
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

  const [erro, setErro] = useState('')

  const carregarProduto = useCallback(
    async (produtoId: string) => {
      try {
        setCarregando(true)
        setErro('')

        const resposta = await buscar<Produto>(
          `/produtos/${produtoId}`,
          token,
        )

        setProduto(resposta)
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
          'Não foi possível carregar os detalhes do produto.',
        )
      } finally {
        setCarregando(false)
      }
    },
    [token, logout, navigate],
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

  function formatarPreco(preco: string) {
    const valor = Number(preco)

    if (Number.isNaN(valor)) {
      return 'R$ 0,00'
    }

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor)
  }

  function formatarData(data: string) {
    const partes = data.split('-')

    if (partes.length !== 3) {
      return data
    }

    const [ano, mes, dia] = partes

    return `${dia}/${mes}/${ano}`
  }

  if (carregando) {
    return (
      <main className="min-h-screen bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="h-10 w-40 animate-pulse rounded-button bg-neutral-light" />

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-card bg-neutral-light" />

            <div className="space-y-5">
              <div className="h-5 w-32 animate-pulse rounded bg-neutral-light" />

              <div className="h-12 w-3/4 animate-pulse rounded bg-neutral-light" />

              <div className="h-5 w-full animate-pulse rounded bg-neutral-light" />

              <div className="h-5 w-4/5 animate-pulse rounded bg-neutral-light" />

              <div className="h-12 w-40 animate-pulse rounded bg-neutral-light" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (erro || !produto) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface p-4">
        <section className="w-full max-w-lg rounded-card bg-white p-8 text-center shadow-card">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-error-soft text-error">
            <WarningCircleIcon
              size={30}
              weight="fill"
            />
          </div>

          <h1 className="mt-5 text-2xl">
            Produto indisponível
          </h1>

          <p className="mt-3 text-sm leading-6 text-ink-soft">
            {erro ||
              'Não foi possível encontrar este produto.'}
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            {id && (
              <button
                type="button"
                onClick={() =>
                  void carregarProduto(id)
                }
                className="rounded-button bg-primary px-5 py-3 font-bold text-white transition hover:bg-primary-dark"
              >
                Tentar novamente
              </button>
            )}

            <Link
              to="/produtos"
              className="inline-flex items-center justify-center gap-2 rounded-button border border-outline px-5 py-3 font-bold text-ink-soft transition hover:border-primary hover:text-primary"
            >
              <ArrowLeftIcon
                size={19}
                weight="bold"
              />

              Voltar
            </Link>
          </div>
        </section>
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
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="aspect-square overflow-hidden rounded-card bg-white shadow-card">
              {produto.imagem ? (
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-neutral-light text-ink-muted">
                  <PackageIcon
                    size={80}
                    weight="duotone"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            {produto.categoria?.nome && (
              <span className="w-fit rounded-full bg-primary-soft px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary-dark">
                {produto.categoria.nome}
              </span>
            )}

            <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              {produto.nome}
            </h1>

            <p className="mt-5 text-base leading-7 text-ink-soft">
              {produto.descricao}
            </p>

            <div className="mt-7">
              <p className="text-sm text-ink-muted">
                Preço
              </p>

              <p className="mt-1 font-headline text-4xl font-extrabold text-primary-dark">
                {formatarPreco(produto.preco)}
              </p>
            </div>

            <div className="mt-8 rounded-card bg-white p-5 shadow-card sm:p-6">
              <Nutriscore
                valor={produto.nutriscore}
              />

              <div className="my-6 h-px bg-outline/50" />

              <div className="grid gap-5 sm:grid-cols-2">
                {produto.tempoEntrega !== null && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                      <ClockIcon
                        size={21}
                        weight="duotone"
                      />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-ink-muted">
                        Tempo de entrega
                      </p>

                      <p className="mt-1 text-sm font-bold">
                        {produto.tempoEntrega}{' '}
                        minutos
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <CalendarBlankIcon
                      size={21}
                      weight="duotone"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-ink-muted">
                      Data de validade
                    </p>

                    <p className="mt-1 text-sm font-bold">
                      {formatarData(
                        produto.dataValidade,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {produto.usuario && (
              <section className="mt-6 rounded-card border border-outline/60 bg-white p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-soft text-primary">
                    {produto.usuario.imagem ? (
                      <img
                        src={produto.usuario.imagem}
                        alt={produto.usuario.nome}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <StorefrontIcon
                        size={25}
                        weight="duotone"
                      />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink-muted">
                      Disponibilizado por
                    </p>

                    <h2 className="mt-1 truncate text-lg">
                      {produto.usuario.nome}
                    </h2>

                    {produto.usuario.endereco && (
                      <div className="mt-2 flex items-start gap-1.5 text-sm text-ink-soft">
                        <MapPinIcon
                          size={17}
                          className="mt-0.5 shrink-0"
                        />

                        <span>
                          {produto.usuario.endereco}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            <div className="mt-6 flex items-start gap-3 rounded-card bg-primary-soft p-4">
              <ShieldCheckIcon
                size={24}
                weight="duotone"
                className="shrink-0 text-primary"
              />

              <p className="text-sm leading-6 text-ink-soft">
                Confira as informações do produto,
                incluindo a data de validade, antes de
                concluir qualquer solicitação.
              </p>
            </div>

            <div className="mt-8">
              <button
                type="button"
                disabled
                className="h-13 w-full cursor-not-allowed rounded-button bg-primary px-6 py-3.5 font-headline font-bold text-white opacity-60"
                title="A integração com o carrinho será realizada na etapa responsável pelo carrinho."
              >
                Adicionar ao carrinho
              </button>

              <p className="mt-2 text-center text-xs text-ink-muted">
                Integração com o carrinho em
                desenvolvimento.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ProdutoDetalhe