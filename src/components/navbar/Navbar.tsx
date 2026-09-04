import { LeafIcon, ListIcon, PackageIcon, PlusIcon, SignOutIcon, UserIcon, XIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

function Navbar() {
  const navigate = useNavigate()

  const {
    usuario,
    logout,
  } = useAuth()

  const [menuAberto, setMenuAberto] =
    useState(false)

  function sair() {
    logout()

    navigate('/login', {
      replace: true,
    })
  }

  return (
    <header className="sticky top-0 z-50 border-b border-outline/40 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/produtos"
          className="shrink-0 font-headline text-2xl font-extrabold text-primary-dark sm:text-3xl"
        >
          BOM
          <span className="text-primary">
            bocado
          </span>
        </Link>

        {/* Navegação Desktop */}
        <nav className="hidden items-center gap-1 lg:flex">
        <NavLink
            to="/produtos"
            end
            onClick={() => setMenuAberto(false)}
            className={({ isActive }) =>
                `flex items-center gap-3 rounded-button px-4 py-3 text-sm font-semibold ${
                isActive
                    ? 'bg-primary-soft text-primary'
                    : 'text-ink-soft hover:bg-surface'
                }`
            }
            >
            <PackageIcon size={20} />
            Produtos
        </NavLink>

          <NavLink
            to="/produtos/saudaveis"
            className={({
              isActive,
            }) =>
              `flex h-10 items-center gap-2 rounded-button px-4 text-sm font-semibold transition ${
                isActive
                  ? 'bg-primary-soft text-primary'
                  : 'text-ink-soft hover:bg-surface hover:text-primary'
              }`
            }
          >
            <LeafIcon
              size={18}
              weight="bold"
            />

            Opções saudáveis
          </NavLink>

          <NavLink
            to="/produtos/cadastrar"
            className={({
              isActive,
            }) =>
              `flex h-10 items-center gap-2 rounded-button px-4 text-sm font-semibold transition ${
                isActive
                  ? 'bg-primary-soft text-primary'
                  : 'text-ink-soft hover:bg-surface hover:text-primary'
              }`
            }
          >
            <PlusIcon
              size={18}
              weight="bold"
            />

            Cadastrar produto
          </NavLink>
        </nav>

        {/* Usuário Desktop */}
        <div className="hidden items-center gap-3 lg:flex">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary-soft text-primary">
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

            <div className="max-w-32">
              <p className="truncate text-sm font-bold text-ink">
                {usuario?.nome ||
                  'Usuário'}
              </p>

              {usuario?.tipo && (
                <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
                  {usuario.tipo}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={sair}
            title="Sair"
            className="flex h-10 w-10 items-center justify-center rounded-button border border-outline text-ink-muted transition hover:border-primary hover:bg-primary-soft hover:text-primary"
          >
            <SignOutIcon
              size={19}
              weight="bold"
            />
          </button>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() =>
              setMenuAberto(
                !menuAberto,
              )
            }
            aria-label={
              menuAberto
                ? 'Fechar menu'
                : 'Abrir menu'
            }
            aria-expanded={menuAberto}
            className="flex h-10 w-10 items-center justify-center rounded-button border border-outline text-ink transition hover:border-primary hover:text-primary"
          >
            {menuAberto ? (
              <XIcon
                size={22}
                weight="bold"
              />
            ) : (
              <ListIcon
                size={22}
                weight="bold"
              />
            )}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {menuAberto && (
        <div className="border-t border-outline/40 bg-white lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="mb-4 flex items-center gap-3 rounded-button bg-surface p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-soft text-primary">
                {usuario?.imagem ? (
                  <img
                    src={usuario.imagem}
                    alt={usuario.nome}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserIcon
                    size={20}
                    weight="bold"
                  />
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold">
                  {usuario?.nome ||
                    'Usuário'}
                </p>

                {usuario?.tipo && (
                  <p className="text-xs text-ink-muted">
                    {usuario.tipo}
                  </p>
                )}
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              <NavLink
                to="/produtos"
                end
                className={({
                  isActive,
                }) =>
                  `flex items-center gap-3 rounded-button px-4 py-3 text-sm font-semibold ${
                    isActive
                      ? 'bg-primary-soft text-primary'
                      : 'text-ink-soft hover:bg-surface'
                  }`
                }
              >
                <PackageIcon
                  size={20}
                />

                Produtos
              </NavLink>

              <NavLink
                to="/produtos/saudaveis"
                className={({
                  isActive,
                }) =>
                  `flex items-center gap-3 rounded-button px-4 py-3 text-sm font-semibold ${
                    isActive
                      ? 'bg-primary-soft text-primary'
                      : 'text-ink-soft hover:bg-surface'
                  }`
                }
              >
                <LeafIcon
                  size={20}
                />

                Opções saudáveis
              </NavLink>

              <NavLink
                to="/produtos/cadastrar"
                className={({
                  isActive,
                }) =>
                  `flex items-center gap-3 rounded-button px-4 py-3 text-sm font-semibold ${
                    isActive
                      ? 'bg-primary-soft text-primary'
                      : 'text-ink-soft hover:bg-surface'
                  }`
                }
              >
                <PlusIcon
                  size={20}
                />

                Cadastrar produto
              </NavLink>

              <div className="my-2 h-px bg-outline/40" />

              <button
                type="button"
                onClick={sair}
                className="flex items-center gap-3 rounded-button px-4 py-3 text-left text-sm font-semibold text-error transition hover:bg-error-soft"
              >
                <SignOutIcon
                  size={20}
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