import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit2, Trash2, Settings, Loader2, X, Filter } from 'lucide-react';
import { api } from '../services/api';
import type { Evento } from '../types';
import { useToast } from '../contexts/ToastContext';

// Componente para gestão de eventos
export const Eventos = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  // Lista de eventos e estado de carregamento
  const [events, setEvents] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados dos filtros de pesquisa
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  
  // Controle do modal e dados do evento atual
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Evento>({
    id: '', name: '', date: '', location: '', status: 'Ativo'
  });

  // Busca eventos da API simulada
  const loadEvents = () => {
    setIsLoading(true);
    api.getEventos().then((data) => { 
      setEvents(data); 
      setIsLoading(false); 
    });
  };

  // Carrega dados na montagem
  useEffect(() => { loadEvents(); }, []);

  // Prepara modal para novo evento
  const openModalAdd = () => { 
    setCurrentEvent({ id: '', name: '', date: '', location: '', status: 'Ativo' }); 
    setIsModalOpen(true); 
  };
  
  // Prepara modal para edição
  const openModalEdit = (eventToEdit: Evento) => { 
    setCurrentEvent({ ...eventToEdit }); 
    setIsModalOpen(true); 
  };

  // Valida e guarda o evento
  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentEvent.name || !currentEvent.date || !currentEvent.location) {
      return addToast('Preencha os campos obrigatórios.', 'error');
    }

    if (currentEvent.status === 'Ativo') {
      const eventDate = new Date(currentEvent.date.replace(' ', 'T'));
      if (eventDate < new Date()) {
        return addToast('Um evento "Ativo" não pode ter data no passado.', 'error');
      }
    }
    
    setIsSaving(true);
    try {
      await api.salvarEvento(currentEvent);
      addToast('Evento guardado!', 'success');
      setIsModalOpen(false);
      loadEvents();
    } catch { 
      addToast('Erro ao guardar.', 'error'); 
    } finally { 
      setIsSaving(false); 
    }
  };

  // Remove o evento selecionado
  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem a certeza?')) return;
    try {
      await api.excluirEvento(id);
      addToast('Removido!', 'success');
      loadEvents();
    } catch { 
      addToast('Erro.', 'error'); 
    }
  };

  // Lógica de filtragem combinada
  const filteredEvents = events.filter(evt => {
    const matchName = evt.name.toLowerCase().includes(filterName.toLowerCase());
    const matchLocation = evt.location.toLowerCase().includes(filterLocation.toLowerCase());
    const matchStatus = filterStatus ? evt.status === filterStatus : true;
    
    let matchPeriod = true;
    if (filterStartDate || filterEndDate) {
      const dateOnly = evt.date.split(' ')[0];
      if (filterStartDate) matchPeriod = matchPeriod && dateOnly >= filterStartDate;
      if (filterEndDate) matchPeriod = matchPeriod && dateOnly <= filterEndDate;
    }
    return matchName && matchLocation && matchStatus && matchPeriod;
  });

  // Utilitário para formatar exibição da data
  const formatDateBR = (str: string) => {
    if (!str) return '';
    const [d, t] = str.split(' ');
    const [y, m, day] = d.split('-');
    return `${day}-${m}-${y} ${t || ''}`.trim();
  };

  // Gerencia alteração de data/hora no form
  const [datePart, timePart] = currentEvent.date ? currentEvent.date.split(' ') : ['', ''];
  const onDateChange = (e: ChangeEvent<HTMLInputElement>) => setCurrentEvent({ ...currentEvent, date: `${e.target.value} ${timePart || '00:00'}`.trim() });
  const onTimeChange = (e: ChangeEvent<HTMLInputElement>) => setCurrentEvent({ ...currentEvent, date: `${datePart || ''} ${e.target.value}`.trim() });

  return (
    <div className="p-6 md:p-8 h-full flex flex-col relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Gerir Eventos</h1>
        <button onClick={openModalAdd} className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={20} className="mr-2" /> Novo Evento
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
        {/* Painel de Filtros */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Nome..." value={filterName} onChange={(e) => setFilterName(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Local..." value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Todos os Status</option>
            <option value="Ativo">Ativo</option>
            <option value="Encerrado">Encerrado</option>
          </select>
          <div className="flex gap-2 items-center">
            <input type="date" title="Data Inicial" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="date" title="Data Final" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center p-12"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-gray-600 text-sm border-b border-gray-200">
                  <th className="px-6 py-4 font-medium">Nome do Evento</th>
                  <th className="px-6 py-4 font-medium">Data</th>
                  <th className="px-6 py-4 font-medium">Local</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{evt.name}</td>
                    <td className="px-6 py-4 text-gray-600">{formatDateBR(evt.date)}</td>
                    <td className="px-6 py-4 text-gray-600">{evt.location}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${evt.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{evt.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button onClick={() => navigate(`/eventos/${evt.id}/checkin`)} className="text-gray-400 hover:text-blue-600 p-1 mx-1" title="Configurar Regras"><Settings size={18} /></button>
                      <button onClick={() => openModalEdit(evt)} className="text-gray-400 hover:text-blue-600 p-1 mx-1" title="Editar"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(evt.id)} className="text-gray-400 hover:text-red-600 p-1 mx-1" title="Remover"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">{currentEvent.id ? 'Editar' : 'Novo Evento'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="p-6 space-y-4">
                <div>
                  <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input id="eventName" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none" value={currentEvent.name} onChange={(e) => setCurrentEvent({...currentEvent, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                    <input id="eventDate" type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none" value={datePart} onChange={onDateChange} />
                  </div>
                  <div>
                    <label htmlFor="eventTime" className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                    <input id="eventTime" type="time" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none" value={timePart} onChange={onTimeChange} />
                  </div>
                </div>
                <div>
                  <label htmlFor="eventLocation" className="block text-sm font-medium text-gray-700 mb-1">Local</label>
                  <input id="eventLocation" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none" value={currentEvent.location} onChange={(e) => setCurrentEvent({...currentEvent, location: e.target.value})} />
                </div>
                <div>
                  <label htmlFor="eventStatus" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select id="eventStatus" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none" value={currentEvent.status} onChange={(e) => setCurrentEvent({...currentEvent, status: e.target.value as 'Ativo' | 'Encerrado'})}>
                    <option value="Ativo">Ativo</option>
                    <option value="Encerrado">Encerrado</option>
                  </select>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 font-medium">Cancelar</button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};