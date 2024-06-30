import {EyeFill} from "react-bootstrap-icons";

interface DetalleButtonProps{
    onClick:()=> void;
}

export const DetalleButton = ({onClick}: DetalleButtonProps) => {
    return (
        <EyeFill
            color="#FBC02D"
            size={24}
            onClick={onClick}
            onMouseEnter={()=> {document.body.style.cursor = 'pointer'}}
            onMouseLeave={()=> {document.body.style.cursor = 'default'}}
            />
    )
}

export default DetalleButton