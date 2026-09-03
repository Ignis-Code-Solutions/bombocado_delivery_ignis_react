import type Categoria from './Categoria'
import type Usuario from './Usuario'

export default interface Produto {
  id: number
  nome: string
  descricao: string
  preco: string
  imagem: string | null
  tempoEntrega: number | null
  nutriscore: string | null
  dataValidade: string
  categoria: Categoria | null
  usuario: Usuario | null
}