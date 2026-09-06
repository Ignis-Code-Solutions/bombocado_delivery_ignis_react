import {
  LeafIcon,
  ListIcon,
  PackageIcon,
  PlusIcon,
  SignOutIcon,
  UserIcon,
  XIcon,
} from '@phosphor-icons/react'

import { useState } from 'react'
import {
  Link,
  NavLink,
  useNavigate,
} from 'react-router-dom'

import { useAuth } from '../../contexts/AuthContext'

function Navbar() {
  const navigate = useNavigate()
  const { usuario, logout } = useAuth()
  const isAdmin = usuario?.tipo?.toUpperCase() === 'ADMIN'

  const [menuAberto, setMenuAberto] = useState(false)

  function sair() {
    logout()

    navigate('/login', {
      replace: true,
    })
  }

  function fecharMenu() {
    setMenuAberto(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#f0e4df] bg-white">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/produtos"
          onClick={fecharMenu}
          className="flex shrink-0 items-center gap-2"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft">
            <LeafIcon
              size={17}
              weight="fill"
              className="text-primary"
            />
          </div>

          <span className="font-headline text-xl font-extrabold tracking-tight text-[#291a14]">
            BOM
            <span className="text-primary">
              bocado
            </span>
          </span>
        </Link>

        {/* Navegação Desktop */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">

          <NavLink
            to="/produtos"
            end
            className={({ isActive }) =>
              `flex items-center gap-1.5 text-[13px] font-semibold transition ${
                isActive
                  ? 'text-primary'
                  : 'text-[#5f514b] hover:text-primary'
              }`
            }
          >
            <PackageIcon
              size={15}
              weight="bold"
            />

            Produtos
          </NavLink>

          <NavLink
            to="/produtos/saudaveis"
            className={({ isActive }) =>
              `flex items-center gap-1.5 text-[13px] font-semibold transition ${
                isActive
                  ? 'text-primary'
                  : 'text-[#5f514b] hover:text-primary'
              }`
            }
          >
            <LeafIcon
              size={15}
              weight="bold"
            />

            Saudáveis
          </NavLink>

        </nav>

        {/* Área direita Desktop */}
        <div className="hidden items-center gap-2 lg:flex">

          {/* Usuário */}
          <div className="mr-1 flex items-center gap-2">

            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary-soft text-primary">
              {usuario?.imagem ? (
                <img
                  src={usuario.imagem}
                  alt={usuario.nome}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserIcon
                  size={16}
                  weight="bold"
                />
              )}
            </div>

            <div className="hidden xl:block">
              <p className="max-w-24 truncate text-xs font-bold text-[#291a14]">
                {usuario?.nome || 'Usuário'}
              </p>
            </div>

          </div>

          {/* Sair */}
          <button
            type="button"
            onClick={sair}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-[#eadbd5] bg-white px-3 text-xs font-semibold text-[#5f514b] transition hover:border-primary hover:text-primary"
          >
            <SignOutIcon
              size={15}
              weight="bold"
            />

            Sair
          </button>

          {/* CTA */}
          {isAdmin && (
            <Link
              to="/produtos/cadastrar"
              className="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-bold text-white shadow-sm transition hover:brightness-95"
            >
              <PlusIcon
                size={15}
                weight="bold"
              />

              Cadastrar
            </Link>
          )}

        </div>

        {/* Botão Mobile */}
        <button
          type="button"
          onClick={() =>
            setMenuAberto((menu) => !menu)
          }
          aria-label={
            menuAberto
              ? 'Fechar menu'
              : 'Abrir menu'
          }
          aria-expanded={menuAberto}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#eadbd5] text-[#291a14] lg:hidden"
        >
          {menuAberto ? (
            <XIcon
              size={21}
              weight="bold"
            />
          ) : (
            <ListIcon
              size={21}
              weight="bold"
            />
          )}
        </button>

      </div>

      {/* Menu Mobile */}
      {menuAberto && (
        <div className="border-t border-[#f0e4df] bg-white lg:hidden">

          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">

            {/* Usuário */}
            <div className="mb-3 flex items-center gap-3 rounded-xl bg-[#fff8f5] p-3">

              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary-soft text-primary">
                {usuario?.imagem ? (
                  <img
                    src={usuario.imagem}
                    alt={usuario.nome}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserIcon
                    size={19}
                    weight="bold"
                  />
                )}
              </div>

              <div>
                <p className="text-sm font-bold text-[#291a14]">
                  {usuario?.nome || 'Usuário'}
                </p>

                {usuario?.tipo && (
                  <p className="text-xs text-[#8a7770]">
                    {usuario.tipo}
                  </p>
                )}
              </div>

            </div>

            <nav className="flex flex-col gap-1">

              <NavLink
                to="/produtos"
                end
                onClick={fecharMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-primary-soft text-primary'
                      : 'text-[#5f514b] hover:bg-[#fff8f5]'
                  }`
                }
              >
                <PackageIcon
                  size={19}
                  weight="bold"
                />

                Produtos
              </NavLink>

              <NavLink
                to="/produtos/saudaveis"
                onClick={fecharMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-primary-soft text-primary'
                      : 'text-[#5f514b] hover:bg-[#fff8f5]'
                  }`
                }
              >
                <LeafIcon
                  size={19}
                  weight="bold"
                />

                Opções saudáveis
              </NavLink>

              {isAdmin && (
                <Link
                  to="/produtos/cadastrar"
                  className="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-bold text-white shadow-sm transition hover:brightness-95"
                >
                  <PlusIcon
                    size={15}
                    weight="bold"
                  />

                  Cadastrar
                </Link>
              )}

              <button
                type="button"
                onClick={sair}
                className="mt-1 flex items-center justify-center gap-2 rounded-lg border border-[#eadbd5] px-4 py-3 text-sm font-semibold text-[#5f514b]"
              >
                <SignOutIcon
                  size={18}
                  weight="bold"
                />

                Sair
              </button>

            </nav>

          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar