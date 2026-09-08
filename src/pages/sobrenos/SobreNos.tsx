import {
  ArrowRightIcon,
  RecycleIcon,
  StorefrontIcon,
  UsersThreeIcon,
} from '@phosphor-icons/react'

import { Link } from 'react-router-dom'

function SobreNos() {
  return (
    <main className="bg-surface">

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[28px] bg-surface-low shadow-card">
          <div className="px-6 py-14 text-center sm:px-10 lg:px-16 lg:py-20">

            <span className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Sobre o projeto
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">
              Quem somos
            </h1>

            <div className="mx-auto mt-6 max-w-3xl space-y-4 text-sm leading-7 text-ink-soft sm:text-base">
              <p>
                Somos a{' '}
                <strong className="text-primary">
                  Ignis Code Solutions
                </strong>
                , uma equipe formada por estudantes do Bootcamp Java Full Stack
                da Generation Brasil.
              </p>

              <p>
                O{' '}
                <strong className="text-primary">
                  BOMbocado
                </strong>{' '}
                nasceu com o propósito de utilizar a tecnologia para conectar
                empresas e consumidores através de uma experiência de delivery
                prática, acessível e consciente.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* INTRODUÇÃO */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.7fr]">

          <div className="rounded-2xl bg-white p-6 shadow-card sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Conheça o BOMbocado
            </p>

            <h2 className="mt-2 text-3xl font-extrabold">
              Delivery com propósito
            </h2>

            <div className="mt-5 space-y-4 text-sm leading-7 text-ink-soft sm:text-base">
              <p>
                O <strong>BOMbocado</strong> é uma plataforma de delivery de
                alimentos criada para conectar empresas que possuem produtos
                próximos da validade ou fora de época a consumidores que buscam
                alimentos de qualidade por preços mais acessíveis.
              </p>

              <p>
                Pela plataforma, os estabelecimentos podem disponibilizar seus
                produtos e criar ofertas com descontos atrativos, enquanto os
                consumidores conseguem visualizar as opções disponíveis e
                realizar suas compras de forma prática.
              </p>

              <p>
                Além de proporcionar economia aos consumidores, o projeto busca
                contribuir para a redução do desperdício de alimentos e criar
                novas oportunidades de receita para empresas parceiras.
              </p>
            </div>

            <div className="mt-6 rounded-xl border-l-4 border-primary bg-surface-low px-5 py-4 font-bold text-primary-dark">
              “Conectando quem tem excesso a quem precisa de acesso.”
            </div>
          </div>

          <div className="rounded-2xl bg-primary p-7 text-white shadow-card">
            <RecycleIcon
              size={32}
              weight="bold"
            />

            <h3 className="mt-5 text-2xl font-extrabold text-white">
              Nosso objetivo
            </h3>

            <p className="mt-4 text-sm leading-7 text-white/85">
              Criar uma ponte entre estabelecimentos e consumidores, utilizando
              a tecnologia para incentivar um consumo mais consciente, reduzir
              desperdícios e transformar possíveis perdas em oportunidades.
            </p>
          </div>

        </div>
      </section>

      {/* PILARES */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Nosso propósito
          </p>

          <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">
            O que move o BOMbocado
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">

          <article className="rounded-2xl bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-card-hover">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <RecycleIcon
                size={23}
                weight="bold"
              />
            </div>

            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-primary">
              Impacto
            </p>

            <h3 className="mt-2 text-xl font-extrabold">
              Reduzir o desperdício
            </h3>

            <p className="mt-3 text-sm leading-6 text-ink-soft">
              Dar uma nova oportunidade a alimentos que ainda possuem qualidade
              para consumo, evitando descartes desnecessários.
            </p>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-card-hover">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <UsersThreeIcon
                size={23}
                weight="bold"
              />
            </div>

            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-primary">
              Acessibilidade
            </p>

            <h3 className="mt-2 text-xl font-extrabold">
              Gerar economia
            </h3>

            <p className="mt-3 text-sm leading-6 text-ink-soft">
              Facilitar o acesso dos consumidores a alimentos de qualidade por
              meio de ofertas e preços mais acessíveis.
            </p>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-card-hover">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <StorefrontIcon
                size={23}
                weight="bold"
              />
            </div>

            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-primary">
              Oportunidade
            </p>

            <h3 className="mt-2 text-xl font-extrabold">
              Valorizar empresas
            </h3>

            <p className="mt-3 text-sm leading-6 text-ink-soft">
              Criar novas possibilidades de receita para os estabelecimentos,
              transformando possíveis perdas em novas oportunidades de venda.
            </p>
          </article>

        </div>

        <div className="mt-8 flex justify-center">
          <Link
            to="/produtos"
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark"
          >
            Conhecer produtos

            <ArrowRightIcon
              size={17}
              weight="bold"
            />
          </Link>
        </div>
      </section>

    </main>
  )
}

export default SobreNos
