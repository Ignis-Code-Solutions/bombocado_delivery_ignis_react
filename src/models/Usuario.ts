import type Produto from './Produto'

export default interface Usuario {
  id: number
  nome: string
  usuario: string
  senha: string
  imagem: string | null
  telefone: string
  endereco: string
  tipo: string | null
  produto?: Produto[] | null
}