import {
  EnvelopeSimpleIcon,
  HouseIcon,
  IdentificationCardIcon,
  PhoneIcon,
  ShieldCheckIcon,
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
    <main className="min-h-[calc(100vh-68px)] bg-[#fff8f6] px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">

        {/* Cabeçalho */}
        <div className="mb-7">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
            Minha conta
          </span>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#291a14] sm:text-4xl">
            Meu perfil
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#8a7770]">
            Visualize suas informações pessoais e os dados cadastrados
            na sua conta BOMbocado.
          </p>
        </div>

        {/* Card principal */}
        <div className="overflow-hidden rounded-[28px] border border-[#f0ded7] bg-white shadow-sm">

          {/* Banner */}
          <div className="relative h-32 overflow-hidden bg-primary sm:h-40">
            <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/10" />

            <div className="absolute right-20 top-10 h-24 w-24 rounded-full bg-white/10" />

            <div className="absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-white/10" />
          </div>

          <div className="px-6 pb-8 sm:px-9">

            {/* Avatar + identificação */}
            <div className="-mt-16 flex flex-col items-center sm:-mt-14 sm:flex-row sm:items-end sm:gap-5">

              <div className="relative">
                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-[5px] border-white bg-[#ffede2] text-primary shadow-md">
                  {usuario.imagem ? (
                    <img
                      src={usuario.imagem}
                      alt={usuario.nome}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserIcon
                      size={55}
                      weight="duotone"
                    />
                  )}
                </div>

                {/* Indicador */}
                <div
                  className="absolute bottom-2 right-2 h-5 w-5 rounded-full border-4 border-white bg-green-500"
                  title="Usuário ativo"
                />
              </div>

              <div className="mt-4 flex-1 text-center sm:mb-2 sm:mt-0 sm:text-left">
                <h2 className="text-2xl font-extrabold text-[#291a14]">
                  {usuario.nome}
                </h2>

                <p className="mt-1 text-sm text-[#8a7770]">
                  {usuario.usuario}
                </p>
              </div>

              {usuario.tipo && (
                <div className="mt-4 sm:mb-3 sm:mt-0">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ffede2] px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-[#a73a00]">
                    <ShieldCheckIcon
                      size={16}
                      weight="fill"
                    />

                    {usuario.tipo}
                  </span>
                </div>
              )}
            </div>

            {/* Divisor */}
            <div className="my-8 h-px bg-[#f0e4df]" />

            {/* Informações */}
            <div>
              <div className="mb-5">
                <h3 className="text-lg font-extrabold text-[#291a14]">
                  Informações pessoais
                </h3>

                <p className="mt-1 text-sm text-[#8a7770]">
                  Dados associados à sua conta.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">

                <Info
                  icon={
                    <IdentificationCardIcon
                      size={22}
                      weight="duotone"
                    />
                  }
                  label="Nome completo"
                  value={usuario.nome}
                />

                <Info
                  icon={
                    <EnvelopeSimpleIcon
                      size={22}
                      weight="duotone"
                    />
                  }
                  label="E-mail"
                  value={usuario.usuario}
                />

                <Info
                  icon={
                    <PhoneIcon
                      size={22}
                      weight="duotone"
                    />
                  }
                  label="Telefone"
                  value={
                    usuario.telefone ||
                    'Não informado'
                  }
                />

                <Info
                  icon={
                    <HouseIcon
                      size={22}
                      weight="duotone"
                    />
                  }
                  label="Endereço"
                  value={
                    usuario.endereco ||
                    'Não informado'
                  }
                />

              </div>
            </div>

            {/* Rodapé do card */}
            <div className="mt-8 flex items-center gap-3 rounded-2xl bg-[#fff8f5] px-4 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ffede2] text-primary">
                <ShieldCheckIcon
                  size={21}
                  weight="duotone"
                />
              </div>

              <div>
                <p className="text-sm font-bold text-[#291a14]">
                  Conta BOMbocado
                </p>

                <p className="mt-0.5 text-xs leading-5 text-[#8a7770]">
                  Suas informações são utilizadas para identificar
                  sua conta na plataforma.
                </p>
              </div>
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
    <article className="group rounded-2xl border border-[#f0e4df] bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#ffb89a] hover:shadow-sm">

      <div className="flex items-start gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ffede2] text-primary">
          {icon}
        </div>

        <div className="min-w-0">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#9b8177]">
            {label}
          </span>

          <p className="mt-1 break-words text-sm font-bold leading-6 text-[#291a14] sm:text-[15px]">
            {value}
          </p>
        </div>

      </div>

    </article>
  )
}

export default Perfil
