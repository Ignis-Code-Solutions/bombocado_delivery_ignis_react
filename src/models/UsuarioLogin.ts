export default interface UsuarioLogin {
  id: number
  nome: string
  usuario: string
  senha: string
  imagem: string | null
  telefone: string
  endereco: string
  tipo: string | null
  token: string
}