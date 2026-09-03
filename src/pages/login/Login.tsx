import { EyeIcon, EyeSlashIcon, LockKeyIcon, SignInIcon, UserIcon } from '@phosphor-icons/react'
import axios from 'axios'
import { type ChangeEvent, type FormEvent, useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'

interface FormLogin {
  usuario: string
  senha: string
}

function Login() {
  const navigate = useNavigate()

  const location = useLocation()

    const cadastroRealizado = Boolean(
  (
    location.state as
      | { cadastroRealizado?: boolean }
      | null
  )?.cadastroRealizado,
    )

  const authContext = useContext(AuthContext)

  if (!authContext) {
    throw new Error(
      'Login deve ser utilizado dentro de um AuthProvider.',
    )
  }

  const { login } = authContext

  const [formLogin, setFormLogin] = useState<FormLogin>({
    usuario: '',
    senha: '',
  })

  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  function atualizarEstado(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setFormLogin({
      ...formLogin,
      [event.target.name]: event.target.value,
    })

    if (erro) {
      setErro('')
    }
  }

  async function entrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!formLogin.usuario.trim()) {
      setErro('Informe o seu e-mail.')
      return
    }

    if (!formLogin.senha.trim()) {
      setErro('Informe a sua senha.')
      return
    }

    try {
      setCarregando(true)
      setErro('')

      await login(formLogin)

      navigate('/produtos')
    } catch (error) {
      console.error(error)

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setErro('E-mail ou senha inválidos.')
          return
        }

        if (error.code === 'ECONNABORTED') {
          setErro(
            'O servidor demorou para responder. Tente novamente.',
          )
          return
        }

        if (!error.response) {
          setErro(
            'Não foi possível conectar ao servidor. Tente novamente em instantes.',
          )
          return
        }
      }

      setErro(
        'Não foi possível realizar o login. Tente novamente.',
      )
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="min-h-screen bg-surface lg:grid lg:grid-cols-2">
      <section className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <Link
              to="/"
              className="inline-block font-headline text-3xl font-extrabold text-primary-dark"
            >
              BOM
              <span className="text-primary">
                bocado
              </span>
            </Link>

            <h1 className="mt-8 text-3xl font-extrabold sm:text-4xl">
              Bem-vindo de volta
            </h1>

            <p className="mt-3 text-sm leading-6 text-ink-soft sm:text-base">
              Entre na sua conta para continuar explorando
              produtos e ofertas do BOMbocado.
            </p>
          </div>

          <form
            onSubmit={entrar}
            className="rounded-card bg-white p-6 shadow-card sm:p-8"
            >
            {cadastroRealizado && (
                <div
                role="status"
                className="mb-5 rounded-button bg-success-soft px-4 py-3 text-sm font-medium text-success"
                >
                Conta criada com sucesso! Agora faça seu login.
                </div>
            )}

            <div>
                <label
                htmlFor="usuario"
                className="mb-2 block text-sm font-semibold text-ink"
                >
                E-mail
            </label>

              <div className="relative">
                <UserIcon
                  size={20}
                  weight="bold"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
                />

                <input
                  id="usuario"
                  name="usuario"
                  type="email"
                  value={formLogin.usuario}
                  onChange={atualizarEstado}
                  placeholder="seuemail@email.com"
                  autoComplete="email"
                  disabled={carregando}
                  className="h-12 w-full rounded-button border border-outline bg-white pl-12 pr-4 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            <div className="mt-5">
              <label
                htmlFor="senha"
                className="mb-2 block text-sm font-semibold text-ink"
              >
                Senha
              </label>

              <div className="relative">
                <LockKeyIcon
                  size={20}
                  weight="bold"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
                />

                <input
                  id="senha"
                  name="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  value={formLogin.senha}
                  onChange={atualizarEstado}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  disabled={carregando}
                  className="h-12 w-full rounded-button border border-outline bg-white pl-12 pr-12 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setMostrarSenha(!mostrarSenha)
                  }
                  disabled={carregando}
                  aria-label={
                    mostrarSenha
                      ? 'Ocultar senha'
                      : 'Mostrar senha'
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted transition hover:text-primary disabled:cursor-not-allowed"
                >
                  {mostrarSenha ? (
                    <EyeSlashIcon size={21} />
                  ) : (
                    <EyeIcon size={21} />
                  )}
                </button>
              </div>
            </div>

            {erro && (
              <div
                role="alert"
                className="mt-5 rounded-button bg-error-soft px-4 py-3 text-sm font-medium text-error"
              >
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-button bg-primary px-4 font-headline font-bold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando ? (
                'Entrando...'
              ) : (
                <>
                  <SignInIcon
                    size={21}
                    weight="bold"
                  />

                  Entrar
                </>
              )}
            </button>

            <p className="mt-6 text-center text-sm text-ink-soft">
              Ainda não possui uma conta?{' '}
              <Link
                to="/cadastro"
                className="font-bold text-primary transition hover:text-primary-dark"
              >
                Cadastre-se
              </Link>
            </p>
          </form>
        </div>
      </section>

      <section className="relative hidden overflow-hidden bg-primary lg:flex lg:min-h-screen lg:items-center lg:justify-center">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-white/10" />

        <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-white/10" />

        <div className="relative z-10 max-w-lg px-12 text-white">
          <p className="font-headline text-sm font-bold uppercase tracking-[0.2em] text-white/80">
            BOMbocado
          </p>

          <h2 className="mt-5 text-4xl font-extrabold leading-tight text-white xl:text-5xl">
            Bom para quem vende.
            <br />
            Bom para quem compra.
          </h2>

          <p className="mt-6 text-lg leading-8 text-white/85">
            Uma plataforma que conecta alimentos,
            oportunidades e pessoas em um só lugar.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="rounded-card bg-white/10 p-5 backdrop-blur-sm">
              <strong className="font-headline text-2xl">
                +
              </strong>

              <p className="mt-2 text-sm text-white/85">
                Acesso a produtos e ofertas.
              </p>
            </div>

            <div className="rounded-card bg-white/10 p-5 backdrop-blur-sm">
              <strong className="font-headline text-2xl">
                ♡
              </strong>

              <p className="mt-2 text-sm text-white/85">
                Escolhas acessíveis e conscientes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Login