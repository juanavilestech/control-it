import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showSuccessToast, showErrorToast } from '../utils/notifications';
import { apiRequest } from '../utils/api';

const JobForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusId, setStatusId] = useState('');
  const [serviceTypeId, setServiceTypeId] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  const [statuses, setStatuses] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusRes, serviceRes, inventoryRes] = await Promise.all([
          apiRequest('/meta/statuses'),
          apiRequest('/meta/service-types'),
          apiRequest('/inventory')
        ]);

        if (statusRes.ok) setStatuses(await statusRes.json());
        if (serviceRes.ok) setServiceTypes(await serviceRes.json());
        if (inventoryRes.ok) setInventory(await inventoryRes.json());

        // If edit mode, fetch job details
        if (isEditMode) {
          const jobRes = await apiRequest(`/jobs/${id}`);
          if (jobRes.ok) {
            const job = await jobRes.json();
            setTitle(job.title);
            setDescription(job.description || '');
            setDate(new Date(job.date).toISOString().split('T')[0]);
            setStatusId(job.statusId);
            setServiceTypeId(job.serviceTypeId);
            // Map itemsUsed to selectedItems format
            if (job.itemsUsed) {
              setSelectedItems(job.itemsUsed.map(ji => ({
                itemId: ji.itemId,
                quantity: ji.quantity
              })));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [id, isEditMode]);

  const handleAddItem = () => {
    setSelectedItems([...selectedItems, { itemId: '', quantity: 1 }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...selectedItems];
    newItems[index][field] = value;
    setSelectedItems(newItems);
  };

  const handleRemoveItem = (index) => {
    const newItems = selectedItems.filter((_, i) => i !== index);
    setSelectedItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      description,
      date,
      statusId,
      serviceTypeId,
      items: selectedItems.filter(item => item.itemId && item.quantity > 0)
    };

    try {
      const endpoint = isEditMode ? `/jobs/${id}` : '/jobs';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await apiRequest(endpoint, {
        method: method,
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        showSuccessToast(isEditMode ? 'Trabajo actualizado exitosamente' : 'Trabajo creado exitosamente');
        navigate('/jobs');
      } else {
        const error = await response.json();
        showErrorToast(error.error || 'No se pudo guardar el trabajo');
      }
    } catch (error) {
      console.error('Error saving job:', error);
      showErrorToast('Ocurrió un error inesperado al guardar el trabajo');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/50 overflow-hidden transition-all duration-300 hover:shadow-indigo-500/10">
        <div className="px-8 py-6 border-b border-gray-200/50 bg-white/40">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            {isEditMode ? 'Editar Trabajo' : 'Nuevo Trabajo'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">Complete la información del trabajo realizado.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Título</label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full rounded-xl border-gray-400 bg-gray-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 sm:text-sm py-2.5 px-4"
                placeholder="Ej: Mantenimiento Preventivo"
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
                placeholder="Detalles del trabajo realizado..."
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
              <input
                type="date"
                name="date"
                id="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="block w-full rounded-xl border-gray-400 bg-gray-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 sm:text-sm py-2.5 px-4"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                id="status"
                name="status"
                required
                value={statusId}
                onChange={(e) => setStatusId(e.target.value)}
                className="block w-full rounded-xl border-gray-400 bg-gray-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 sm:text-sm py-2.5 px-4"
              >
                <option value="">Seleccione un estado</option>
                {statuses.map(status => (
                  <option key={status.id} value={status.id}>{status.name}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">Tipo de Servicio</label>
              <select
                id="serviceType"
                name="serviceType"
                required
                value={serviceTypeId}
                onChange={(e) => setServiceTypeId(e.target.value)}
                className="block w-full rounded-xl border-gray-400 bg-gray-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 sm:text-sm py-2.5 px-4"
              >
                <option value="">Seleccione un tipo</option>
                {serviceTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-6">
              <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100">
                <h4 className="text-md font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z" clipRule="evenodd" />
                  </svg>
                  Inventario Utilizado
                </h4>
                <div className="space-y-3">
                  {selectedItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md">
                      <select
                        value={item.itemId}
                        onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}
                        className="flex-1 rounded-lg border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500/20"
                      >
                        <option value="">Seleccione un ítem</option>
                        {inventory.map(invItem => (
                          <option key={invItem.id} value={invItem.id}>{invItem.name} (Stock: {invItem.stock})</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                        className="w-24 rounded-lg border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500/20"
                        placeholder="Cant."
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Eliminar ítem"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-dashed border-indigo-300 text-sm font-medium rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Agregar Ítem
                </button>
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-gray-200/50 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/jobs')}
              className="px-6 py-2.5 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              {isEditMode ? 'Guardar Cambios' : 'Crear Trabajo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
