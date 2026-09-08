import {
  EnvelopeSimpleIcon,
  HouseIcon,
  IdentificationCardIcon,
  PhoneIcon,
  UserIcon,
} from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { useAuth } from '../../contexts/AuthContext'

function Perfil() {
  const { usuario } = useAuth()

  if (!usuario) {
    return null
  }

  return (
    <main className="min-h-[70vh] bg-surface px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-card bg-white shadow-card">
          <div className="bg-primary px-6 py-8 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/80">
              Minha conta
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-white">
              Meu perfil
            </h1>
          </div>

          <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[220px_1fr]">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-primary-soft text-primary">
                {usuario.imagem ? (
                  <img
                    src={usuario.imagem}
                    alt={usuario.nome}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserIcon size={58} weight="duotone" />
                )}
              </div>

              <h2 className="mt-4 text-xl font-extrabold">{usuario.nome}</h2>

              {usuario.tipo && (
                <span className="mt-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold uppercase text-primary-dark">
                  {usuario.tipo}
                </span>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Info
                icon={<IdentificationCardIcon size={21} weight="duotone" />}
                label="Nome"
                value={usuario.nome}
              />
              <Info
                icon={<EnvelopeSimpleIcon size={21} weight="duotone" />}
                label="E-mail"
                value={usuario.usuario}
              />
              <Info
                icon={<PhoneIcon size={21} weight="duotone" />}
                label="Telefone"
                value={usuario.telefone || 'Não informado'}
              />
              <Info
                icon={<HouseIcon size={21} weight="duotone" />}
                label="Endereço"
                value={usuario.endereco || 'Não informado'}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function Info({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <article className="rounded-2xl border border-outline/40 bg-surface p-4">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-2 break-words text-sm font-semibold text-ink">{value}</p>
    </article>
  )
}

export default Perfil
