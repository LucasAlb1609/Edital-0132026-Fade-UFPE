import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Search, Plus, Edit2, Trash2, CheckCircle, XCircle, Loader2, X, Filter } from 'lucide-react';
import { api } from '../services/api';
import type { Evento, Participante } from '../types';
import { useToast } from '../contexts/ToastContext';

export const Participantes = () => {
  // Hook para exibir notificações
  const { addToast } = useToast();
  
  // Lista de participantes e eventos
  const [participants, setParticipants] = useState<Participante[]>([]);
  const [availableEvents, setAvailableEvents] = useState<Evento[]>([]);
  
  // Controle de carregamento e buscas
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEventId, setFilterEventId] = useState('');
  const [filterCheckIn, setFilterCheckIn] = useState('');

  // Controle do modal e formulário
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentParticipant, setCurrentParticipant] = useState<Participante>({
    id: '', name: '', email: '', eventId: '', eventName: '', checkIn: false
  });

  // Carrega os dados simultaneamente da API
  const loadData = () => {
    setIsLoading(true);
    Promise.all([api.getParticipantes(), api.getEventos()]).then(([parts, evts]) => {
      setParticipants(parts);
      setAvailableEvents(evts);
      setIsLoading(false);
    });
  };

  // Dispara o carregamento inicial
  useEffect(() => { 
    loadData(); 
  }, []);

  // Abre o modal limpo para um novo cadastro
  const openAddModal = () => {
    setCurrentParticipant({ 
      id: '', name: '', email: '', 
      eventId: availableEvents.length > 0 ? availableEvents[0].id : '', 
      eventName: '', checkIn: false 
    });
    setIsModalOpen(true);
  };

  // Abre o modal com os dados do participante selecionado
  const openEditModal = (participant: Participante) => { 
    setCurrentParticipant({ ...participant }); 
    setIsModalOpen(true); 
  };

  // Valida e salva os dados na API
  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!currentParticipant.name || !currentParticipant.email || !currentParticipant.eventId) {
      addToast('Preencha os dados e vincule a um evento.', 'error');
      return;
    }
    
    setIsSaving(true);
    try {
      await api.salvarParticipante(currentParticipant);
      addToast('Participante guardado com sucesso!', 'success');
      setIsModalOpen(false);
      loadData();
    } catch { 
      addToast('Erro ao guardar participante.', 'error'); 
    } finally { 
      setIsSaving(false); 
    }
  };

  // Remove o participante após confirmação
  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem a certeza que deseja remover este participante?')) return;
    try {
      await api.excluirParticipante(id);
      addToast('Participante removido com sucesso!', 'success');
      loadData();
    } catch { 
      addToast('Erro ao remover participante.', 'error'); 
    }
  };

  // Filtra a lista com base na busca, evento e status
  const filteredParticipants = participants.filter(p => {
    const matchQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       p.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchEvent = filterEventId ? p.eventId === filterEventId : true;
    const matchCheckIn = filterCheckIn === 'true' ? p.checkIn === true : 
                         filterCheckIn === 'false' ? p.checkIn === false : true;

    return matchQuery && matchEvent && matchCheckIn;
  });

  return (
    <div className="p-6 md:p-8 h-full flex flex-col relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Participantes</h1>
        <button onClick={openAddModal} className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={20} className="mr-2" /> Adicionar
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-50 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar nome ou e-mail..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 outline-none" 
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select 
              value={filterEventId} 
              onChange={(e) => setFilterEventId(e.target.value)} 
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">Todos os Eventos</option>
              {availableEvents.map(evt => (
                <option key={evt.id} value={evt.id}>{evt.name}</option>
              ))}
            </select>
          </div>
          <div>
            <select 
              value={filterCheckIn} 
              onChange={(e) => setFilterCheckIn(e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">Status de Check-in (Todos)</option>
              <option value="true">Check-in Realizado</option>
              <option value="false">Pendente</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center p-12"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-gray-600 text-sm border-b border-gray-200">
                  <th className="px-6 py-4 font-medium">Nome</th>
                  <th className="px-6 py-4 font-medium">E-mail</th>
                  <th className="px-6 py-4 font-medium">Evento</th>
                  <th className="px-6 py-4 font-medium">Check-in</th>
                  <th className="px-6 py-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredParticipants.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Nenhum participante encontrado com os filtros atuais.</td></tr>
                ) : (
                  filteredParticipants.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                      <td className="px-6 py-4 text-gray-500">{p.email}</td>
                      <td className="px-6 py-4 text-gray-700">
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded border border-gray-200 truncate inline-block max-w-[200px]" title={p.eventName}>{p.eventName}</span>
                      </td>
                      <td className="px-6 py-4">
                        {p.checkIn ? <span className="inline-flex items-center text-green-600 text-sm font-medium"><CheckCircle size={16} className="mr-1" /> Feito</span> : <span className="inline-flex items-center text-gray-400 text-sm font-medium"><XCircle size={16} className="mr-1" /> Pendente</span>}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button onClick={() => openEditModal(p)} className="text-gray-400 hover:text-blue-600 p-1 mx-1 transition-colors"><Edit2 size={18} /></button>
                        <button onClick={() => handleDelete(p.id)} className="text-gray-400 hover:text-red-600 p-1 mx-1 transition-colors"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">{currentParticipant.id ? 'Editar' : 'Novo'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="p-6 space-y-4">
                <div>
                  <label htmlFor="participantName" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                  <input id="participantName" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" value={currentParticipant.name} onChange={(e) => setCurrentParticipant({...currentParticipant, name: e.target.value})} />
                </div>
                <div>
                  <label htmlFor="participantEmail" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <input id="participantEmail" type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" value={currentParticipant.email} onChange={(e) => setCurrentParticipant({...currentParticipant, email: e.target.value})} />
                </div>
                <div>
                  <label htmlFor="participantEvent" className="block text-sm font-medium text-gray-700 mb-1">Evento</label>
                  <select id="participantEvent" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" value={currentParticipant.eventId} onChange={(e) => setCurrentParticipant({...currentParticipant, eventId: e.target.value})}>
                    <option value="" disabled>Selecione um evento</option>
                    {availableEvents.map(e => <option key={e.id} value={e.id}>{e.name} ({e.status})</option>)}
                  </select>
                </div>
                <div className="pt-2">
                  <label htmlFor="participantCheckIn" className="flex items-center cursor-pointer">
                    <input id="participantCheckIn" type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" checked={currentParticipant.checkIn} onChange={(e) => setCurrentParticipant({...currentParticipant, checkIn: e.target.checked})} />
                    <span className="ml-2 text-sm text-gray-700 font-medium">Realizou Check-in</span>
                  </label>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg">Cancelar</button>
                <button type="submit" disabled={isSaving} className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};