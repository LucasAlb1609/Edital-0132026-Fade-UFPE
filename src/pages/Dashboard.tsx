import { useState, useEffect } from 'react';
import { Calendar, Users } from 'lucide-react';
import { api } from '../services/api';

export const Dashboard = () => {
  const [stats, setStats] = useState({ eventos: 0, participantes: 0 });

  useEffect(() => {
    Promise.all([api.getEventos(), api.getParticipantes()]).then(([evts, parts]) => {
      setStats({ eventos: evts.length, participantes: parts.length });
    });
  }, []);

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Visão Geral</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total de Eventos</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.eventos}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Calendar className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total de Participantes</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.participantes}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <Users className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
