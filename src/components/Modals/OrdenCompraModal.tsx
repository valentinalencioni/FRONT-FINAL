import { ModalType } from "../../enums/ModalType";
import { OrdenCompra } from "../../types/OrdenCompra";

type OrdenCompraModalProps={
  show: boolean;
  onHide:() => void;
  title: string;
  modalType: ModalType;
  ord: OrdenCompra;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const OrdenCompraModal =({
  show,
  onHide,
  title,
  modalType,
  ord,
refreshData,
}:OrdenCompraModalProps) => {

})
export default OrdenCompraModal