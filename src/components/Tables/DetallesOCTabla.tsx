import { useNavigate } from "react-router-dom";

function DetallesOCTabla() {
    const navigate = useNavigate();
    return (
        <div style={{padding: "20px"}} className="overflow-x-auto">
            <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mb-4 flex items-center"
                onClick={() => navigate('/orden-de-compra')}
            >
                Volver a Ordenes de Compra
            </button>
        </div>
    )
}
export default DetallesOCTabla;