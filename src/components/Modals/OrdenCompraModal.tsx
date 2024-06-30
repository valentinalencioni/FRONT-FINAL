import { useState } from "react";
import { Button, Form, Modal, ModalFooter, ModalTitle } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { OrdenCompra } from "../../types/OrdenCompra";
import { OrdenCompraService } from "../../services/OrdenCompraService";
import { toast } from "react-toastify";
import { ModalType } from "../../types/ModalType";

type OrdenCompraModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  modalType: ModalType;
  ord: OrdenDeCompra;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const OrdenCompraModal = ({
  show,
  onHide,
  title,
  modalType,
  ord,
  refreshData,
}: OrdenCompraModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    id: orden.id,
    estadoOC: orden.estadoOrdenCompra,
    fechaOC: orden.fechaOrdenCompra,
    totalOC: orden.totalOrdenCompra,
    proveedor: orden.proveedor.id,
  };

  const handleSaveUpdate = async (ord: OrdenDeCompra) => {
    setIsLoading(true);
    try {
      if (modalType === ModalType.CREATE) {
        await OrdenDeCompraService.createOrdenCompra(ord);
        toast.success("Orden de compra creada", { position: "top-center" });
      } else if (modalType === ModalType.UPDATE) {
        await OrdenDeCompraService.updateOrdenCompra(ord.id, ord);
        toast.success("Orden de compra actualizada", { position: "top-center" });
      }
      onHide();
      refreshData();
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error");
    } finally {
      setIsLoading(false);
    }
  };

  const validationSchema = Yup.object().shape({
    estadoOC: Yup.string().required("El estado es requerido"),
    fechaOC: Yup.string().required("La fecha es requerida"),
    totalOC: Yup.number().required("El total es requerido").min(0),
    idProveedorArticulo: Yup.number().required("El ID del proveedor es requerido"),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => handleSaveUpdate( orden),
  });

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <div className="p-6 bg-white rounded-lg shadow-xl">
        <Modal.Header closeButton>
          <ModalTitle className="text-lg font-bold">{title}</ModalTitle>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="block text-gray-700">Estado</Form.Label>
              <Form.Control
                name="estadoOC"
                type="text"
                value={formik.values.estadoOC}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={Boolean(formik.errors.estadoOC && formik.touched.estadoOC)}
                disabled={modalType === ModalType.VIEW}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.estadoOC}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="block text-gray-700">Fecha</Form.Label>
              <Form.Control
                name="fechaOC"
                type="text"
                value={formik.values.fechaOC}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={Boolean(formik.errors.fechaOC && formik.touched.fechaOC)}
                disabled={modalType === ModalType.VIEW}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.fechaOC}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="block text-gray-700">Total</Form.Label>
              <Form.Control
                name="totalOC"
                type="number"
                value={formik.values.totalOC}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={Boolean(formik.errors.totalOC && formik.touched.totalOC)}
                disabled={modalType === ModalType.VIEW}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.totalOC}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="block text-gray-700">ID Proveedor Artículo</Form.Label>
              <Form.Control
                name="idProveedorArticulo"
                type="number"
                value={formik.values.proveedor}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={Boolean(
                  formik.errors.proveedor && formik.touched.proveedor
                )}
                disabled={modalType === ModalType.VIEW}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.proveedor}
              </Form.Control.Feedback>
            </Form.Group>

            <ModalFooter className="mt-4 flex justify-end">
              <Button variant="secondary" onClick={onHide} className="mr-2">
                Cancelar
              </Button>
              {modalType !== ModalType.VIEW && (
                <Button variant="primary" type="submit" disabled={isLoading}>
                  {isLoading ? "Guardando..." : "Guardar"}
                </Button>
              )}
            </ModalFooter>
          </Form>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default OrdenCompraModal;