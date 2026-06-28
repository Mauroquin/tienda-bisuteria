import { createContext, useContext, useEffect, useState } from 'react';

const CarritoContext = createContext();

export const useCarrito = () => useContext(CarritoContext);

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem('carrito');
    if (data) setCarrito(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto) => {
    const prod = {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen_url,
    };
    setCarrito(prev => {
      const existe = prev.find(p => p.id === prod.id);
      if (existe) {
        return prev.map(p =>
          p.id === prod.id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      }
      return [...prev, { ...prod, cantidad: 1 }];
    });
  };

  const aumentarCantidad = (id) =>
    setCarrito(prev =>
      prev.map(p => p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p)
    );

  const disminuirCantidad = (id) =>
    setCarrito(prev =>
      prev.map(p => p.id === id ? { ...p, cantidad: p.cantidad - 1 } : p)
          .filter(p => p.cantidad > 0)
    );

  const eliminarProducto = (id) =>
    setCarrito(prev => prev.filter(p => p.id !== id));

  const vaciarCarrito = () => setCarrito([]);

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const cantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CarritoContext.Provider value={{
      carrito,
      agregarAlCarrito,
      aumentarCantidad,
      disminuirCantidad,
      eliminarProducto,
      vaciarCarrito,
      total,
      cantidad,
    }}>
      {children}
    </CarritoContext.Provider>
  );
}