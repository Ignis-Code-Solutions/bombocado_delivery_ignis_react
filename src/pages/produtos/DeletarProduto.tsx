import { ArrowLeftIcon, PackageIcon, TrashIcon, WarningCircleIcon, } from '@phosphor-icons/react'
import axios from 'axios'
import { useEffect, useState, } from 'react'
import { Link, useNavigate, useParams, } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import type Produto from '../../models/Produto'
import { buscar, deletar, } from '../../services/Service'

function DeletarProduto() {
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

  const [deletando, setDeletando] =
    useState(false)

  const [erro, setErro] = useState('')

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

    const carregarProduto = async () => {
      try {
        const resposta =
          await buscar<Produto>(
            `/produtos/${id}`,
            token,
          )

        setProduto(resposta)
      } catch (error) {
        console.error(error)

        if (
          axios.isAxiosError(error) &&
          error.response?.status === 401
        ) {
          logout()

          navigate('/login', {
            replace: true,
          })

          return
        }

        setErro(
          'Não foi possível carregar o produto.',
        )
      } finally {
        setCarregando(false)
      }
    }

    void carregarProduto()
  }, [
    id,
    isAuthenticated,
    logout,
    navigate,
    token,
  ])

  async function confirmarExclusao() {
    if (!id) {
      return
    }

    try {
      setDeletando(true)
      setErro('')

      await deletar(
        `/produtos/${id}`,
        token,
      )

      navigate('/produtos', {
        replace: true,
        state: {
          produtoExcluido: true,
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

        if (error.response?.status === 404) {
          setErro(
            'Este produto não existe mais.',
          )

          return
        }

        if (error.code === 'ECONNABORTED') {
          setErro(
            'O servidor demorou para responder.',
          )

          return
        }
      }

      setErro(
        'Não foi possível excluir o produto.',
      )
    } finally {
      setDeletando(false)
    }
  }

  if (carregando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface p-4">
        <div className="w-full max-w-lg rounded-card bg-white p-8 shadow-card">
          <div className="mx-auto h-16 w-16 animate-pulse rounded-full bg-neutral-light" />

          <div className="mx-auto mt-6 h-8 w-56 animate-pulse rounded bg-neutral-light" />

          <div className="mx-auto mt-4 h-5 w-3/4 animate-pulse rounded bg-neutral-light" />
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface p-4">
      <section className="w-full max-w-lg rounded-card bg-white p-6 text-center shadow-card sm:p-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error-soft text-error">
          <TrashIcon
            size={32}
            weight="duotone"
          />
        </div>

        <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-error">
          Excluir produto
        </p>

        <h1 className="mt-2 text-2xl sm:text-3xl">
          Tem certeza?
        </h1>

        {produto ? (
          <>
            <p className="mt-4 text-sm leading-6 text-ink-soft">
              Você está prestes a excluir permanentemente:
            </p>

            <div className="mt-5 flex items-center gap-4 rounded-button bg-surface-low p-4 text-left">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-button bg-neutral-light text-ink-muted">
                {produto.imagem ? (
                  <img
                    src={produto.imagem}
                    alt={produto.nome}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <PackageIcon
                    size={27}
                    weight="duotone"
                  />
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate font-bold">
                  {produto.nome}
                </p>

                {produto.categoria?.nome && (
                  <p className="mt-1 text-xs text-ink-muted">
                    {produto.categoria.nome}
                  </p>
                )}
              </div>
            </div>
          </>
        ) : (
          <p className="mt-4 text-sm text-ink-soft">
            Produto não encontrado.
          </p>
        )}

        <div className="mt-5 flex items-start gap-2 rounded-button bg-error-soft p-3 text-left text-xs leading-5 text-error">
          <WarningCircleIcon
            size={19}
            weight="fill"
            className="shrink-0"
          />

          <span>
            Esta ação não poderá ser desfeita.
          </span>
        </div>

        {erro && (
          <div
            role="alert"
            className="mt-4 rounded-button bg-error-soft px-4 py-3 text-sm font-medium text-error"
          >
            {erro}
          </div>
        )}

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
          <Link
            to="/produtos"
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-button border border-outline font-bold text-ink-soft transition hover:border-primary hover:text-primary"
          >
            <ArrowLeftIcon
              size={19}
              weight="bold"
            />

            Cancelar
          </Link>

          <button
            type="button"
            onClick={() =>
              void confirmarExclusao()
            }
            disabled={
              deletando ||
              !produto
            }
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-button bg-error font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <TrashIcon
              size={19}
              weight="bold"
            />

            {deletando
              ? 'Excluindo...'
              : 'Excluir'}
          </button>
        </div>
      </section>
    </main>
  )
}

export default DeletarProduto