import { PrediccionDemandaService } from "../../services/PrediccionDemandaService";
import { PrediccionDemanda } from "../../types/PrediccionDemanda";



function PrediccionDemandaTabla (){
    const [prediccionesDemanda, setPrediccionesDemanda] = useState<PrediccionDemanda[]>([]);
    const [refreshData, setRefreshData] = useState(false);


    useEffect(() => {
        const fetchPrediccionesDemanda = async () => {
            try {
                const prediccionesDemanda = await PrediccionDemandaService.getPrediccionesDemanda();
                setPrediccionesDemanda(Array.isArray(prediccionesDemanda) ? prediccionesDemanda : []);
            } catch (error) {
                console.error('Error fetching prediccionesDemanda:', error);
            }
        };

        fetchPrediccionesDemanda();

    }, [refreshData]);

    const initializableNewPrediccionDemanda = (): PrediccionDemanda =>({
        id: 0,
        fechaPrediccion: new Date(),
        valorPrediccion: 0,
        

    })

}