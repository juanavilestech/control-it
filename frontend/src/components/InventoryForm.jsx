import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showSuccessToast, showErrorToast } from '../utils/notifications';
import { apiRequest } from '../utils/api';

const InventoryForm = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState(0);
  const [minStock, setMinStock] = useState(5);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      description,
      category,
      stock: Number(stock),
      minStock: Number(minStock)
    };

    try {
      const response = await apiRequest('/inventory', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        showSuccessToast('Ítem agregado exitosamente');
        navigate('/inventory');
      } else {
        const error = await response.json();
        showErrorToast(error.error || 'No se pudo agregar el ítem');
      }
    } catch (error) {
      console.error('Error adding item:', error);
      showErrorToast('Ocurrió un error inesperado al agregar el ítem');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/50 overflow-hidden transition-all duration-300 hover:shadow-indigo-500/10">
        <div className="px-8 py-6 border-b border-gray-200/50 bg-white/40">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Nuevo Ítem de Inventario
          </h3>
          <p className="mt-1 text-sm text-gray-500">Agregue un nuevo ítem al inventario.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-xl border-gray-400 bg-gray-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 sm:text-sm py-2.5 px-4"
                placeholder="Ej: Cable UTP Cat6"
              />
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full rounded-xl border-indigo-200 bg-gray-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 sm:text-sm p-4"
                placeholder="Descripción detallada del ítem..."
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
              <input
                type="text"
                name="category"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full rounded-xl border-gray-400 bg-gray-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 sm:text-sm py-2.5 px-4"
                placeholder="Ej: Hardware, Redes"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">Stock Inicial</label>
              <input
                type="number"
                name="stock"
                id="stock"
                required
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="block w-full rounded-xl border-gray-400 bg-gray-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 sm:text-sm py-2.5 px-4"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="minStock" className="block text-sm font-medium text-gray-700 mb-2">Stock Mínimo</label>
              <input
                type="number"
                name="minStock"
                id="minStock"
                required
                min="0"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                className="block w-full rounded-xl border-gray-400 bg-gray-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 sm:text-sm py-2.5 px-4"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200/50 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/inventory')}
              className="px-6 py-2.5 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Guardar Ítem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryForm;
