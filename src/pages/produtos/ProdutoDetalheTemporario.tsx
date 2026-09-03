import {
  ArrowLeftIcon,
  PackageIcon,
} from '@phosphor-icons/react'
import { Link, useParams } from 'react-router-dom'

function ProdutoDetalheTemporario() {
  const { id } = useParams()

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface p-4">
      <section className="w-full max-w-md rounded-card bg-white p-8 text-center shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
          <PackageIcon
            size={30}
            weight="duotone"
          />
        </div>

        <h1 className="mt-5 text-2xl">
          Produto #{id}
        </h1>

        <p className="mt-2 text-sm leading-6 text-ink-soft">
          A tela completa deste produto será construída
          na próxima etapa junto com o Nutriscore.
        </p>

        <Link
          to="/produtos"
          className="mt-6 inline-flex items-center gap-2 rounded-button bg-primary px-5 py-3 font-bold text-white transition hover:bg-primary-dark"
        >
          <ArrowLeftIcon
            size={19}
            weight="bold"
          />

          Voltar aos produtos
        </Link>
      </section>
    </main>
  )
}

export default ProdutoDetalheTemporario