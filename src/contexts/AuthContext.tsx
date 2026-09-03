/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useMemo, useState,
type ReactNode } from 'react'
import type UsuarioLogin from '../models/UsuarioLogin'
import { login as loginService } from '../services/Service'

const STORAGE_KEY = '@BOMbocado:usuario'

interface LoginCredentials {
  usuario: string
  senha: string
}

export type UsuarioAutenticado = Omit<UsuarioLogin, 'senha'>

interface AuthContextData {
  usuario: UsuarioAutenticado | null
  token: string
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}

interface AuthProviderProps {
  children: ReactNode
}

function recuperarSessao(): UsuarioAutenticado | null {
  const sessaoSalva = localStorage.getItem(STORAGE_KEY)

  if (!sessaoSalva) {
    return null
  }

  try {
    const usuarioSalvo = JSON.parse(sessaoSalva) as UsuarioAutenticado

    if (!usuarioSalvo.token) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }

    return usuarioSalvo
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export const AuthContext = createContext<AuthContextData | undefined>(
  undefined,
)

export function AuthProvider({ children }: AuthProviderProps) {
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(
    recuperarSessao,
  )

  async function login({
    usuario: email,
    senha,
  }: LoginCredentials): Promise<void> {
    const resposta = await loginService<UsuarioLogin>('/usuarios/logar', {
      usuario: email,
      senha,
    })

    const sessao: UsuarioAutenticado = {
      id: resposta.id,
      nome: resposta.nome,
      usuario: resposta.usuario,
      imagem: resposta.imagem,
      telefone: resposta.telefone,
      endereco: resposta.endereco,
      tipo: resposta.tipo,
      token: resposta.token,
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessao))
    setUsuario(sessao)
  }

  function logout(): void {
    localStorage.removeItem(STORAGE_KEY)
    setUsuario(null)
  }

  const token = usuario?.token ?? ''
  const isAuthenticated = Boolean(token)

  const value = useMemo(
    () => ({
      usuario,
      token,
      isAuthenticated,
      login,
      logout,
    }),
    [usuario, token, isAuthenticated],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider.')
  }

  return context
}