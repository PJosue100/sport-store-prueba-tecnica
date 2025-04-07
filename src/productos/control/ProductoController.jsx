import Producto from "../modelo/Producto";

class ProductoController {
  constructor() {
    this.productos = [];
  }

  setProductos(jsonData) {
    this.productos = jsonData.map(
      (item) => new Producto(item.id, item.imagenUrl, item.descripcion, item.precio, item.creadoEn, item.descripcionExtensa, item.unidadesDisponibles)
    );
  }

  getProductos() {
    return this.productos;
  }

  getProductoById(id) {
    return this.productos.find((p) => p.id === id);
  }
}

export default new ProductoController();
