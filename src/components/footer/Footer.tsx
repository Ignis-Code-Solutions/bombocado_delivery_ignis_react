import { GithubLogoIcon, HeartIcon, LeafIcon } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

function Footer() {
  const anoAtual =
    new Date().getFullYear()

  return (
    <footer className="border-t border-outline/40 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link
              to="/produtos"
              className="font-headline text-2xl font-extrabold text-primary-dark"
            >
              BOM
              <span className="text-primary">
                bocado
              </span>
            </Link>

            <p className="mt-3 max-w-sm text-sm leading-6 text-ink-soft">
              Conectando alimentos,
              oportunidades e pessoas de
              forma simples, acessível e
              consciente.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-ink">
              Navegação
            </h2>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                to="/produtos"
                className="w-fit text-sm text-ink-soft transition hover:text-primary"
              >
                Produtos
              </Link>

              <Link
                to="/produtos/saudaveis"
                className="flex w-fit items-center gap-2 text-sm text-ink-soft transition hover:text-primary"
              >
                <LeafIcon
                  size={16}
                />

                Opções saudáveis
              </Link>

              <Link
                to="/produtos/cadastrar"
                className="w-fit text-sm text-ink-soft transition hover:text-primary"
              >
                Cadastrar produto
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-ink">
              Projeto
            </h2>

            <p className="mt-4 text-sm leading-6 text-ink-soft">
              Projeto Integrador desenvolvido
              como parte da formação Full Stack
              da Generation Brasil.
            </p>

            <a
              href="https://github.com/Ignis-Code-Solutions/bombocado_delivery_ignis_react"
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex w-fit items-center gap-2 text-sm font-bold text-primary transition hover:text-primary-dark"
            >
              <GithubLogoIcon
                size={19}
                weight="bold"
              />

              Ver projeto no GitHub
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-outline/40 pt-5 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {anoAtual} BOMbocado.
            Todos os direitos reservados.
          </p>

          <p className="flex items-center gap-1">
            Feito com
            <HeartIcon
              size={15}
              weight="fill"
              className="text-primary"
            />
            pela equipe Ignis Code Solutions.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer