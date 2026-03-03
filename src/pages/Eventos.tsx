import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit2, Trash2, Settings, Loader2, X, Filter } from 'lucide-react';
import { api } from '../services/api';
import type { Evento } from '../types';
import { useToast } from '../contexts/ToastContext';

// Componente principal para gestão de eventos
export const Eventos = () => {
  // Hooks de roteamento e notificação
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  // Estado de dados e carregamento
  const [events, setEvents] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados para os filtros
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  
  // Controle do modal e formulário
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Evento>({
    id: '', name: '', date: '', location: '', status: 'Ativo'
  });

  // Busca a lista de eventos na API
  const loadEvents = () => {
    setIsLoading(true);
    api.getEventos()
      .then((data) => setEvents(data))
      .catch(() => addToast('Erro ao carregar eventos', 'error'))
      .finally(() => setIsLoading(false));
  };

  // Carrega os dados assim que o componente é montado
  useEffect(() => { 
    loadEvents(); 
  }, []);

  // Prepara o formulário vazio e abre o modal para criação
  const openModalAdd = () => { 
    setCurrentEvent({ id: '', name: '', date: '', location: '', status: 'Ativo' }); 
    setIsModalOpen(true); 
  };
  
  // Preenche o formulário com dados existentes e abre o modal
  const openModalEdit = (eventToEdit: Evento) => { 
    setCurrentEvent({ ...eventToEdit }); 
    setIsModalOpen(true); 
  };

  // Valida e envia os dados do evento para a API
  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!currentEvent.name || !currentEvent.date || !currentEvent.location) {
      addToast('Preencha os campos obrigatórios.', 'error');
      return;
    }

    // Impede a criação de eventos ativos com data no passado
    if (currentEvent.status === 'Ativo') {
      const eventDate = new Date(currentEvent.date.replace(' ', 'T'));
      if (eventDate < new Date()) {
        addToast('Um evento "Ativo" não pode ter data no passado.', 'error');
        return;
      }
    }
    
    setIsSaving(true);
    try {
      await api.salvarEvento(currentEvent);
      addToast(currentEvent.id ? 'Evento atualizado com sucesso!' : 'Evento cadastrado com sucesso!', 'success');
      setIsModalOpen(false);
      loadEvents();
    } catch { 
      addToast('Erro ao guardar o evento.', 'error'); 
    } finally { 
      setIsSaving(false); 
    }
  };

  // Solicita a exclusão do evento à API
  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem a certeza que deseja remover este evento?')) return;
    try {
      await api.excluirEvento(id);
      addToast('Evento removido com sucesso!', 'success');
      loadEvents();
    } catch { 
      addToast('Erro ao remover o evento.', 'error'); 
    }
  };

  // Filtra os eventos com base nos critérios definidos pelo usuário
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

  // Formata a data (YYYY-MM-DD HH:MM) para o padrão de exibição (DD-MM-YYYY HH:MM)
  const formatDateBR = (str: string) => {
    if (!str) return '';
    const [d, t] = str.split(' ');
    const [y, m, day] = d.split('-');
    return `${day}-${m}-${y} ${t || ''}`.trim();
  };

  // Separa a data e a hora para manipulação nos inputs do formulário
  const [datePart, timePart] = currentEvent.date ? currentEvent.date.split(' ') : ['', ''];
  const onDateChange = (e: ChangeEvent<HTMLInputElement>) => setCurrentEvent({ ...currentEvent, date: `${e.target.value} ${timePart || '00:00'}`.trim() });
  const onTimeChange = (e: ChangeEvent<HTMLInputElement>) => setCurrentEvent({ ...currentEvent, date: `${datePart || ''} ${e.target.value}`.trim() });

  return (
    <div className="p-6 md:p-8 h-full flex flex-col relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Gerir Eventos</h1>
        <button 
          onClick={openModalAdd} 
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} className="mr-2" /> Novo Evento
        </button>
      </div>

      {/* Seção de Filtros (Padronizada) */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome do evento..." 
            value={filterName} 
            onChange={(e) => setFilterName(e.target.value)} 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" 
          />
        </div>
        <div className="relative flex-1">
          <Filter className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Filtrar por local..." 
            value={filterLocation} 
            onChange={(e) => setFilterLocation(e.target.value)} 
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" 
          />
        </div>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)} 
          className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none lg:w-48"
        >
          <option value="">Todos os Status</option>
          <option value="Ativo">Ativo</option>
          <option value="Encerrado">Encerrado</option>
        </select>
        <div className="flex gap-2 items-center lg:w-auto">
          <input 
            type="date" 
            title="Data Inicial" 
            value={filterStartDate} 
            onChange={(e) => setFilterStartDate(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
          />
          <span className="text-gray-400">-</span>
          <input 
            type="date" 
            title="Data Final" 
            value={filterEndDate} 
            onChange={(e) => setFilterEndDate(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
          />
        </div>
      </div>

      {/* Tabela de Resultados (Padronizada) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center p-12">
              <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
              <span className="text-gray-500 font-medium">Carregando eventos...</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-200">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Nome do Evento</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Data e Hora</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Local</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Nenhum evento encontrado com os filtros atuais.
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((evt) => (
                    <tr key={evt.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900">{evt.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">{formatDateBR(evt.date)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{evt.location}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${evt.status === 'Ativo' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                          {evt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                        <button 
                          onClick={() => navigate(`/eventos/${evt.id}/checkin`)} 
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors inline-flex items-center" 
                          title="Configurar Regras de Check-in"
                        >
                          <Settings size={18} />
                        </button>
                        <button 
                          onClick={() => openModalEdit(evt)} 
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center" 
                          title="Editar evento"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(evt.id)} 
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center" 
                          title="Remover evento"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal de Cadastro e Edição (Padronizado) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                {currentEvent.id ? <Edit2 size={20} className="text-blue-600"/> : <Plus size={20} className="text-blue-600"/>}
                {currentEvent.id ? 'Editar Evento' : 'Novo Evento'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
              >
                <X size={24}/>
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="p-6 space-y-5 overflow-y-auto">
                <div>
                  <label htmlFor="eventName" className="block text-sm font-bold text-gray-700 mb-1.5">Nome do Evento</label>
                  <input 
                    id="eventName" 
                    type="text" 
                    required
                    placeholder="Ex: Tech Summit 2026"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                    value={currentEvent.name} 
                    onChange={(e) => setCurrentEvent({...currentEvent, name: e.target.value})} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="eventDate" className="block text-sm font-bold text-gray-700 mb-1.5">Data</label>
                    <input 
                      id="eventDate" 
                      type="date" 
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                      value={datePart} 
                      onChange={onDateChange} 
                    />
                  </div>
                  <div>
                    <label htmlFor="eventTime" className="block text-sm font-bold text-gray-700 mb-1.5">Hora</label>
                    <input 
                      id="eventTime" 
                      type="time" 
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                      value={timePart} 
                      onChange={onTimeChange} 
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="eventLocation" className="block text-sm font-bold text-gray-700 mb-1.5">Local</label>
                  <input 
                    id="eventLocation" 
                    type="text" 
                    required
                    placeholder="Ex: Centro de Convenções"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                    value={currentEvent.location} 
                    onChange={(e) => setCurrentEvent({...currentEvent, location: e.target.value})} 
                  />
                </div>
                <div>
                  <label htmlFor="eventStatus" className="block text-sm font-bold text-gray-700 mb-1.5">Status</label>
                  <select 
                    id="eventStatus" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                    value={currentEvent.status} 
                    onChange={(e) => setCurrentEvent({...currentEvent, status: e.target.value as 'Ativo' | 'Encerrado'})}
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Encerrado">Encerrado</option>
                  </select>
                </div>
              </div>
              <div className="px-6 py-5 bg-gray-50 flex justify-end gap-3 border-t border-gray-200">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-5 py-2.5 text-gray-700 font-semibold bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving} 
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center"
                >
                  {isSaving && <Loader2 className="animate-spin mr-2" size={18} />}
                  {isSaving ? 'Salvando...' : (currentEvent.id ? 'Atualizar' : 'Cadastrar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};