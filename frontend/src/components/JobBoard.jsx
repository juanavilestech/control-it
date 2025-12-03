import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    apiRequest('/jobs')
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error('Error fetching jobs:', err));
  }, []);

<<<<<<< HEAD
  const formatDate = (dateString) => {
    // Parse the date string correctly to avoid timezone issues
    const date = new Date(dateString);
    // Add timezone offset to get the correct local date
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    
    return localDate.toLocaleDateString('es-AR', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
=======
  const exportToExcel = () => {
    const data = jobs.map(job => ({
      'Título': job.title,
      'Descripción': job.description || '',
      'Estado': job.status.name,
      'Tipo de Servicio': job.serviceType.name,
      'Fecha': new Date(job.date).toLocaleDateString('es-ES')
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Trabajos');

    // Auto-size columns
    const maxWidth = data.reduce((w, r) => Math.max(w, r['Título'].length), 10);
    ws['!cols'] = [
      { wch: maxWidth },
      { wch: 30 },
      { wch: 15 },
      { wch: 20 },
      { wch: 12 }
    ];

    XLSX.writeFile(wb, `Trabajos_${new Date().toLocaleDateString('es-ES').replace(/\//g, '-')}.xlsx`);
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();

      // Header
      doc.setFontSize(18);
      doc.text('Reporte de Trabajos', 14, 20);
      doc.setFontSize(10);
      doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}`, 14, 28);

      // Table
      const tableData = jobs.map(job => [
        job.title,
        job.status.name,
        job.serviceType.name,
        new Date(job.date).toLocaleDateString('es-ES')
      ]);

      autoTable(doc, {
        startY: 35,
        head: [['Título', 'Estado', 'Tipo de Servicio', 'Fecha']],
        body: tableData,
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' }
      });

      doc.save(`Trabajos_${new Date().toLocaleDateString('es-ES').replace(/\//g, '-')}.pdf`);
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      alert('Error al generar el PDF: ' + error.message);
    }
>>>>>>> 0618c54db50123ddadc7a5a7935dfe77de83a49f
  };

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex justify-between items-center gap-3">
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
        </div>
        <Link to="/jobs/new" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Nuevo Trabajo
        </Link>
      </div>
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Editar</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{job.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {job.status.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(job.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/jobs/${job.id}/edit`} className="text-indigo-600 hover:text-indigo-900">Editar</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobBoard;
