import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { apiRequest } from '../utils/api';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const InventoryTable = () => {
  const [inventory, setInventory] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  useEffect(() => {
    apiRequest('/inventory')
      .then(res => res.json())
      .then(data => setInventory(data))
      .catch(err => console.error('Error fetching inventory:', err));
  }, []);

  const filteredItems = inventory.filter(
    item => item.name && item.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const exportToExcel = () => {
    const data = filteredItems.map(item => ({
      'Nombre': item.name,
      'Descripción': item.description || '',
      'Categoría': item.category || 'Sin categoría',
      'Stock Actual': item.stock,
      'Stock Mínimo': item.minStock,
      'Estado': item.stock <= item.minStock ? 'BAJO STOCK' : 'OK'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventario');

    // Auto-size columns
    ws['!cols'] = [
      { wch: 25 },
      { wch: 40 },
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 }
    ];

    // Style for low stock items
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      const stockCell = ws[XLSX.utils.encode_cell({ r: R, c: 3 })];
      const minStockCell = ws[XLSX.utils.encode_cell({ r: R, c: 4 })];
      if (stockCell && minStockCell && parseInt(stockCell.v) <= parseInt(minStockCell.v)) {
        if (!stockCell.s) stockCell.s = {};
        stockCell.s.fill = { fgColor: { rgb: "FFCCCC" } };
      }
    }

    XLSX.writeFile(wb, `Inventario_${new Date().toLocaleDateString('es-ES').replace(/\//g, '-')}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text('Relevamiento de Stock', 14, 20);
    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}`, 14, 28);

    // Table
    const tableData = filteredItems.map(item => [
      item.name,
      item.category || '-',
      item.stock.toString(),
      item.minStock.toString(),
      item.stock <= item.minStock ? 'BAJO' : 'OK'
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['Nombre', 'Categoría', 'Stock', 'Mín.', 'Estado']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
      didParseCell: function (data) {
        // Highlight low stock rows
        if (data.row.index >= 0 && data.column.index === 4 && data.cell.raw === 'BAJO') {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    });

    doc.save(`Inventario_${new Date().toLocaleDateString('es-ES').replace(/\//g, '-')}.pdf`);
  };

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };

    return (
      <div className="flex items-center gap-2 mb-4 w-full sm:w-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
            placeholder="Buscar ítem..."
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
          />
        </div>
        {filterText && (
          <button onClick={handleClear} className="p-2 text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    );
  }, [filterText, resetPaginationToggle]);

  const columns = [
    {
      name: 'Nombre',
      selector: row => row.name,
      sortable: true,
      cell: row => (
        <div className="py-2">
          <div className="text-sm font-medium text-gray-900">{row.name}</div>
          {row.description && (
            <div className="text-xs text-gray-500 truncate max-w-xs">{row.description}</div>
          )}
        </div>
      ),
      grow: 2,
    },
    {
      name: 'Categoría',
      selector: row => row.category,
      sortable: true,
      cell: row => <div className="text-sm text-gray-500">{row.category || '-'}</div>,
    },
    {
      name: 'Stock',
      selector: row => row.stock,
      sortable: true,
      cell: row => (
        <div className={`text-sm font-semibold ${row.stock <= row.minStock ? 'text-red-600' : 'text-gray-900'}`}>
          {row.stock}
        </div>
      ),
    },
    {
      name: 'Stock Mínimo',
      selector: row => row.minStock,
      sortable: true,
      cell: row => <div className="text-sm text-gray-500">{row.minStock}</div>,
    },
  ];

  const customStyles = {
    table: {
      style: {
        backgroundColor: 'transparent',
      },
    },
    headRow: {
      style: {
        backgroundColor: 'rgba(249, 250, 251, 0.5)', // gray-50 with opacity
        borderBottomWidth: '1px',
        borderBottomColor: 'rgba(229, 231, 235, 0.5)', // gray-200
      },
    },
    rows: {
      style: {
        backgroundColor: 'transparent',
        '&:not(:last-of-type)': {
          borderBottomStyle: 'solid',
          borderBottomWidth: '1px',
          borderBottomColor: 'rgba(229, 231, 235, 0.5)',
        },
        '&:hover': {
          backgroundColor: 'rgba(243, 244, 246, 0.4)', // gray-100
          transition: 'all 0.2s',
        },
      },
    },
    pagination: {
      style: {
        backgroundColor: 'transparent',
        borderTopWidth: '1px',
        borderTopColor: 'rgba(229, 231, 235, 0.5)',
      },
    },
  };

  return (
    <div className="flex flex-col">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
          Inventario
        </h2>
        <div className="flex gap-2">
          <button
            onClick={exportToExcel}
            className="inline-flex items-center px-4 py-2 border border-green-600 text-sm font-medium rounded-lg text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Excel
          </button>
          <button
            onClick={exportToPDF}
            className="inline-flex items-center px-4 py-2 border border-red-600 text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            PDF
          </button>
          <Link to="/inventory/new" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:-translate-y-0.5 transition-all duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Agregar Ítem
          </Link>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/50 overflow-hidden">
        <div className="p-4">
          {subHeaderComponentMemo}
        </div>
        <DataTable
          columns={columns}
          data={filteredItems}
          pagination
          paginationResetDefaultPage={resetPaginationToggle}
          customStyles={customStyles}
          noDataComponent={<div className="p-4 text-gray-500">No hay ítems para mostrar</div>}
          highlightOnHover
          pointerOnHover
        />
      </div>
    </div>
  );
};

export default InventoryTable;
