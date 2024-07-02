import { useEffect, useState } from "react";
import { MetodoPrediccion } from "../../enums/MetodoPrediccion";
import { ModalType } from "../../enums/ModalType";
import { ModeloInventario } from "../../enums/ModeloInventario";
import { ProveedorArticuloService } from "../../services/ProveedorArticuloService";
import { ProveedorArticulo } from "../../types/ProveedorArticulo";
import { useNavigate } from "react-router-dom";
import Articulo from "../../pages/Articulo";



function ProveedorArticuloTabla() {
    const [proveedoresArt,setProveedoresArt]= useState<ProveedorArticulo[]>([]);
    const [refreshData, setRefreshData]= useState(false);


  useEffect(()=>{
    const fetchProveedoresArticulos = async () => {
        try{
            const proveedoresArt = await ProveedorArticuloService.getProveedoresArt();
            setProveedoresArt(Array.isArray(proveedoresArt) ? proveedoresArt : []);

        }catch (error) {
            console.error("Error fetching proveedores articulos:", error);
        }
    };
    fetchProveedoresArticulos();

}, [refreshData]);

console.log(JSON.stringify(proveedoresArt, null, 2));

const initializableNewProveedorArticulo = (): ProveedorArticulo => ({
    id:0,
    tiempoDemora: 0,
    costoAlmacenamiento: 0,
    costoPedido: 0,
    precioArticuloProveedor: 0,
    articulo: {
            id: 0,
            nombre: "",
            precio: 0,
            costoAlmacenamiento: 0,
            costoPedido: 0,
            stockActual: 0,
            stockSeguridad: 0,
            cgi: 0,
            demandaAnual: 0,
            modeloInventario: ModeloInventario.INTERVALO_FIJO,
            loteOptimo: 0,
            puntoPedido: 0,
            cantidadMaxima: 0,
            cantidadAPedir: 0,
            tiempoRevision: 0,
            proveedorPred: {
                id: 0,
                nombreProveedor: "",
            },
            metodoPred: MetodoPrediccion.ESTACIONALIDAD,
    },
    proveedor: {
            id: 0 ,
            nombreProveedor: '',
    },
});

    const [proveedorArt, setProveedorArt] = useState<ProveedorArticulo>(initializableNewProveedorArticulo);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
    const [search, setSearch] = useState ("");

    const handleClick = (title: string, prova: ProveedorArticulo, modal: ModalType) => {
        setProveedorArt(prova);
        setTitle(title);
        setShowModal(true);
        setModalType(modal);
    };
    
    //Metodo de filtrado por nombre de articulo 
    const results = !search
    ? proveedoresArt
    : proveedoresArt.filter((dato) =>
        dato.articulo.nombre.toLowerCase().includes(search.toLowerCase())
    );

    const navigate = useNavigate();
    return (
        <>
            <div className="flex justify-start space-x-2 ">
                
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                onClick={() => handleClick("Nuevo Proveedor articulo", initializableNewProveedorArticulo(), ModalType.CREATE)}
            >
                Nuevo Proveedor articulo
            </button>
            <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
                onClick={() => navigate('/proveedores')}
            >
                Ver todos los proveedores
            </button>
            <div className="p-4">
            <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Buscar por nombre de Articulo" className="form-control"/>
            </div>

               
            </div>
            <div className="overflow-x-auto">
            <table className="table table-striped table-hover mt-2 shadow-sm">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b bg-dark-subtle">Articulo</th>
                            <th className="py-2 px-4 border-b bg-dark-subtle">Proveedor</th>
                            <th className="py-2 px-4 border-b bg-dark-subtle">Precio</th>
                            <th className="py-2 px-4 border-b bg-dark-subtle">Costo Almacenamiento</th>
                            <th className="py-2 px-4 border-b bg-dark-subtle">Costo Pedido</th>
                            <th className="py-2 px-4 border-b bg-dark-subtle">Tiempo Demora</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {results.map(proveedorArt => (
                            <tr>
                               
                                <td>{proveedorArt.articulo ? proveedorArt.articulo.nombre : 'Sin Articulo'}</td>
                                <td>{proveedorArt.proveedor ? proveedorArt.proveedor.nombreProveedor : 'Sin Proveedor'}</td>
                                <td className="py-2 px-4 border-b">{proveedorArt.precioArticuloProveedor}</td> 
                                <td className="py-2 px-4 border-b">{proveedorArt.costoAlmacenamiento}</td>
                                <td className="py-2 px-4 border-b">{proveedorArt.costoPedido}
                                </td> 
                                <td className="py-2 px-4 border-b">{proveedorArt.tiempoDemora}</td> 
                            </tr>
                        ))}
                    </tbody>
                    </table>
            </div>
        
        </>
      )
     } 

export default ProveedorArticuloTabla;



