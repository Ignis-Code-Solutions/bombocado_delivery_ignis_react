import {
  ArrowRightIcon,
  ClockIcon,
  LeafIcon,
  MagnifyingGlassIcon,
  PackageIcon,
} from '@phosphor-icons/react'

import {
    type FormEvent,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  Link,
  useNavigate,
} from 'react-router-dom'

import { useAuth } from '../../contexts/AuthContext'
import type Produto from '../../models/Produto'
import { buscar } from '../../services/Service'

const IMAGEM_HERO =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBjXm56TG5BwbYNf4CG3CRdBtLEcMO1DS1Y_l1kqm9VeJJRLOVmOt6hPRx2cw20LZAXIdSVuj3xKGRrO09GBJHFxMdetUe8qzNJgO6DB-9bpLBDW-nv770c27ECbI8iKJ2l2PJvbn6_-lcOYs11E-jlMW_k5BUIeSfjYR7bToe_6-3rkOcPgUn3gPdeJyVdPATi4FyRuDUoGijTXdgkb3frpUA34ua2RELfc-gHJw6bR0qIJ_mvB1Kapw'

function Home() {
  const navigate = useNavigate()

  const {
    usuario,
    token,
  } = useAuth()

  const [produtos, setProdutos] =
    useState<Produto[]>([])

  const [busca, setBusca] =
    useState('')

  const [carregando, setCarregando] =
    useState(true)

  useEffect(() => {
    async function carregarProdutos() {
      if (!token) {
        setCarregando(false)
        return
      }

      try {
        setCarregando(true)

        const resposta =
          await buscar<Produto[]>(
            '/produtos',
            token,
          )

        setProdutos(resposta)
      } catch (error) {
        console.error(
          'Erro ao carregar produtos da Home:',
          error,
        )
      } finally {
        setCarregando(false)
      }
    }

    void carregarProdutos()
  }, [token])

  const produtosDestaque =
    useMemo(() => {
      const termo = busca
        .trim()
        .toLocaleLowerCase(
          'pt-BR',
        )

      const filtrados = termo
        ? produtos.filter(
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
                produto.categoria
                  ?.nome
                  ?.toLocaleLowerCase(
                    'pt-BR',
                  )

              return (
                nome?.includes(
                  termo,
                ) ||
                descricao?.includes(
                  termo,
                ) ||
                categoria?.includes(
                  termo,
                )
              )
            },
          )
        : produtos

      return filtrados.slice(0, 4)
    }, [produtos, busca])

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

  function irParaProdutos() {
    const termo = busca.trim()

    if (termo) {
      navigate(
        `/produtos?busca=${encodeURIComponent(
          termo,
        )}`,
      )

      return
    }

    navigate('/produtos')
  }

  function enviarBusca(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    irParaProdutos()
  }

  return (
    <main className="bg-surface">

      {/* ==========================
          HERO DESKTOP
      ========================== */}

      <section className="mx-auto hidden max-w-7xl px-4 pt-6 sm:px-6 lg:block lg:px-8">
        <div className="overflow-hidden rounded-[28px] bg-surface-low shadow-card">

          <div className="grid min-h-[380px] grid-cols-12">

            {/* Texto */}
            <div className="col-span-7 flex flex-col justify-center p-8 xl:p-10">

              <div className="mb-4 flex w-fit items-center gap-2 rounded-full bg-white/70 px-4 py-2">

                <span className="text-xs font-bold text-primary">
                  🌾 ALIMENTOS FRESCOS
                </span>

                <span className="h-1.5 w-1.5 rounded-full bg-primary" />

                <span className="text-xs font-medium text-ink-soft">
                  escolhas conscientes
                </span>

              </div>

              <p className="mb-1 text-sm font-semibold text-primary">
                Olá,{' '}
                {usuario?.nome ||
                  'bem-vindo(a)'}{' '}
                👋
              </p>

              <h1 className="max-w-2xl text-4xl font-extrabold leading-tight xl:text-5xl">
                Comida boa, feita com
                carinho e entregue
                quentinha.
              </h1>

              <p className="mt-4 max-w-xl text-base leading-7 text-ink-soft">
                Descubra produtos,
                refeições e opções
                conscientes disponíveis
                no BOMbocado.
              </p>

              {/* Busca */}
              <form
                onSubmit={enviarBusca}
                className="mt-6 flex max-w-xl items-center gap-3"
              >

                <div className="relative flex-1">

                  <MagnifyingGlassIcon
                    size={20}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
                  />

                  <input
                    type="search"
                    value={busca}
                    onChange={(event) =>
                      setBusca(
                        event.target
                          .value,
                      )
                    }
                    placeholder="O que deseja saborear hoje?"
                    className="h-12 w-full rounded-xl border border-outline/40 bg-white pl-12 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />

                </div>

                <button
                  type="submit"
                  className="flex h-12 shrink-0 items-center gap-2 rounded-xl bg-primary px-6 font-bold text-white shadow-sm transition hover:bg-primary-dark"
                >
                  Ver ofertas

                  <ArrowRightIcon
                    size={18}
                    weight="bold"
                  />
                </button>

              </form>

              {/* Populares */}
              <div className="mt-4 flex flex-wrap items-center gap-2">

                <span className="mr-1 text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Populares:
                </span>

                {[
                  'Lanches',
                  'Sobremesas',
                  'Bebidas',
                ].map(
                  (item) => (
                    <Link
                      key={item}
                      to={`/produtos?busca=${encodeURIComponent(
                        item,
                      )}`}
                      className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft transition hover:bg-primary-soft hover:text-primary"
                    >
                      {item}
                    </Link>
                  ),
                )}

              </div>

            </div>

            {/* Imagem */}
            <div className="relative col-span-5 overflow-hidden">

              <img
                src={IMAGEM_HERO}
                alt="Pães artesanais frescos"
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-surface-low via-transparent to-transparent" />

              <div className="absolute bottom-6 right-6 rounded-2xl bg-white/90 p-4 shadow-card backdrop-blur">

                <p className="text-xs font-bold text-ink">
                  🔥 Produtos
                  fresquinhos
                </p>

                <p className="mt-1 text-xs text-ink-muted">
                  Veja o que acabou de
                  chegar
                </p>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ==========================
          HERO MOBILE
      ========================== */}

      <section className="px-4 pt-4 lg:hidden">

        <div
          className="relative min-h-[230px] overflow-hidden rounded-2xl bg-cover bg-center p-5 shadow-card"
          style={{
            backgroundImage:
              `url(${IMAGEM_HERO})`,
          }}
        >

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/5" />

          <div className="relative z-10 flex min-h-[190px] flex-col justify-end">

            <span className="mb-2 w-fit rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              Destaques de hoje
            </span>

            <h1 className="max-w-sm text-2xl font-extrabold leading-tight text-white">
              Comida fresquinha
              esperando por você.
            </h1>

            <p className="mt-2 text-sm text-white/80">
              Confira as melhores
              opções do dia.
            </p>

            <Link
              to="/produtos"
              className="mt-4 flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white"
            >
              Ver ofertas

              <ArrowRightIcon
                size={17}
                weight="bold"
              />
            </Link>

          </div>
        </div>

      </section>

      {/* ==========================
          BUSCA MOBILE
      ========================== */}

      <section className="px-4 pt-4 lg:hidden">

        <form
          onSubmit={enviarBusca}
          className="flex gap-2"
        >

          <div className="relative flex-1">

            <MagnifyingGlassIcon
              size={20}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
            />

            <input
              type="search"
              value={busca}
              onChange={(event) =>
                setBusca(
                  event.target.value,
                )
              }
              placeholder="O que quer pedir hoje?"
              className="h-12 w-full rounded-full border border-outline/30 bg-white pl-12 pr-5 text-sm outline-none shadow-sm focus:border-primary"
            />

          </div>

          <button
            type="submit"
            aria-label="Buscar produtos"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white"
          >
            <ArrowRightIcon
              size={19}
              weight="bold"
            />
          </button>

        </form>

      </section>

      {/* ==========================
          CATEGORIAS
      ========================== */}

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        <div className="flex gap-3 overflow-x-auto pb-2 lg:justify-between">

          <Link
            to="/produtos?busca=Lanches"
            className="flex min-w-[105px] flex-col items-center gap-2 rounded-2xl bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-card"
          >
            <span className="text-3xl">
              🥖
            </span>

            <span className="text-sm font-bold">
              Lanches
            </span>
          </Link>

          <Link
            to="/produtos?busca=Refeição"
            className="flex min-w-[105px] flex-col items-center gap-2 rounded-2xl bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-card"
          >
            <span className="text-3xl">
              🥗
            </span>

            <span className="text-sm font-bold">
              Refeições
            </span>
          </Link>

          <Link
            to="/produtos/saudaveis"
            className="flex min-w-[105px] flex-col items-center gap-2 rounded-2xl bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-card"
          >
            <span className="text-3xl">
              🥑
            </span>

            <span className="text-sm font-bold">
              Saudáveis
            </span>
          </Link>

          <Link
            to="/produtos?busca=Sobremesas"
            className="flex min-w-[105px] flex-col items-center gap-2 rounded-2xl bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-card"
          >
            <span className="text-3xl">
              🍰
            </span>

            <span className="text-sm font-bold">
              Sobremesas
            </span>
          </Link>

          <Link
            to="/produtos?busca=Bebidas"
            className="flex min-w-[105px] flex-col items-center gap-2 rounded-2xl bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-card"
          >
            <span className="text-3xl">
              ☕
            </span>

            <span className="text-sm font-bold">
              Bebidas
            </span>
          </Link>

        </div>

      </section>

      {/* ==========================
          PRODUTOS EM DESTAQUE
      ========================== */}

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">

        <div className="mb-5 flex items-end justify-between gap-4">

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Seleção BOMbocado
            </p>

            <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">
              Destaques do dia
            </h2>

            <p className="mt-1 text-sm text-ink-muted">
              Confira algumas opções
              disponíveis.
            </p>

          </div>

          <Link
            to="/produtos"
            className="hidden items-center gap-1 text-sm font-bold text-primary transition hover:text-primary-dark sm:flex"
          >
            Ver todos

            <ArrowRightIcon
              size={16}
              weight="bold"
            />
          </Link>

        </div>

        {carregando ? (

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">

            {Array.from({
              length: 4,
            }).map(
              (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl bg-white shadow-card"
                >
                  <div className="aspect-4/3 animate-pulse bg-neutral-light" />

                  <div className="space-y-3 p-4">

                    <div className="h-5 w-3/4 animate-pulse rounded bg-neutral-light" />

                    <div className="h-4 w-full animate-pulse rounded bg-neutral-light" />

                    <div className="h-6 w-1/2 animate-pulse rounded bg-neutral-light" />

                  </div>
                </div>
              ),
            )}

          </div>

        ) : produtosDestaque.length >
          0 ? (

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">

            {produtosDestaque.map(
              (produto) => (

                <article
                  key={produto.id}
                  className="group flex min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-card transition hover:-translate-y-1 hover:shadow-card-hover"
                >

                  <Link
                    to={`/produtos/${produto.id}`}
                    className="relative block aspect-4/3 overflow-hidden bg-neutral-light"
                  >

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
                      <div className="flex h-full items-center justify-center text-ink-muted">
                        <PackageIcon
                          size={42}
                          weight="duotone"
                        />
                      </div>
                    )}

                    {produto.categoria
                      ?.nome && (
                      <span className="absolute left-3 top-3 max-w-[80%] truncate rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-primary shadow-sm">
                        {
                          produto
                            .categoria
                            .nome
                        }
                      </span>
                    )}

                  </Link>

                  <div className="flex flex-1 flex-col p-4">

                    <Link
                      to={`/produtos/${produto.id}`}
                      className="transition hover:text-primary"
                    >
                      <h3 className="line-clamp-2 text-sm font-bold leading-5 sm:text-base">
                        {produto.nome}
                      </h3>
                    </Link>

                    <p className="mt-2 hidden line-clamp-2 text-xs leading-5 text-ink-soft sm:block">
                      {
                        produto.descricao
                      }
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-ink-muted">

                      {produto.tempoEntrega !==
                        null && (
                        <span className="flex items-center gap-1">

                          <ClockIcon
                            size={13}
                          />

                          {
                            produto.tempoEntrega
                          }{' '}
                          min

                        </span>
                      )}

                      {produto.nutriscore && (
                        <span className="flex items-center gap-1">

                          <LeafIcon
                            size={13}
                          />

                          Nutri{' '}
                          {
                            produto.nutriscore
                          }

                        </span>
                      )}

                    </div>

                    <div className="mt-auto flex items-end justify-between gap-2 pt-4">

                      <div>

                        <p className="text-[10px] text-ink-muted">
                          A partir de
                        </p>

                        <p className="font-headline text-base font-extrabold text-primary-dark sm:text-xl">
                          {formatarPreco(
                            produto.preco,
                          )}
                        </p>

                      </div>

                      <Link
                        to={`/produtos/${produto.id}`}
                        aria-label={`Ver ${produto.nome}`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white transition hover:bg-primary-dark"
                      >
                        <ArrowRightIcon
                          size={17}
                          weight="bold"
                        />
                      </Link>

                    </div>

                  </div>

                </article>
              ),
            )}

          </div>

        ) : (

          <div className="rounded-2xl bg-white p-8 text-center shadow-card">

            <PackageIcon
              size={36}
              className="mx-auto text-primary"
            />

            <p className="mt-3 font-bold">
              Nenhum produto encontrado.
            </p>

            {busca && (
              <button
                type="button"
                onClick={() =>
                  setBusca('')
                }
                className="mt-3 text-sm font-bold text-primary transition hover:text-primary-dark"
              >
                Limpar busca
              </button>
            )}

          </div>

        )}

        <Link
          to="/produtos"
          className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-primary px-4 py-3 text-sm font-bold text-primary sm:hidden"
        >
          Ver todos os produtos

          <ArrowRightIcon
            size={17}
            weight="bold"
          />
        </Link>

      </section>

      {/* ==========================
          CONSUMO CONSCIENTE
      ========================== */}

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">

        <div className="overflow-hidden rounded-[28px] bg-[#fbe7e1] p-6 sm:p-8 lg:p-10">

          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">

            <div>

              <div className="flex w-fit items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs font-bold text-primary">

                <LeafIcon
                  size={15}
                  weight="fill"
                />

                Consumo consciente

              </div>

              <h2 className="mt-5 max-w-xl text-3xl font-extrabold leading-tight">
                Escolhas melhores para
                você e para o planeta.
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-ink-soft">
                Encontre alimentos
                disponíveis, descubra
                opções saudáveis e
                aproveite produtos de
                forma mais consciente.
              </p>

              <Link
                to="/produtos/saudaveis"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-dark"
              >
                Explorar opções
                saudáveis

                <ArrowRightIcon
                  size={17}
                  weight="bold"
                />
              </Link>

            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">

              <div className="rounded-2xl bg-white p-5">

                <span className="text-2xl">
                  🌱
                </span>

                <h3 className="mt-3 text-base font-bold">
                  Menos desperdício
                </h3>

                <p className="mt-1 text-xs leading-5 text-ink-soft">
                  Valorize alimentos
                  disponíveis e faça
                  escolhas conscientes.
                </p>

              </div>

              <div className="rounded-2xl bg-white p-5">

                <span className="text-2xl">
                  🥗
                </span>

                <h3 className="mt-3 text-base font-bold">
                  Mais informação
                </h3>

                <p className="mt-1 text-xs leading-5 text-ink-soft">
                  Consulte informações
                  dos produtos antes de
                  escolher.
                </p>

              </div>

              <div className="rounded-2xl bg-white p-5">

                <span className="text-2xl">
                  🤝
                </span>

                <h3 className="mt-3 text-base font-bold">
                  Mais oportunidades
                </h3>

                <p className="mt-1 text-xs leading-5 text-ink-soft">
                  Uma plataforma que
                  aproxima produtos e
                  consumidores.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  )
}

export default Home