import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { useAuth } from '../context/AuthContext';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const { token } = useAuth();
    const [filterText, setFilterText] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/auth/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const filteredItems = users.filter(
        item => item.username && item.username.toLowerCase().includes(filterText.toLowerCase())
    );

    const columns = [
        {
            name: 'Usuario',
            selector: row => row.username,
            sortable: true,
            cell: row => (
                <div className="font-medium text-gray-900">{row.username}</div>
            ),
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
            cell: row => (
                <div className="text-gray-500">{row.email || '-'}</div>
            ),
        },
        {
            name: 'Rol',
            selector: row => row.role,
            sortable: true,
            cell: row => (
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {row.role}
                </span>
            ),
        },
        {
            name: 'Fecha de Registro',
            selector: row => row.createdAt,
            sortable: true,
            cell: row => new Date(row.createdAt).toLocaleDateString('es-ES'),
        }
    ];

    const customStyles = {
        headRow: {
            style: {
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                color: "var(--dt-header-color, #4b5563)",
                fontWeight: "bold"
            }
        },
        rows: {
            style: {
                backgroundColor: "transparent"
            }
        },
        pagination: {
            style: {
                backgroundColor: "transparent"
            }
        }
    };

    return (
        <div className="flex flex-col">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                    Gestión de Usuarios
                </h2>
                <Link
                    to="/users/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Nuevo Usuario
                </Link>
            </div>

            <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/50 overflow-hidden p-4">
                <div className="mb-4">
                    <input
                        type="text"
                        className="block w-full sm:w-64 pl-4 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Buscar usuario..."
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                    />
                </div>
                <DataTable
                    columns={columns}
                    data={filteredItems}
                    pagination
                    customStyles={customStyles}
                    noDataComponent={<div className="p-4 text-gray-500">No hay usuarios registrados</div>}
                    highlightOnHover
                />
            </div>
        </div>
    );
};

export default UserManagement;
