import { ArrowRightIcon, GithubLogoIcon, LinkedinLogoIcon, RecycleIcon, StorefrontIcon, UsersThreeIcon } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

const equipe = [
  { nome: 'André Nunes', github: 'andrelsrn', linkedin: 'https://www.linkedin.com/in/andrel-srn/' },
  { nome: 'Daniel Araújo', github: 'DaniChaves10', linkedin: 'https://www.linkedin.com/in/daniel-araujo10/' },
  { nome: 'Elaine Alves', github: 'alveslaine', linkedin: 'https://www.linkedin.com/in/elaine-alves-silva/' },
  { nome: 'João Pedro Duo', github: 'Joao-Pedro-Duo', linkedin: 'https://www.linkedin.com/in/joaopedroduo/' },
  { nome: 'Jonathan Leão', github: 'jonathanleao19', linkedin: 'https://www.linkedin.com/in/jonathanleao/' },
  { nome: 'Luiza Paolinelli', github: 'luizavpg-bit', linkedin: 'https://www.linkedin.com/in/luizavpg/' },
  { nome: 'Patrick Carneiro', github: 'phcarneiro9', linkedin: 'https://www.linkedin.com/in/phcarneiro9/' },
]

function SobreNos() {
  return (
    <main className="bg-surface">
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[28px] bg-surface-low shadow-card"><div className="px-6 py-14 text-center sm:px-10 lg:px-16 lg:py-20">
          <span className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">Sobre o projeto</span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">Quem somos</h1>
          <div className="mx-auto mt-6 max-w-3xl space-y-4 text-sm leading-7 text-ink-soft sm:text-base">
            <p>Somos a <strong className="text-primary">Ignis Code Solutions</strong>, uma equipe formada por estudantes do Bootcamp Java Full Stack da Generation Brasil.</p>
            <p>O <strong className="text-primary">BOMbocado</strong> nasceu com o propósito de utilizar a tecnologia para conectar empresas e consumidores através de uma experiência de delivery prática, acessível e consciente.</p>
          </div>
        </div></div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.7fr]">
          <div className="rounded-2xl bg-white p-6 shadow-card sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Conheça o BOMbocado</p>
            <h2 className="mt-2 text-3xl font-extrabold">Delivery que transforma desperdício em oportunidade</h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-ink-soft sm:text-base">
              <p>O <strong>BOMbocado</strong> é uma plataforma de delivery criada para ajudar a reduzir o desperdício de alimentos, conectando estabelecimentos que possuem produtos próximos da validade ou fora de época a consumidores que procuram alimentos de qualidade por preços mais acessíveis.</p>
              <p>Os estabelecimentos podem cadastrar produtos e disponibilizá-los em ofertas, enquanto os consumidores encontram essas oportunidades pela plataforma e realizam suas compras de forma prática.</p>
              <p>Assim, o consumidor consegue economizar e as empresas têm a oportunidade de reduzir perdas e gerar receita com produtos que poderiam ser desperdiçados.</p>
            </div>
            <div className="mt-6 rounded-xl border-l-4 border-primary bg-surface-low px-5 py-4 font-bold text-primary-dark">“Conectando quem tem excesso a quem precisa de acesso.”</div>
          </div>
          <div className="rounded-2xl bg-primary p-7 text-white shadow-card"><RecycleIcon size={32} weight="bold" /><h3 className="mt-5 text-2xl font-extrabold text-white">Nosso objetivo</h3><p className="mt-4 text-sm leading-7 text-white/85">Criar uma ponte entre estabelecimentos e consumidores, utilizando a tecnologia para incentivar um consumo mais consciente, reduzir desperdícios e transformar possíveis perdas em oportunidades.</p></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-6"><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Nosso propósito</p><h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">O que move o BOMbocado</h2></div>
        <div className="grid gap-5 md:grid-cols-3">
          <Pilar icon={<RecycleIcon size={23} weight="bold" />} categoria="Impacto" titulo="Reduzir o desperdício" texto="Dar uma nova oportunidade a alimentos que ainda possuem qualidade para consumo, evitando descartes desnecessários." />
          <Pilar icon={<UsersThreeIcon size={23} weight="bold" />} categoria="Acessibilidade" titulo="Gerar economia" texto="Facilitar o acesso dos consumidores a alimentos de qualidade por meio de ofertas e preços mais acessíveis." />
          <Pilar icon={<StorefrontIcon size={23} weight="bold" />} categoria="Oportunidade" titulo="Valorizar empresas" texto="Criar novas possibilidades de receita para os estabelecimentos, transformando possíveis perdas em novas oportunidades de venda." />
        </div>
      </section>

      <section className="bg-surface-low"><div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center"><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Ignis Code Solutions</p><h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Conheça nossa equipe</h2><p className="mt-3 text-sm leading-6 text-ink-soft sm:text-base">Pessoas que transformaram a proposta do BOMbocado em uma aplicação desenvolvida em equipe.</p></div>
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {equipe.map(pessoa => <article key={pessoa.github} className="rounded-2xl bg-white p-5 text-center shadow-card transition hover:-translate-y-1 hover:shadow-card-hover">
            <img src={`https://github.com/${pessoa.github}.png?size=240`} alt={`Foto de ${pessoa.nome}`} className="mx-auto h-24 w-24 rounded-full object-cover ring-4 ring-primary-soft" loading="lazy" />
            <h3 className="mt-4 text-lg font-extrabold">{pessoa.nome}</h3><p className="mt-1 text-xs font-semibold text-ink-muted">Full Stack Java</p>
            <div className="mt-4 flex justify-center gap-2"><a href={`https://github.com/${pessoa.github}`} target="_blank" rel="noreferrer" aria-label={`GitHub de ${pessoa.nome}`} className="flex h-9 w-9 items-center justify-center rounded-lg border border-outline/40 text-ink-soft transition hover:border-primary hover:text-primary"><GithubLogoIcon size={18} weight="bold" /></a><a href={pessoa.linkedin} target="_blank" rel="noreferrer" aria-label={`LinkedIn de ${pessoa.nome}`} className="flex h-9 w-9 items-center justify-center rounded-lg border border-outline/40 text-ink-soft transition hover:border-primary hover:text-primary"><LinkedinLogoIcon size={18} weight="bold" /></a></div>
          </article>)}
        </div>
        <div className="mt-9 flex justify-center"><Link to="/produtos" className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark">Conhecer produtos<ArrowRightIcon size={17} weight="bold" /></Link></div>
      </div></section>
    </main>
  )
}

function Pilar({ icon, categoria, titulo, texto }: { icon: ReactNode; categoria: string; titulo: string; texto: string }) {
  return <article className="rounded-2xl bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-card-hover"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">{icon}</div><p className="mt-5 text-xs font-bold uppercase tracking-wider text-primary">{categoria}</p><h3 className="mt-2 text-xl font-extrabold">{titulo}</h3><p className="mt-3 text-sm leading-6 text-ink-soft">{texto}</p></article>
}

export default SobreNos
