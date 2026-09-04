import {
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  HouseIcon,
  ImageIcon,
  LockKeyIcon,
  PhoneIcon,
  UserIcon,
  UserPlusIcon,
} from '@phosphor-icons/react'
import axios from 'axios'
import {
  type ChangeEvent,
  type FormEvent,
  useState,
} from 'react'
import {
  Link,
  useNavigate,
} from 'react-router-dom'

import type Usuario from '../../models/Usuario'
import { cadastrarUsuario } from '../../services/Service'

interface FormCadastro {
  nome: string
  usuario: string
  senha: string
  confirmarSenha: string
  telefone: string
  endereco: string
  imagem: string
  tipo: string
}

const estadoInicial: FormCadastro = {
  nome: '',
  usuario: '',
  senha: '',
  confirmarSenha: '',
  telefone: '',
  endereco: '',
  imagem: '',
  tipo: 'CLIENTE',
}

function Cadastro() {
  const navigate = useNavigate()

  const [formCadastro, setFormCadastro] =
    useState<FormCadastro>(estadoInicial)

  const [mostrarSenha, setMostrarSenha] =
    useState(false)

  const [mostrarConfirmacao, setMostrarConfirmacao] =
    useState(false)

  const [carregando, setCarregando] =
    useState(false)

  const [erro, setErro] =
    useState('')

  function atualizarEstado(
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = event.target

    setFormCadastro({
      ...formCadastro,
      [name]: value,
    })

    if (erro) {
      setErro('')
    }
  }

  function validarFormulario(): string | null {
    if (!formCadastro.nome.trim()) {
      return 'Informe o seu nome.'
    }

    if (!formCadastro.usuario.trim()) {
      return 'Informe o seu e-mail.'
    }

    if (!formCadastro.usuario.includes('@')) {
      return 'Informe um e-mail válido.'
    }

    if (!formCadastro.telefone.trim()) {
      return 'Informe o seu telefone.'
    }

    if (
      formCadastro.telefone.trim().length > 15
    ) {
      return 'O telefone deve possuir no máximo 15 caracteres.'
    }

    if (!formCadastro.endereco.trim()) {
      return 'Informe o seu endereço.'
    }

    if (
      formCadastro.endereco.trim().length < 5
    ) {
      return 'O endereço deve possuir pelo menos 5 caracteres.'
    }

    if (!formCadastro.senha) {
      return 'Informe uma senha.'
    }

    if (formCadastro.senha.length < 8) {
      return 'A senha deve possuir pelo menos 8 caracteres.'
    }

    if (
      formCadastro.senha !==
      formCadastro.confirmarSenha
    ) {
      return 'As senhas não coincidem.'
    }

    return null
  }

  async function cadastrar(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const erroValidacao =
      validarFormulario()

    if (erroValidacao) {
      setErro(erroValidacao)
      return
    }

    const novoUsuario = {
      nome: formCadastro.nome.trim(),
      usuario:
        formCadastro.usuario.trim(),
      senha: formCadastro.senha,
      telefone:
        formCadastro.telefone.trim(),
      endereco:
        formCadastro.endereco.trim(),
      imagem:
        formCadastro.imagem.trim() || null,
      tipo: formCadastro.tipo,
    }

    try {
      setCarregando(true)
      setErro('')

      await cadastrarUsuario<Usuario>(
        '/usuarios/cadastrar',
        novoUsuario,
      )

      navigate('/login', {
        replace: true,
        state: {
          cadastroRealizado: true,
        },
      })
    } catch (error) {
      console.error(error)

      if (axios.isAxiosError(error)) {
        if (
          error.response?.status === 400
        ) {
          setErro(
            'Não foi possível realizar o cadastro. Verifique os dados ou tente outro e-mail.',
          )
          return
        }

        if (
          error.code ===
          'ECONNABORTED'
        ) {
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
        'Não foi possível realizar o cadastro. Tente novamente.',
      )
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="min-h-screen bg-surface lg:grid lg:grid-cols-[0.9fr_1.1fr]">
      <section className="relative hidden min-h-screen overflow-hidden bg-primary lg:flex lg:flex-col lg:justify-between lg:p-10 xl:p-14">
        <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-white/10" />

        <div className="absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-white/10" />

        <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-white/10" />

        <div className="relative z-10">
          <Link
            to="/login"
            className="flex w-fit items-center gap-2 text-sm font-semibold text-white/85 transition hover:text-white"
          >
            <ArrowLeftIcon
              size={20}
              weight="bold"
            />

            Voltar para Login
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <p className="font-headline text-sm font-bold uppercase tracking-[0.22em] text-white/80">
            BOMbocado
          </p>

          <h2 className="mt-5 text-4xl font-extrabold leading-tight text-white xl:text-5xl">
            Faça parte de uma escolha mais consciente.
          </h2>

          <p className="mt-5 text-base leading-7 text-white/85 xl:text-lg">
            Crie sua conta para acessar produtos,
            oportunidades e funcionalidades da
            plataforma BOMbocado.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-card border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-sm font-bold text-white">
                Acesso simples
              </p>

              <p className="mt-2 text-sm leading-6 text-white/75">
                Cadastre seus dados e comece a usar
                a plataforma rapidamente.
              </p>
            </div>

            <div className="rounded-card border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-sm font-bold text-white">
                Experiência responsiva
              </p>

              <p className="mt-2 text-sm leading-6 text-white/75">
                Use o BOMbocado no celular, tablet
                ou computador.
              </p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/65">
          Delivery de alimentos • BOMbocado
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-10 xl:px-16">
        <div className="w-full max-w-2xl">
          <div className="mb-7">
            <div className="flex items-center justify-between gap-4">
              <Link
                to="/login"
                className="font-headline text-2xl font-extrabold text-primary-dark sm:text-3xl"
              >
                BOM
                <span className="text-primary">
                  bocado
                </span>
              </Link>

              <Link
                to="/login"
                className="flex items-center gap-1.5 text-sm font-semibold text-primary transition hover:text-primary-dark lg:hidden"
              >
                <ArrowLeftIcon
                  size={18}
                  weight="bold"
                />

                Login
              </Link>
            </div>

            <h1 className="mt-7 text-3xl font-extrabold leading-tight sm:text-4xl">
              Crie sua conta
            </h1>

            <p className="mt-3 text-sm leading-6 text-ink-soft sm:text-base">
              Preencha seus dados para começar a
              utilizar o BOMbocado.
            </p>
          </div>

          <form
            onSubmit={cadastrar}
            className="rounded-card bg-white p-5 shadow-card sm:p-7"
          >
            {erro && (
              <div
                role="alert"
                className="mb-6 rounded-button bg-error-soft px-4 py-3 text-sm font-medium leading-5 text-error"
              >
                {erro}
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="nome"
                  className="mb-2 block text-sm font-semibold text-ink"
                >
                  Nome completo
                </label>

                <div className="relative">
                  <UserIcon
                    size={20}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
                  />

                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    value={formCadastro.nome}
                    onChange={atualizarEstado}
                    placeholder="Digite seu nome completo"
                    autoComplete="name"
                    disabled={carregando}
                    className="h-12 w-full rounded-button border border-outline bg-surface pl-12 pr-4 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="usuario"
                  className="mb-2 block text-sm font-semibold text-ink"
                >
                  E-mail
                </label>

                <div className="relative">
                  <UserIcon
                    size={20}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
                  />

                  <input
                    id="usuario"
                    name="usuario"
                    type="email"
                    value={formCadastro.usuario}
                    onChange={atualizarEstado}
                    placeholder="seuemail@email.com"
                    autoComplete="email"
                    disabled={carregando}
                    className="h-12 w-full rounded-button border border-outline bg-surface pl-12 pr-4 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="telefone"
                  className="mb-2 block text-sm font-semibold text-ink"
                >
                  Telefone
                </label>

                <div className="relative">
                  <PhoneIcon
                    size={20}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
                  />

                  <input
                    id="telefone"
                    name="telefone"
                    type="tel"
                    value={
                      formCadastro.telefone
                    }
                    onChange={atualizarEstado}
                    placeholder="11999999999"
                    autoComplete="tel"
                    maxLength={15}
                    disabled={carregando}
                    className="h-12 w-full rounded-button border border-outline bg-surface pl-12 pr-4 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="tipo"
                  className="mb-2 block text-sm font-semibold text-ink"
                >
                  Tipo de conta
                </label>

                <select
                  id="tipo"
                  name="tipo"
                  value={formCadastro.tipo}
                  onChange={atualizarEstado}
                  disabled={carregando}
                  className="h-12 w-full rounded-button border border-outline bg-surface px-4 text-sm text-ink outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="CLIENTE">
                    Cliente
                  </option>

                  <option value="EMPRESA">
                    Empresa
                  </option>

                  <option value="ENTREGADOR">
                    Entregador
                  </option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="endereco"
                  className="mb-2 block text-sm font-semibold text-ink"
                >
                  Endereço
                </label>

                <div className="relative">
                  <HouseIcon
                    size={20}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
                  />

                  <input
                    id="endereco"
                    name="endereco"
                    type="text"
                    value={
                      formCadastro.endereco
                    }
                    onChange={atualizarEstado}
                    placeholder="Rua, número, bairro..."
                    autoComplete="street-address"
                    disabled={carregando}
                    className="h-12 w-full rounded-button border border-outline bg-surface pl-12 pr-4 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="imagem"
                  className="mb-2 block text-sm font-semibold text-ink"
                >
                  URL da foto
                  <span className="ml-1 font-normal text-ink-muted">
                    (opcional)
                  </span>
                </label>

                <div className="relative">
                  <ImageIcon
                    size={20}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
                  />

                  <input
                    id="imagem"
                    name="imagem"
                    type="url"
                    value={formCadastro.imagem}
                    onChange={atualizarEstado}
                    placeholder="https://..."
                    disabled={carregando}
                    className="h-12 w-full rounded-button border border-outline bg-surface pl-12 pr-4 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="senha"
                  className="mb-2 block text-sm font-semibold text-ink"
                >
                  Senha
                </label>

                <div className="relative">
                  <LockKeyIcon
                    size={20}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
                  />

                  <input
                    id="senha"
                    name="senha"
                    type={
                      mostrarSenha
                        ? 'text'
                        : 'password'
                    }
                    value={formCadastro.senha}
                    onChange={atualizarEstado}
                    placeholder="Mínimo 8 caracteres"
                    autoComplete="new-password"
                    disabled={carregando}
                    className="h-12 w-full rounded-button border border-outline bg-surface pl-12 pr-12 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setMostrarSenha(
                        !mostrarSenha,
                      )
                    }
                    disabled={carregando}
                    aria-label={
                      mostrarSenha
                        ? 'Ocultar senha'
                        : 'Mostrar senha'
                    }
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted transition hover:bg-primary-soft hover:text-primary disabled:cursor-not-allowed"
                  >
                    {mostrarSenha ? (
                      <EyeSlashIcon
                        size={20}
                      />
                    ) : (
                      <EyeIcon
                        size={20}
                      />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmarSenha"
                  className="mb-2 block text-sm font-semibold text-ink"
                >
                  Confirmar senha
                </label>

                <div className="relative">
                  <LockKeyIcon
                    size={20}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
                  />

                  <input
                    id="confirmarSenha"
                    name="confirmarSenha"
                    type={
                      mostrarConfirmacao
                        ? 'text'
                        : 'password'
                    }
                    value={
                      formCadastro.confirmarSenha
                    }
                    onChange={atualizarEstado}
                    placeholder="Repita sua senha"
                    autoComplete="new-password"
                    disabled={carregando}
                    className="h-12 w-full rounded-button border border-outline bg-surface pl-12 pr-12 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setMostrarConfirmacao(
                        !mostrarConfirmacao,
                      )
                    }
                    disabled={carregando}
                    aria-label={
                      mostrarConfirmacao
                        ? 'Ocultar confirmação'
                        : 'Mostrar confirmação'
                    }
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted transition hover:bg-primary-soft hover:text-primary disabled:cursor-not-allowed"
                  >
                    {mostrarConfirmacao ? (
                      <EyeSlashIcon
                        size={20}
                      />
                    ) : (
                      <EyeIcon
                        size={20}
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-button bg-primary px-4 font-headline font-bold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando ? (
                'Criando conta...'
              ) : (
                <>
                  <UserPlusIcon
                    size={21}
                    weight="bold"
                  />

                  Criar minha conta
                </>
              )}
            </button>

            <div className="my-6 h-px bg-outline/40" />

            <p className="text-center text-sm text-ink-soft">
              Já possui uma conta?{' '}
              <Link
                to="/login"
                className="font-bold text-primary transition hover:text-primary-dark"
              >
                Entrar
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  )
}

export default Cadastro