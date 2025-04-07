class Producto {
    constructor(id, imagenUrl, descripcion, precio, creadoEn,descripcionExtensa, unidadesDisponibles) {
      this.id = id;
      this.imagenUrl = imagenUrl;
      this.descripcion = descripcion;
      this.precio = precio;
      this.creadoEn = new Date(creadoEn);
      this.descripcionExtensa = descripcionExtensa; 
      this.unidadesDisponibles = unidadesDisponibles;
    }
  }
  
  export default Producto;
  