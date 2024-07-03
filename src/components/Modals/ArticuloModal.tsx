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
import { ProveedorArticulo } from "../../types/ProveedorArticulo";
import { ProveedorArticuloService } from "../../services/ProveedorArticuloService";
import { CrearArticuloDTO } from "../../types/CrearArticuloDTO";

type ArticuloModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  modalType: ModalType;
  art: Articulo;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const ArticuloModal = ({
  show,
  onHide,
  title,
  modalType,
  art: articulo,
  refreshData,
}: ArticuloModalProps) => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<Proveedor | null>(null);
  const [isNew, setIsNew] = useState(articulo.id === 0);
  const [provArt, setProvArt] = useState<ProveedorArticulo[]>([]);
  const [provArtSelec, setprovArtSelec] = useState<ProveedorArticulo | null>(null);


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

    const fetchProvArt = async () => {
      try {
        const response = await ProveedorArticuloService.getProveedoresArt();
        setProvArt(response);
      } catch (error) {
        console.error(error);
        toast.error("Error al cargar proveedores");
      }
    };

    fetchProveedores();
    fetchProvArt();
  }, []);
  const initialValues: CrearArticuloDTO = {
    nombre: '',
    stockActual:  0,
    modeloInventario: ModeloInventario.LOTE_FIJO,
    tiempoRevision:  0,
    idProveedorPred: articulo?.proveedorPred || 0,
    tiempoDemora: 0,
    costoAlmacenamiento: 0,
    costoPedido:  0,
    precioArticuloProveedor: 0,
    //nombreProveedor: provArt.find(pa => pa.proveedor.nombreProveedor === articulo?.proveedorPred.nombreProveedor || ''),
  };

  //CREATE-UPDATE
  const handleSaveUpdate = async (articuloDTO: CrearArticuloDTO) => {
    try {
      await ArticuloService.createArticulo(articuloDTO);
      toast.success("Artículo creado con éxito");
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
      toast.success("Valores calculados", {
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

    try {
      await ArticuloService.deleteArticulo(articulo.id);
      toast.success("Artículo eliminado", {
        position: "top-center",
      })

      console.log("Voy a borrar")
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al eliminar");
    };
    onHide();
    refreshData(prevState => !prevState);
  }

  //Esquema YUP DE VALIDACION
  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required('Se requiere el nombre del artículo'),
    stockActual: Yup.number().integer('El stock actual debe ser un entero').required('Este es un campo obligatorio').positive('El stock actual debe ser positivo')
      .nonNullable('El tiempo de revisión no puede ser nulo'),
    modeloInventario: Yup.mixed().oneOf(Object.values(ModeloInventario)).required('Este es un campo obligatorio'),
    tiempoRevision: Yup.number()
      .positive('El tiempo de revisión debe ser positivo')
      .required('Este es un campo obligatorio')
      .nonNullable('El tiempo de revisión no puede ser nulo'),
    idProveedorPred: Yup.object().shape({
      id: Yup.number().required('Debe seleccionar un proveedor')
    }).nullable().required('Este es un campo obligatorio'),

    tiempoDemora: Yup.number()
      .positive('El tiempo de demora debe ser positivo')
      .required('Este es un campo obligatorio')
      .nonNullable('El tiempo de demora no puede ser nulo'),

      costoAlmacenamiento: Yup.number() 
      .positive('El costo de almacenamiento debe ser positivo')
      .required('Este es un campo obligatorio')
      .nonNullable('El costo de almacenamiento no puede ser nulo'),

    costoPedido: Yup.number() 
      .positive('El costo de pedido debe ser positivo')
      .required('Este es un campo obligatorio')
      .nonNullable('El costo de pedido no puede ser nulo'),

    precioArticuloProveedor: Yup.number()
      .positive('El precio debe ser positivo')
      .required('Este es un campo obligatorio')
      .nonNullable('El precio no puede ser nulo'),



  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (articuloDTO: CrearArticuloDTO) => handleSaveUpdate(articuloDTO),
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
                    <th className="py-2 px-4 border-b">Cantidad a Pedir</th>
                    <th className="py-2 px-4 border-b"> Cantidad Maxima</th>
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
                    <td className="py-2 px-4 border-b">{articulo.cantidadAPedir}</td>
                    <td className="py-2 px-4 border-b">{articulo.cantidadMaxima}</td>
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
              <ModalTitle className="text-lg font-bold">Nuevo Articulo</ModalTitle>
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
                    placeholder="Ingrese el nombre del artículo"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.nombre}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <FormLabel className="block text-gray-700">Precio</FormLabel>
                  <Form.Control
                    name="precioArticuloProveedor"
                    type="number"
                    value={formik.values.precioArticuloProveedor}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={Boolean(formik.errors.precioArticuloProveedor && formik.touched.precioArticuloProveedor)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.precioArticuloProveedor}
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
                <Form.Group className="mb-4">
                  <FormLabel className="block text-gray-700">Stock actual</FormLabel>
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

                <Form.Group className="mb-4">
                  <FormLabel className="block text-gray-700">Proveedor</FormLabel>
                  <Form.Control
                    as="select"
                    value={formik.values.idProveedorPred?.id || ''}
                    onChange={(e) => {
                      const selectedId = Number(e.target.value); // Convertir a número
                      const selectedProveedor = proveedores.find(proveedor => proveedor.id === selectedId) || null;
                      setProveedorSeleccionado(selectedProveedor);
                      formik.setFieldValue("proveedorPred", selectedProveedor || { id: '' });
                    }}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.idProveedorPred && !!formik.errors.idProveedorPred?.id}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    <option value="">Selecciona un Proveedor</option>
                    {Object.values(proveedores).map(proveedor => (
                      <option key={proveedor.id} value={proveedor.id}>
                        {proveedor.nombreProveedor}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.idProveedorPred?.id}
                  </Form.Control.Feedback>
                </Form.Group>

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

                {/* tiempoDemora */}
                <Form.Group className="mb-4">
                  <FormLabel className="block text-gray-700">Tiempo de demora del proveedor </FormLabel>
                  <Form.Control
                    name="tiempoDemora"
                    type="number"
                    value={formik.values.tiempoDemora}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={Boolean(formik.errors.tiempoDemora && formik.touched.tiempoDemora)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.tiempoDemora}
                  </Form.Control.Feedback>
                </Form.Group>


                
                <Form.Group className="mb-4">
                  <FormLabel className="block text-gray-700">Costo de almacenamiento</FormLabel>
                  <Form.Control
                    name="costoAlmacenamiento"
                    type="number"
                    value={formik.values.costoAlmacenamiento}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={Boolean(formik.errors.costoAlmacenamiento && formik.touched.costoAlmacenamiento)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.costoPedido}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <FormLabel className="block text-gray-700">Costo de pedido</FormLabel>
                  <Form.Control
                    name="costoPedido"
                    type="number"
                    value={formik.values.costoPedido}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={Boolean(formik.errors.costoPedido && formik.touched.costoPedido)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.costoPedido}
                  </Form.Control.Feedback>
                </Form.Group>



                {/* {!isNew && (
                  <Form.Group className="mb-4">
                    <Form.Label className="block text-gray-700">Proveedor Articulo</Form.Label>
                    <Form.Control
                      as="select"
                      name="provArt"
                      value={proveedorSeleccionado?.id}
                      onChange={(e) => {
                        const selectedId = Number(e.target.value); // Convertir a número
                        const provArtSelec = provArt.find(prov => prov.proveedor.id === selectedId) || null;
                        setprovArtSelec(provArtSelec);
                        formik.setFieldValue("provArt", provArtSelec);
                      }}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.idProveedorPred && !!formik.errors.idProveedorPred}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                      <option value="">Selecciona un Proveedor</option>
                      {provArt.map((prov) => (
                        <option key={prov.proveedor.id} value={prov.proveedor.id}>
                          {proveedores.find(p => p.id === prov.proveedor.id)?.nombreProveedor}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.idProveedorPred?.id}
                    </Form.Control.Feedback>
                  </Form.Group>
                )} */}



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