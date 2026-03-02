import { useState, useEffect } from 'react';
import { Calendar, Users, Clock, MapPin } from 'lucide-react';
import { api } from '../services/api';
import type { Evento } from '../types';

// Componente principal do Dashboard
export const Dashboard = () => {
  // Armazena a contagem total de eventos e participantes
  const [stats, setStats] = useState({ events: 0, participants: 0 });
  
  // Armazena a lista dos próximos eventos ativos
  const [upcomingEvents, setUpcomingEvents] = useState<Evento[]>([]);
  
  // Efeito executado ao montar o componente para carregar os dados
  useEffect(() => {
    // Busca os dados da API e processa as estatísticas e próximos eventos
    const loadDashboardData = async () => {
      // Retorna os dados simulados de eventos e participantes
      const [eventsData, participantsData] = await Promise.all([
        api.getEventos(),
        api.getParticipantes()
      ]);
      
      // Atualiza o estado com as quantidades totais
      setStats({ events: eventsData.length, participants: participantsData.length });
      
      // Filtra a lista de eventos para manter apenas os com status 'Ativo'
      const activeEvents = eventsData.filter(evt => evt.status === 'Ativo');
      
      // Ordena os eventos ativos por data de forma crescente (mais próximos primeiro)
      activeEvents.sort((a, b) => {
        // Converte a string de data do evento A para timestamp
        const dateA = new Date(a.date.replace(' ', 'T')).getTime();
        // Converte a string de data do evento B para timestamp
        const dateB = new Date(b.date.replace(' ', 'T')).getTime();
        return dateA - dateB;
      });
      
      // Atualiza o estado pegando apenas os 3 eventos mais próximos
      setUpcomingEvents(activeEvents.slice(0, 3));
    };

    loadDashboardData();
  }, []);

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Visão Geral</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total de Eventos</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.events}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg"><Calendar className="text-blue-600" size={24}/></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total de Participantes</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.participants}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg"><Users className="text-green-600" size={24}/></div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-4">Próximos Eventos</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {upcomingEvents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Nenhum evento ativo programado para o futuro.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {upcomingEvents.map(event => (
              <li key={event.id} className="p-4 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{event.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1 gap-4">
                    <span className="flex items-center"><Clock size={14} className="mr-1" /> {event.date}</span>
                    <span className="flex items-center"><MapPin size={14} className="mr-1" /> {event.location}</span>
                  </div>
                </div>
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Ativo
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};