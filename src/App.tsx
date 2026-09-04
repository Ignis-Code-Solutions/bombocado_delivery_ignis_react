import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import Cadastro from './pages/cadastro/Cadastro'
import Login from './pages/login/Login'
import DeletarProduto from './pages/produtos/DeletarProduto'
import FormProduto from './pages/produtos/FormProduto'
import ProdutoDetalhe from './pages/produtos/ProdutoDetalhe'
import Produtos from './pages/produtos/Produtos'
import ProdutosSaudaveis from './pages/produtos/ProdutosSaudaveis'
import ProtectedRoute from './routes/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/cadastro"
        element={<Cadastro />}
      />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/produtos"
          element={<Produtos />}
        />

        <Route
          path="/produtos/saudaveis"
          element={<ProdutosSaudaveis />}
        />

        <Route
          path="/produtos/cadastrar"
          element={<FormProduto />}
        />

        <Route
          path="/produtos/editar/:id"
          element={<FormProduto />}
        />

        <Route
          path="/produtos/deletar/:id"
          element={<DeletarProduto />}
        />

        <Route
          path="/produtos/:id"
          element={<ProdutoDetalhe />}
        />
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />
    </Routes>
  )
}

export default App