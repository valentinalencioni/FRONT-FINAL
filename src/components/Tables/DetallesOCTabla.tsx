import { useNavigate } from "react-router-dom";

function DetallesOCTabla() {
    const navigate = useNavigate();
    return (
        <div style={{ padding: "20px" }} className="overflow-x-auto">
            <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mb-4 flex items-center"
                onClick={() => navigate('/orden-de-compra')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-return-left mr-2" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5" />
                </svg>

                Volver a Ordenes de Compra
            </button>
        </div>
    )
}
export default DetallesOCTabla;