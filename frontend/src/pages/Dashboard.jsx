import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SiOpenai, SiAnydesk, SiYoutube } from "react-icons/si";
import { FaProjectDiagram } from "react-icons/fa";
import { apiRequest } from "../utils/api";
import Swal from "sweetalert2";

const Dashboard = () => {
  const [stats, setStats] = useState({
    pendingJobs: 0,
    lowStockItems: 0,
    completedJobs: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [lowStockList, setLowStockList] = useState([]);
  const [jobStats, setJobStats] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
    total: 0,
  });

  const handleAnyDeskClick = (e) => {
    e.preventDefault();
    window.location.href = "anydesk:";

    // Show notification
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "info",
      title: "Abriendo AnyDesk...",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [jobsRes, inventoryRes] = await Promise.all([
          apiRequest("/jobs"),
          apiRequest("/inventory"),
        ]);

        if (jobsRes.ok && inventoryRes.ok) {
          const jobs = await jobsRes.json();
          const inventory = await inventoryRes.json();

          // Job Stats Calculation
          const pending = jobs.filter((job) => job.statusId === 1).length;
          const inProgress = jobs.filter((job) => job.statusId === 2).length;
          const completed = jobs.filter((job) => job.statusId === 3).length;
          const cancelled = jobs.filter((job) => job.statusId === 4).length;
          const totalJobs = jobs.length;

          setJobStats({
            pending,
            inProgress,
            completed,
            cancelled,
            total: totalJobs,
          });

          // Low Stock Calculation
          const lowStockItems = inventory.filter(
            (item) => item.stock <= item.minStock
          );
          const lowStockCount = lowStockItems.length;
          setLowStockList(lowStockItems.slice(0, 5)); // Top 5 low stock items

          setStats({
            pendingJobs: pending,
            lowStockItems: lowStockCount,
            completedJobs: completed,
          });

          // Get 5 most recent jobs sorted by date
          const sortedJobs = jobs
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
          setRecentJobs(sortedJobs);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const getStatusBadge = (statusId) => {
    const statusConfig = {
      1: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
      2: { label: "En Progreso", color: "bg-blue-100 text-blue-800" },
      3: { label: "Completado", color: "bg-green-100 text-green-800" },
      4: { label: "Cancelado", color: "bg-red-100 text-red-800" },
    };
    const config = statusConfig[statusId] || {
      label: "Desconocido",
      color: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no válida";
    // Parse the date string correctly to avoid timezone issues
    const date = new Date(dateString);
    // Add timezone offset to get the correct local date
    const localDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60000
    );

    return localDate.toLocaleDateString("es-AR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar de Utilidades */}
      <aside className="w-full lg:w-20 flex-shrink-0 transition-all duration-300">
        <div className="bg-white shadow-lg rounded-2xl p-4 sticky top-24 flex flex-col items-center gap-4 border border-gray-100">
          <div className="p-2 bg-indigo-50 rounded-xl mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
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

            {/* SHC */}
            <a
              href="https://shc.ms.gba.gov.ar/auth/login"
              target="_blank"
              rel="noopener noreferrer"
              title="SHC"
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-purple-100 hover:scale-110 hover:shadow-md transition-all duration-300 mx-auto p-2"
            >
              <img
                src="/HSI_Logo.png"
                alt="SHC"
                className="w-full h-full object-contain"
              />
            </a>
          </div>
        </div>
      </aside>

      {/* Contenido Principal */}
      <div className="flex-1">
        {/* Acciones Rápidas */}
        <div className="mb-8">
          <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/jobs/new"
              className="flex items-center justify-center px-4 py-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transform hover:-translate-y-1 transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nuevo Trabajo
            </Link>
            <Link
              to="/inventory/new"
              className="flex items-center justify-center px-4 py-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transform hover:-translate-y-1 transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Nuevo Ítem
            </Link>
            <Link
              to="/stock-requests"
              className="flex items-center justify-center px-4 py-4 border-2 border-indigo-100 rounded-xl shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 hover:border-indigo-200 transform hover:-translate-y-1 transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              Pedidos de Stock
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Stats Cards */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Trabajos Pendientes
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {stats.pendingJobs}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Insumos Bajos
              </dt>
              <dd
                className={`mt-1 text-3xl font-semibold ${stats.lowStockItems > 0 ? "text-red-600" : "text-gray-900"
                  }`}
              >
                {stats.lowStockItems}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Trabajos Completados
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-green-600">
                {stats.completedJobs}
              </dd>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alertas de Stock */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Alertas de Stock
            </h2>
            {lowStockList.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {lowStockList.map((item) => (
                  <li
                    key={item.id}
                    className="py-3 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Mínimo: {item.minStock}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Stock: {item.stock}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No hay alertas de stock.
              </p>
            )}
          </div>

          {/* Estado de Trabajos */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Estado de Trabajos
            </h2>
            <div className="space-y-4">
              {/* Pendientes */}
              <div>
                <div className="flex justify-between text-sm font-medium text-gray-900 mb-1">
                  <span>Pendientes</span>
                  <span>{jobStats.pending}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-yellow-400 h-2.5 rounded-full"
                    style={{
                      width: `${jobStats.total > 0
                          ? (jobStats.pending / jobStats.total) * 100
                          : 0
                        }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* En Progreso */}
              <div>
                <div className="flex justify-between text-sm font-medium text-gray-900 mb-1">
                  <span>En Progreso</span>
                  <span>{jobStats.inProgress}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{
                      width: `${jobStats.total > 0
                          ? (jobStats.inProgress / jobStats.total) * 100
                          : 0
                        }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Completados */}
              <div>
                <div className="flex justify-between text-sm font-medium text-gray-900 mb-1">
                  <span>Completados</span>
                  <span>{jobStats.completed}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{
                      width: `${jobStats.total > 0
                          ? (jobStats.completed / jobStats.total) * 100
                          : 0
                        }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Cancelados */}
              <div>
                <div className="flex justify-between text-sm font-medium text-gray-900 mb-1">
                  <span>Cancelados</span>
                  <span>{jobStats.cancelled}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-red-600 h-2.5 rounded-full"
                    style={{
                      width: `${jobStats.total > 0
                          ? (jobStats.cancelled / jobStats.total) * 100
                          : 0
                        }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg leading-6 font-medium text-gray-900">
            Actividad Reciente
          </h2>
          <Link
            to="/jobs"
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Ver todos →
          </Link>
        </div>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {recentJobs.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {recentJobs.map((job) => (
                <li
                  key={job.id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {job.title}
                      </p>
                      <div className="mt-1 flex items-center gap-3">
                        {getStatusBadge(job.statusId)}
                        {job.serviceType && (
                          <span className="text-xs text-gray-500">
                            {job.serviceType?.name || "Sin tipo"}
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
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-500">
                No hay trabajos registrados aún
              </p>
              <Link
                to="/jobs/new"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                Crear primer trabajo
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
