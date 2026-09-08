import { useCallback, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Intro from './components/intro/Intro'
import Layout from './components/layout/Layout'
import Cart from './components/carrinho/cart/Cart'
import Cadastro from './pages/cadastro/Cadastro'
import Login from './pages/login/Login'
import DeletarProduto from './pages/produtos/DeletarProduto'
import FormProduto from './pages/produtos/FormProduto'
import ProdutoDetalhe from './pages/produtos/ProdutoDetalhe'
import Produtos from './pages/produtos/Produtos'
import ProdutosSaudaveis from './pages/produtos/ProdutosSaudaveis'
import SobreNos from './pages/sobrenos/SobreNos'
import ProtectedRoute from './routes/ProtectedRoute'
import AdminRoute from './routes/AdminRoute'
import Home from './pages/home/Home'

const INTRO_KEY = '@BOMbocado:intro'

function App() {
  const [mostrarIntro, setMostrarIntro] = useState(() => {
    return sessionStorage.getItem(INTRO_KEY) !== 'true'
  })

  const finalizarIntro = useCallback(() => {
    sessionStorage.setItem(INTRO_KEY, 'true')
    setMostrarIntro(false)
  }, [])

  if (mostrarIntro) {
    return <Intro onComplete={finalizarIntro} />
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/sobre-nos" element={<SobreNos />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/produtos/saudaveis" element={<ProdutosSaudaveis />} />
          <Route path="/produtos/:id" element={<ProdutoDetalhe />} />
          <Route path="/carrinho" element={<Cart />} />

          <Route element={<AdminRoute />}>
            <Route path="/produtos/cadastrar" element={<FormProduto />} />
            <Route path="/produtos/editar/:id" element={<FormProduto />} />
            <Route path="/produtos/deletar/:id" element={<DeletarProduto />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App