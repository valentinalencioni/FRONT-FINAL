import { Route, Routes } from "react-router-dom"
import Inicio from "../pages/Inicio"
import Articulo from "../pages/Articulo"
import Venta from "../pages/Venta"
import Demanda from "../pages/Demanda"
import ProveedorArticulo from "../pages/ProveedorArticulo"
import OrdenDeCompra from "../pages/OrdenDeCompra"
import Prediccion from "../pages/Prediccion"
import ArticulosAReponer from "../pages/Articulosareponer"
import ArticulosFaltantes from "../pages/Articulosfaltantes"
import DetallesOC from "../pages/DetallesOC"

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/articulo" element={<Articulo />} />
            <Route path="/venta" element={<Venta />} />
            <Route path="/demanda" element={<Demanda />} />
            <Route path="/prediccion" element={<Prediccion />} />
            <Route path="/proveedor-articulo" element={<ProveedorArticulo />} />
            <Route path="/orden-de-compra" element={<OrdenDeCompra />} />
            <Route path="/articulos-a-reponer" element={<ArticulosAReponer />} />
            <Route path="/articulos-faltantes" element={<ArticulosFaltantes />} />
            <Route path="/detallesOC" element={<DetallesOC />} />
        </Routes>
    )
}
export default AppRoutes