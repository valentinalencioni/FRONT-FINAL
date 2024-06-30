import { Articulo } from "../../types/Articulo";

import { useEffect, useState } from "react";
import { Proveedor } from "../../types/Proveedor";
import { ModeloInventario } from "../../enums/ModeloInventario";
import { ArticuloService } from "../../services/ArticuloService";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import Modal from "react-bootstrap/esm/Modal";
import * as Yup from "yup";
import { Button, Form, FormLabel, ModalFooter, ModalTitle, Table } from "react-bootstrap";
import { ProveedorService } from "../../services/ProveedorService";
import { ModalType } from "../../enums/ModalType";

type ArticuloModalProps = {
  show: boolean;
  onHide: () => void;
  nombre: string;
  modalType: ModalType;
  art: Articulo;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const ArticuloModal = ({
  show,
  onHide,
  nombre,
  modalType,
  art: articulo,
  refreshData,
}: ArticuloModalProps) => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<Proveedor | null>(null);
  const [isNew, setIsNew] = useState(articulo.id === 0);



  useEffect(() => {
    setIsNew(articulo.id === 0);
  }, [articulo]);



  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await ProveedorService.getProveedores();
        setProveedores(response);
      } catch (error) {
        console.error(error);
        toast.error("Error al cargar proveedores");
      }
    };

    fetchProveedores();
  }, []);
  const initialValues = {
    id: articulo?.id || 0,
    cantidadAPedir: articulo?.cantidadAPedir || 0,
    cantidadMaxima: articulo?.cantidadMaxima || 0,
    cgi: articulo?.cgi || 0,
    costoAlmacenamiento: articulo?.costoAlmacenamiento || 0,
    costoPedido: articulo?.costoPedido || 0,
    demandaAnual: articulo?.demandaAnual || 0,
    loteOptimo: articulo?.loteOptimo || 0,
    modeloInventario: articulo?.modeloInventario || "",
    nombre: articulo?.nombre || '',
    precio: articulo?.precio || 0,
    puntoPedido: articulo?.puntoPedido || 0,
    stockActual: articulo?.stockActual || 0,
    stockSeguridad: articulo?.stockSeguridad || 0,
    tiempoRevision: articulo?.tiempoRevision || 0,
    proveedorPred: articulo?.proveedorPred || 0,
    metodoPred: articulo?.metodoPred || "",
  };
  
  //CREATE-UPDATE
  const handleSaveUpdate = async (art: Articulo) => {
    try {
      const isNew = art.id === 0;
      if (isNew) {
        await ArticuloService.createArticulo(art);
        toast.success("Artículo creado con éxito");
      } else {
        await ArticuloService.updateArticulo(art);
        toast.success("Artículo actualizado con éxito");
      }
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error");
    }
    onHide();
    refreshData(prevState => !prevState);
  };

  // const [calculado, setCalculado] = useState({ initialValues });

  const handleCalculate = async () => {
    try {
      await ArticuloService.calcularTodo(articulo.id)
      toast.success("Valores calculados",{
        position: "top-center",
      })
      console.log("Calculand")
      onHide();
      refreshData(prevState => !prevState);
    } catch (error) {
      toast.error("Ocurrió un error");
    }
  };

  //DELETE
  const handleDelete = async () => {
    console.log("Voy a borrar")
    try {
      await ArticuloService.deleteArticulo(articulo.id);
      toast.success("Artículo eliminado", {
        position: "top-center",
      })
      onHide();
      refreshData(prevState => !prevState);
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al eliminar");
    };
  }

  //Esquema YUP DE VALIDACION
  const validationSchema = Yup.object().shape({
    id: Yup.number().integer().min(0),
    nombre: Yup.string().required('Se requiere el nombre del artículo'),
    precio: Yup.number()
      .positive('El precio debe ser positivo')
      .required('El precio debe ser mayor a cero'),
    tiempoRevision: Yup.number()
      .positive('El tiempo de revisión debe ser positivo')
      .required('Se requiere el tiempo de revisión')
      .nonNullable('El tiempo de revisión no puede ser nulo'),
    stockActual: Yup.number().integer('El stock actual debe ser un entero')


  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (art: Articulo) => handleSaveUpdate(art),
  });

  return (
    <>

      {modalType === ModalType.DELETE ? (
        <Modal show={show} onHide={onHide} centered backdrop="static">
          <div className="p-6 bg-white rounded-lg shadow-xl">
            <ModalTitle className="text-lg font-bold">{articulo.nombre}</ModalTitle>
            <Modal.Body>
              <p className="mt-4">¿Está seguro de querer eliminar el articulo <br /> <strong>{articulo.nombre}</strong>?</p>
            </Modal.Body>
            <ModalFooter className="mt-4 flex justify-end">
              <Button variant="secondary" onClick={onHide} className="mr-2">No, volver</Button>
              <Button variant="danger" onClick={handleDelete}>Sí, confirmar</Button>
            </ModalFooter>
          </div>
        </Modal>
      ) : modalType === ModalType.DETAIL ? (
        <Modal show={show} onHide={onHide} centered backdrop="static">

          <Modal.Header closeButton>
            <Modal.Title>{articulo.nombre}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="overflow-x-auto">
              <Table className='min-w-full bg-white border border-gray-300'>

                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-2 px-4 border-b">Nombre</th>
                    <th className="py-2 px-4 border-b">Precio</th>
                    <th className="py-2 px-4 border-b">CGI</th>
                    <th className="py-2 px-4 border-b">Lote Óptimo</th>
                    <th className="py-2 px-4 border-b">Punto de Pedido</th>
                    <th className="py-2 px-4 border-b">Modelo Inventario</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b">{articulo.nombre}</td>
                    <td className="py-2 px-4 border-b">{articulo.precio}</td>
                    <td className="py-2 px-4 border-b">{articulo.cgi}</td>
                    <td className="py-2 px-4 border-b">{articulo.loteOptimo}</td>
                    <td className="py-2 px-4 border-b">{articulo.puntoPedido}</td>
                    <td className="py-2 px-4 border-b">{articulo.modeloInventario.replace('_', ' ')}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>Cerrar</Button>
            <Button variant="primary" onClick={handleCalculate}>Calcular Valores</Button>
          </Modal.Footer>
        </Modal>
      ) : (
        <Modal show={show} onHide={onHide} centered backdrop="static">
          <div className="p-6 bg-white rounded-lg shadow-xl">
            <Modal.Header closeButton>
              <ModalTitle className="text-lg font-bold">{nombre}</ModalTitle>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-4">
                  <FormLabel className="block text-gray-700">Nombre</FormLabel>
                  <Form.Control
                    name="nombre"
                    type="text"
                    value={formik.values.nombre}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={Boolean(formik.errors.nombre && formik.touched.nombre)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.nombre}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <FormLabel className="block text-gray-700">Precio</FormLabel>
                  <Form.Control
                    name="precio"
                    type="number"
                    value={formik.values.precio}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={Boolean(formik.errors.precio && formik.touched.precio)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.precio}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* tiempoRevision */}
                <Form.Group className="mb-4">
                  <FormLabel className="block text-gray-700">Tiempo de revisión</FormLabel>
                  <Form.Control
                    name="tiempoRevision"
                    type="number"
                    value={formik.values.tiempoRevision}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={Boolean(formik.errors.tiempoRevision && formik.touched.tiempoRevision)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.tiempoRevision}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* stockactual */}

                {isNew && (
                  <Form.Group className="mb-4">
                    <FormLabel className="block text-gray-700">Stock Actual</FormLabel>
                    <Form.Control
                      name="stockActual"
                      type="number"
                      value={formik.values.stockActual}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={Boolean(formik.errors.stockActual && formik.touched.stockActual)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.stockActual}
                    </Form.Control.Feedback>
                  </Form.Group>
                )}

                <Form.Group className="mb-4">
                  <FormLabel className="block text-gray-700">Modelo Inventario</FormLabel>
                  <Form.Control
                    as="select"
                    name="modeloInventario"
                    value={formik.values.modeloInventario}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.modeloInventario && !!formik.errors.modeloInventario}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    <option value="">Selecciona un Modelo de Inventario</option>
                    {Object.values(ModeloInventario).map((modelo) => (
                      <option key={modelo} value={modelo}>
                        {modelo.replace('_', ' ').toLowerCase()}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.modeloInventario}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <FormLabel className="block text-gray-700">Proveedor</FormLabel>
                  <Form.Control
                    as="select"
                    value={proveedorSeleccionado?.id}
                    onChange={(e) => {
                      const selectedId = Number(e.target.value); // Convertir a número
                      const selectedProveedor = proveedores.find(proveedor => proveedor.id === selectedId) || null;
                      setProveedorSeleccionado(selectedProveedor);
                      formik.setFieldValue("proveedorPred", selectedProveedor);
                    }}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.proveedorPred?.id && !!formik.errors.proveedorPred?.id}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    <option value="">Selecciona un Proveedor</option>
                    {proveedores.map(proveedor => (
                      <option key={proveedor.id} value={proveedor.id}>
                        {proveedor.nombreProveedor}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.proveedorPred?.id}
                  </Form.Control.Feedback>
                </Form.Group>



                <ModalFooter className="mt-4 flex justify-end">
                  <Button variant="secondary" onClick={onHide} className="mr-2">Cancelar</Button>
                  <Button variant="primary" type="submit">Guardar</Button>
                </ModalFooter>
              </Form>
            </Modal.Body>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ArticuloModal;