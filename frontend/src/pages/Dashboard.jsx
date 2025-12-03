import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
<<<<<<< HEAD
import { Link } from 'react-router-dom';
=======
import { showSuccessToast } from '../utils/notifications';
import { SiOpenai, SiYoutube, SiAnydesk } from 'react-icons/si';
import { FaProjectDiagram } from 'react-icons/fa';
>>>>>>> 0618c54db50123ddadc7a5a7935dfe77de83a49f

const Dashboard = () => {
  const [stats, setStats] = useState({
    pendingJobs: 0,
    lowStockItems: 0,
    completedJobs: 0
  });
  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [jobsRes, inventoryRes] = await Promise.all([
          apiRequest('/jobs'),
          apiRequest('/inventory')
        ]);

        if (jobsRes.ok && inventoryRes.ok) {
          const jobs = await jobsRes.json();
          const inventory = await inventoryRes.json();

          // Count pending jobs (statusId 1 = Pendiente)
          const pending = jobs.filter(job => job.statusId === 1).length;

          // Count completed jobs (statusId 3 = Completado)
          const completed = jobs.filter(job => job.statusId === 3).length;

          // Count low stock items (stock <= minStock)
          const lowStock = inventory.filter(item => item.stock <= item.minStock).length;

          setStats({
            pendingJobs: pending,
            lowStockItems: lowStock,
            completedJobs: completed
          });

          // Get 5 most recent jobs sorted by date
          const sortedJobs = jobs
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
          setRecentJobs(sortedJobs);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

<<<<<<< HEAD
  const getStatusBadge = (statusId) => {
    const statusConfig = {
      1: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
      2: { label: 'En Progreso', color: 'bg-blue-100 text-blue-800' },
      3: { label: 'Completado', color: 'bg-green-100 text-green-800' },
      4: { label: 'Cancelado', color: 'bg-red-100 text-red-800' }
    };
    const config = statusConfig[statusId] || { label: 'Desconocido', color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    // Parse the date string correctly to avoid timezone issues
    const date = new Date(dateString);
    // Add timezone offset to get the correct local date
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    
    return localDate.toLocaleDateString('es-AR', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
=======
  const handleAnyDeskClick = (e) => {
    e.preventDefault();
    showSuccessToast('🚀 Iniciando AnyDesk...');
    setTimeout(() => {
      window.location.href = 'anydesk:';
    }, 1000);
>>>>>>> 0618c54db50123ddadc7a5a7935dfe77de83a49f
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar de Utilidades */}
      <aside className="w-full lg:w-20 flex-shrink-0 transition-all duration-300">
        <div className="bg-white shadow-lg rounded-2xl p-4 sticky top-24 flex flex-col items-center gap-4 border border-gray-100">

          <div className="p-2 bg-indigo-50 rounded-xl mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>

          <div className="flex flex-col gap-4 w-full">
            {/* ChatGPT */}
            <a
              href="https://chat.openai.com/"
              target="_blank"
              rel="noopener noreferrer"
              title="ChatGPT"
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-green-100 hover:text-green-600 hover:scale-110 hover:shadow-md transition-all duration-300 mx-auto"
            >
              <SiOpenai size={24} />
            </a>

            {/* Fast.com */}
            <a
              href="https://fast.com/es/"
              target="_blank"
              rel="noopener noreferrer"
              title="Fast.com"
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-800 hover:bg-black hover:text-white hover:scale-110 hover:shadow-md transition-all duration-300 mx-auto font-bold text-[10px]"
            >
              FAST
            </a>

            {/* AnyDesk */}
            <a
              href="anydesk:"
              onClick={handleAnyDeskClick}
              title="AnyDesk"
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-red-100 hover:text-red-600 hover:scale-110 hover:shadow-md transition-all duration-300 mx-auto"
            >
              <SiAnydesk size={24} />
            </a>

            {/* YouTube */}
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              title="YouTube"
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-red-100 hover:text-red-600 hover:scale-110 hover:shadow-md transition-all duration-300 mx-auto"
            >
              <SiYoutube size={24} />
            </a>

            {/* Lucidchart */}
            <a
              href="https://www.lucidchart.com/"
              target="_blank"
              rel="noopener noreferrer"
              title="Lucidchart"
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-orange-100 hover:text-orange-600 hover:scale-110 hover:shadow-md transition-all duration-300 mx-auto"
            >
              <FaProjectDiagram size={24} />
            </a>
          </div>
        </div>
      </aside>

      {/* Contenido Principal */}
      <div className="flex-1">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Stats Cards */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Trabajos Pendientes</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.pendingJobs}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Insumos Bajos</dt>
              <dd className={`mt-1 text-3xl font-semibold ${stats.lowStockItems > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                {stats.lowStockItems}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Trabajos Completados</dt>
              <dd className="mt-1 text-3xl font-semibold text-green-600">{stats.completedJobs}</dd>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg leading-6 font-medium text-gray-900">Actividad Reciente</h2>
          <div className="mt-4 bg-white shadow rounded-lg p-6">
            <p className="text-gray-500">Dashboard actualizado con estadísticas en tiempo real.</p>
          </div>
        </div>
      </div>
<<<<<<< HEAD
      
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Actividad Reciente</h2>
          <Link to="/jobs" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            Ver todos →
          </Link>
        </div>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {recentJobs.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {recentJobs.map((job) => (
                <li key={job.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {job.title}
                      </p>
                      <div className="mt-1 flex items-center gap-3">
                        {getStatusBadge(job.statusId)}
                        {job.serviceType && (
                          <span className="text-xs text-gray-500">
                            {job.serviceType.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0 text-right">
                      <p className="text-xs text-gray-500">
                        {formatDate(job.date)}
                      </p>
                    </div>
                  </div>
                  {job.description && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {job.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">No hay trabajos registrados aún</p>
              <Link to="/jobs/new" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                Crear primer trabajo
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
=======
    </div>
>>>>>>> 0618c54db50123ddadc7a5a7935dfe77de83a49f
  );
};

export default Dashboard;
