import {
  GithubLogoIcon,
  HeartIcon,
} from '@phosphor-icons/react'

import { Link } from 'react-router-dom'

function Footer() {
  const anoAtual = new Date().getFullYear()

  return (
    <footer className="mt-auto bg-[#241812] text-white">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col gap-6 py-7 md:flex-row md:items-center md:justify-between">

          {/* Marca */}
          <div>
            <Link
              to="/produtos"
              className="font-headline text-2xl font-black"
            >
              <span className="text-white">
                BOM
              </span>

              <span className="text-primary">
                bocado
              </span>
            </Link>

            <p className="mt-1 text-sm text-white/60">
              Alimentos, oportunidades e consumo consciente.
            </p>
          </div>

          {/* Navegação */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-white/70">

            <Link
              to="/produtos"
              className="transition hover:text-primary"
            >
              Produtos
            </Link>

            <Link
              to="/produtos/saudaveis"
              className="transition hover:text-primary"
            >
              Saudáveis
            </Link>

            <Link
              to="/produtos/cadastrar"
              className="transition hover:text-primary"
            >
              Cadastrar
            </Link>

            <a
              href="https://github.com/Ignis-Code-Solutions/bombocado_delivery_ignis_react"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 transition hover:text-primary"
            >
              <GithubLogoIcon
                size={18}
                weight="bold"
              />

              GitHub
            </a>

          </nav>

        </div>

        {/* Linha inferior */}
        <div className="flex flex-col gap-2 border-t border-white/10 py-4 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">

          <p>
            © {anoAtual} BOMbocado · Ignis Code Solutions
          </p>

          <p className="flex items-center gap-1">
            Desenvolvido com

            <HeartIcon
              size={14}
              weight="fill"
              className="text-primary"
            />

            pela equipe.
          </p>

        </div>

      </div>

    </footer>
  )
}

export default Footer