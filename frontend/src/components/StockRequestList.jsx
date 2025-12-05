import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { apiRequest } from "../utils/api";
import Swal from "sweetalert2";

const StockRequestList = () => {
  const [stockRequests, setStockRequests] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  useEffect(() => {
    fetchStockRequests();
  }, []);

  const fetchStockRequests = async () => {
    try {
      const res = await apiRequest("/stock-requests");
      const data = await res.json();
      setStockRequests(data);
    } catch (err) {
      console.error("Error fetching stock requests:", err);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await apiRequest(`/stock-requests/${id}`, { method: "DELETE" });
        Swal.fire("Eliminado!", "El pedido ha sido eliminado.", "success");
        fetchStockRequests();
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el pedido", "error");
      }
    }
  };

  const handleConvert = async (id) => {
    const result = await Swal.fire({
      title: "¿Convertir a inventario?",
      text: "Esto agregará el ítem al inventario y eliminará el pedido",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, convertir",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await apiRequest(`/stock-requests/${id}/convert`, { method: "POST" });
        Swal.fire(
          "Convertido!",
          "El pedido ha sido agregado al inventario.",
          "success"
        );
        fetchStockRequests();
      } catch (error) {
        Swal.fire("Error", "No se pudo convertir el pedido", "error");
      }
    }
  };

  const filteredItems = stockRequests.filter(
    (item) =>
      item.name && item.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
      ordered: { label: "Pedido", color: "bg-blue-100 text-blue-800" },
      received: { label: "Recibido", color: "bg-green-100 text-green-800" },
    };
    const config = statusConfig[status] || {
      label: status,
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

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <div className="flex items-center gap-2 mb-4 w-full sm:w-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
            placeholder="Buscar pedido..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
        {filterText && (
          <button
            onClick={handleClear}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    );
  }, [filterText, resetPaginationToggle]);

  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.name,
      sortable: true,
      grow: 2,
    },
    {
      name: "Categoría",
      selector: (row) => row.category,
      sortable: true,
      cell: (row) => (
        <div className="text-sm text-gray-500">{row.category || "-"}</div>
      ),
    },
    {
      name: "Cantidad",
      selector: (row) => row.quantity,
      sortable: true,
      cell: (row) => (
        <div className="text-sm font-semibold text-gray-900">
          {row.quantity}
        </div>
      ),
    },
    {
      name: "Estado",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => getStatusBadge(row.status),
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleConvert(row.id)}
            className="text-green-600 hover:text-green-800 font-medium text-sm"
            title="Convertir a inventario"
          >
            ✓ Convertir
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="text-red-600 hover:text-red-800 font-medium text-sm"
            title="Eliminar"
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  const customStyles = {
    table: {
      style: {
        backgroundColor: "transparent",
      },
    },
    headRow: {
      style: {
        backgroundColor: "rgba(249, 250, 251, 0.5)",
        borderBottomWidth: "1px",
        borderBottomColor: "rgba(229, 231, 235, 0.5)",
      },
    },
    rows: {
      style: {
        backgroundColor: "transparent",
        "&:not(:last-of-type)": {
          borderBottomStyle: "solid",
          borderBottomWidth: "1px",
          borderBottomColor: "rgba(229, 231, 235, 0.5)",
        },
        "&:hover": {
          backgroundColor: "rgba(243, 244, 246, 0.4)",
          transition: "all 0.2s",
        },
      },
    },
    pagination: {
      style: {
        backgroundColor: "transparent",
        borderTopWidth: "1px",
        borderTopColor: "rgba(229, 231, 235, 0.5)",
      },
    },
  };

  return (
    <div className="flex flex-col">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
          Pedidos de Stock
        </h2>
        <Link
          to="/stock-requests/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Nuevo Pedido
        </Link>
      </div>

      <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/50 overflow-hidden">
        <div className="p-4">{subHeaderComponentMemo}</div>
        <DataTable
          columns={columns}
          data={filteredItems}
          pagination
          paginationResetDefaultPage={resetPaginationToggle}
          customStyles={customStyles}
          noDataComponent={
            <div className="p-4 text-gray-500">No hay pedidos para mostrar</div>
          }
          highlightOnHover
          pointerOnHover
        />
      </div>
    </div>
  );
};

export default StockRequestList;
