import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 60000,
})

function comToken(token: string) {
  return { headers: { Authorization: token } }
}

export async function cadastrarUsuario<T>(url: string, dados: object): Promise<T> {
  const resposta = await api.post<T>(url, dados)
  return resposta.data
}

export async function login<T>(url: string, dados: object): Promise<T> {
  const resposta = await api.post<T>(url, dados)
  return resposta.data
}

export async function buscar<T>(url: string, token: string): Promise<T> {
  const resposta = await api.get<T>(url, comToken(token))
  return resposta.data
}

export async function cadastrar<T>(url: string, dados: object, token: string): Promise<T> {
  const resposta = await api.post<T>(url, dados, comToken(token))
  return resposta.data
}

export async function atualizar<T>(url: string, dados: object, token: string): Promise<T> {
  const resposta = await api.put<T>(url, dados, comToken(token))
  return resposta.data
}

export async function deletar(url: string, token: string): Promise<void> {
  await api.delete(url, comToken(token))
}