import { useCallback, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import Intro from './components/intro/Intro'
import Layout from './components/layout/Layout'

import Cadastro from './pages/cadastro/Cadastro'
import Login from './pages/login/Login'
import Home from './pages/home/Home'
import Perfil from './pages/perfil/Perfil'
import ProdutoDetalhe from './pages/produtos/ProdutoDetalhe'
import Produtos from './pages/produtos/Produtos'
import ProdutosSaudaveis from './pages/produtos/ProdutosSaudaveis'
import SobreNos from './pages/sobrenos/SobreNos'

import ProtectedRoute from './routes/ProtectedRoute'
import AdminRoute from './routes/AdminRoute'

import CategoriasAdmin from './admin/categorias/categoriasadmin/CategoriasAdmin'
import Clientes from './admin/clientes/Clientes'
import HomeAdmin from './admin/Home/HomeAdmin'
import ProdutosAdmin from './admin/produtos/produtosadmin/ProdutosAdmin'

import NavbarAdmin from './components/navbar/NavbarAdmin'
import Cart from './components/carrinho/cart/Cart'

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
      {/* Rotas públicas */}
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/cadastro"
        element={<Cadastro />}
      />

      {/* Rotas da aplicação */}
      <Route element={<ProtectedRoute />} />

      <Route element={<Layout />}>
        <Route
          path="/home"
          element={<Home />}
        />

        <Route
          path="/sobre-nos"
          element={<SobreNos />}
        />

        <Route
          path="/perfil"
          element={<Perfil />}
        />

        <Route
          path="/produtos"
          element={<Produtos />}
        />

        <Route
          path="/produtos/saudaveis"
          element={<ProdutosSaudaveis />}
        />

        <Route
          path="/produtos/:id"
          element={<ProdutoDetalhe />}
        />

        <Route
          path="/carrinho"
          element={<Cart />}
        />
      </Route>

      {/* Área do administrador */}
      <Route element={<AdminRoute />}>
        <Route
          path="/admin"
          element={
            <div className="flex min-h-screen">
              <NavbarAdmin />

              <main className="ml-60 flex-1">
                <HomeAdmin />
              </main>
            </div>
          }
        />

        <Route
          path="/admin/produtos"
          element={
            <div className="flex min-h-screen">
              <NavbarAdmin />

              <main className="ml-60 flex-1">
                <ProdutosAdmin />
              </main>
            </div>
          }
        />

        <Route
          path="/admin/categorias"
          element={
            <div className="flex min-h-screen">
              <NavbarAdmin />

              <main className="ml-60 flex-1">
                <CategoriasAdmin />
              </main>
            </div>
          }
        />

        <Route
          path="/admin/clientes"
          element={
            <div className="flex min-h-screen">
              <NavbarAdmin />

              <main className="ml-60 flex-1">
                <Clientes />
              </main>
            </div>
          }
        />
      </Route>

      {/* Rota não encontrada */}
      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  )
}

export default App
