import { Navigate, Route, Routes } from 'react-router-dom'
import Cadastro from './pages/cadastro/Cadastro'
import Login from './pages/login/Login'
import Produtos from './pages/produtos/Produtos'
import ProdutoDetalheTemporario from './pages/produtos/ProdutoDetalheTemporario'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/produtos" element={<Produtos />} />
      <Route path="/produtos/:id" element={<ProdutoDetalheTemporario />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App