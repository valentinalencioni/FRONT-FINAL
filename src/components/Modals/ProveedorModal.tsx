import { useFormik } from "formik";
import { Modal, Button, Form } from "react-bootstrap";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { ModalType } from "../../enums/ModalType";
import { ProveedorService } from "../../services/ProveedorService";
import { Proveedor } from "../../types/Proveedor";

type ProveedorModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  modalType: ModalType;
  prov: Proveedor;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProveedorModal = ({
  show,
  onHide,
  title,
  modalType,
  prov,
  refreshData,
}: ProveedorModalProps) => {
  const handleSave = async (proveedor: Proveedor) => {
    try {
      await ProveedorService.createProveedor(proveedor);
      onHide();
      refreshData((prevState) => !prevState);
      setTimeout(() => {
        toast.success('Proveedor agregado', { position: 'top-center' });
      }, 500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error(errorMessage);
      toast.error(errorMessage, { position: 'top-center' });
    }
  };

  const validationSchema = Yup.object().shape({
    id: Yup.number().integer().min(0),
    nombreProveedor: Yup.string().required('Nombre requerido'),
  });

  const formik = useFormik({
    initialValues: prov,
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (obj: Proveedor) => handleSave(obj),
  });

  return (
    <>
      {modalType === ModalType.DELETE ? (
        <>
          {/* Aquí puedes agregar el modal para eliminar */}
        </>
      ) : (
        <Modal show={show} onHide={onHide} centered backdrop="static" className="modal-xl">
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group controlId="formNombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  name="nombreProveedor"
                  type="text"
                  value={formik.values.nombreProveedor || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={Boolean(formik.errors.nombreProveedor && formik.touched.nombreProveedor)}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.nombreProveedor}
                </Form.Control.Feedback>
              </Form.Group>
              <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                  Cancelar
                </Button>
                <Button variant="success" type="submit" disabled={!formik.isValid}>
                  Guardar
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default ProveedorModal;
