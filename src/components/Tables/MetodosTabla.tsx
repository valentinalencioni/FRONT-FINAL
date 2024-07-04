import { useEffect, useState } from "react";
import { Articulo } from "../../types/Articulo";
import { ArticuloService } from "../../services/ArticuloService";
import { useNavigate } from "react-router-dom";

function MetodosTabla (){
    const [articulos, setArticulos] = useState<Articulo[]>([]);
    const [refreshData, setRefreshData] = useState(false);

    useEffect(() => {
        const fetchArticulos = async () => {
            try {
                const articulos = await ArticuloService.getArticulos();
                setArticulos(Array.isArray(articulos) ? articulos : []);
            } catch (error) {
                console.error("Error fetching articulos:", error)
            }
        }
        fetchArticulos();
    }, [refreshData]);
    console.log(JSON.stringify(articulos, null, 2));
    const navigate = useNavigate();


    return (
        <>
            <div className="overflow-x-auto">
            <button
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mb-4 flex items-center"
                    onClick={() => navigate('/prediccion')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-return-left mr-2" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5" />
                    </svg>
                    Volver a Predicciones
                </button>
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b bg-dark-subtle">ID</th>
                            <th className="py-2 px-4 border-b bg-dark-subtle">Nombre</th>
                            <th className="py-2 px-4 border-b bg-dark-subtle">Metodo Predeterminado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articulos.map(articulo => (
                            <tr>
                                <td className="py-2 px-4 border-b">{articulo.id}</td>
                                <td className="py-2 px-4 border-b">{articulo.nombre}</td>
                                <td className="py-2 px-4 border-b">{articulo.metodoPred}</td>
                            </tr>

                        ))}
                    </tbody>
                </table>
            </div>

        </>
    )
    

    
};

export default MetodosTabla