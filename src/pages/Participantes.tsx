import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Search, Plus, Edit2, Trash2, CheckCircle, XCircle, Loader2, X, Filter } from 'lucide-react';
import { api } from '../services/api';
import type { Evento, Participante } from '../types';
import { useToast } from '../contexts/ToastContext';

// Componente principal para a gestão de participantes
export const Participantes = () => {
  // Hook para exibir notificações de sucesso ou erro na tela
  const { addToast } = useToast();
  
  // Armazena a lista de participantes carregada da API
  const [participants, setParticipants] = useState<Participante[]>([]);
  
  // Armazena a lista de eventos disponíveis para o formulário e filtros
  const [availableEvents, setAvailableEvents] = useState<Evento[]>([]);
  
  // Controla a exibição do ícone de carregamento durante requisições iniciais
  const [isLoading, setIsLoading] = useState(true);
  
  // Armazena o termo de busca digitado pelo usuário
  const [searchQuery, setSearchQuery] = useState('');
  
  // Armazena o ID do evento selecionado no filtro lateral
  const [filterEventId, setFilterEventId] = useState('');
  
  // Armazena o status de check-in selecionado no filtro lateral
  const [filterCheckIn, setFilterCheckIn] = useState('');

  // Controla a visibilidade do modal de criação/edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Controla o estado de bloqueio do botão durante o salvamento
  const [isSaving, setIsSaving] = useState(false);
  
  // Armazena os dados do participante atual sendo criado ou editado
  const [currentParticipant, setCurrentParticipant] = useState<Participante>({
    id: '', name: '', email: '', eventId: '', eventName: '', checkIn: false
  });

  // Busca a lista de participantes e eventos simultaneamente na API
  const loadData = () => {
    setIsLoading(true);
    Promise.all([api.getParticipantes(), api.getEventos()])
      .then(([parts, evts]) => {
        setParticipants(parts);
        setAvailableEvents(evts);
      })
      .catch(() => addToast('Erro ao carregar dados', 'error'))
      .finally(() => setIsLoading(false));
  };

  // Executa o carregamento dos dados assim que o componente é montado
  useEffect(() => {
    loadData();
  }, []);

  // Filtra a lista de participantes em tempo real com base na busca e nos selects
  const filteredParticipants = participants.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEvent = !filterEventId || p.eventId === filterEventId;
    const matchesCheckIn = filterCheckIn === '' || 
                          (filterCheckIn === 'done' ? p.checkIn : !p.checkIn);
    
    return matchesSearch && matchesEvent && matchesCheckIn;
  });

  // Prepara o estado do formulário para inserir um novo participante e abre o modal
  const handleAddClick = () => {
    setCurrentParticipant({ id: '', name: '', email: '', eventId: '', eventName: '', checkIn: false });
    setIsModalOpen(true);
  };

  // Preenche o formulário com os dados do participante selecionado e abre o modal
  const handleEditClick = (participant: Participante) => {
    setCurrentParticipant({ ...participant });
    setIsModalOpen(true);
  };

  // Solicita a exclusão do participante na API e atualiza a lista em tela
  const handleDeleteClick = async (id: string) => {
    if (!confirm('Deseja realmente remover este participante?')) return;
    
    try {
      await api.excluirParticipante(id);
      addToast('Participante removido com sucesso', 'success');
      loadData();
    } catch (error) {
      addToast('Erro ao remover participante', 'error');
    }
  };

  // Envia os dados do formulário para a API para criação ou atualização
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await api.salvarParticipante(currentParticipant);
      addToast(currentParticipant.id ? 'Participante atualizado com sucesso' : 'Participante cadastrado com sucesso', 'success');
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      addToast('Erro ao salvar participante', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Participantes</h1>
        <button 
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} /> Novo Participante
        </button>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <Filter className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <select 
              className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
              value={filterEventId}
              onChange={(e) => setFilterEventId(e.target.value)}
            >
              <option value="">Todos os Eventos</option>
              {availableEvents.map(event => (
                <option key={event.id} value={event.id}>{event.name}</option>
              ))}
            </select>
          </div>
          <select 
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none flex-1 md:w-48"
            value={filterCheckIn}
            onChange={(e) => setFilterCheckIn(e.target.value)}
          >
            <option value="">Todos os Status</option>
            <option value="done">Check-in Realizado</option>
            <option value="pending">Pendente</option>
          </select>
        </div>
      </div>

      {/* Tabela de Resultados */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
          <span className="text-gray-500 font-medium">Carregando participantes...</span>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-200">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Participante</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Evento Vinculado</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Status do Check-in</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredParticipants.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Nenhum participante encontrado com os filtros atuais.
                  </td>
                </tr>
              ) : (
                filteredParticipants.map(participant => (
                  <tr key={participant.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{participant.name}</div>
                      <div className="text-sm text-gray-500">{participant.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{participant.eventName}</td>
                    <td className="px-6 py-4 text-center">
                      {participant.checkIn ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                          <CheckCircle size={14} className="mr-1.5" /> Feito
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <XCircle size={14} className="mr-1.5" /> Pendente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleEditClick(participant)} 
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors inline-flex items-center"
                        title="Editar participante"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(participant.id)} 
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors inline-flex items-center"
                        title="Remover participante"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Cadastro e Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                {currentParticipant.id ? <Edit2 size={20} className="text-blue-600"/> : <Plus size={20} className="text-blue-600"/>}
                {currentParticipant.id ? 'Editar Participante' : 'Novo Participante'}
              </h3>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-5 overflow-y-auto">
              <div>
                <label htmlFor="p-name" className="block text-sm font-bold text-gray-700 mb-1.5">Nome Completo</label>
                <input 
                  id="p-name"
                  required
                  placeholder="Ex: João da Silva"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={currentParticipant.name}
                  onChange={(e) => setCurrentParticipant({...currentParticipant, name: e.target.value})}
                />
              </div>
              
              <div>
                <label htmlFor="p-email" className="block text-sm font-bold text-gray-700 mb-1.5">E-mail</label>
                <input 
                  id="p-email"
                  type="email"
                  required
                  placeholder="Ex: joao@email.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={currentParticipant.email}
                  onChange={(e) => setCurrentParticipant({...currentParticipant, email: e.target.value})}
                />
              </div>
              
              <div>
                <label htmlFor="p-event" className="block text-sm font-bold text-gray-700 mb-1.5">Vincular ao Evento</label>
                <select 
                  id="p-event"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all"
                  value={currentParticipant.eventId}
                  onChange={(e) => setCurrentParticipant({...currentParticipant, eventId: e.target.value})}
                >
                  <option value="" disabled>Selecione um evento na lista...</option>
                  {availableEvents.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
                <p className="text-xs text-gray-500 mt-1.5">A alteração do evento transferirá o participante imediatamente.</p>
              </div>
              
              <div className="pt-3 pb-1 border-t border-gray-100">
                <label className="flex items-center cursor-pointer group p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox"
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-0 transition-all cursor-pointer"
                      checked={currentParticipant.checkIn}
                      onChange={(e) => setCurrentParticipant({...currentParticipant, checkIn: e.target.checked})}
                    />
                  </div>
                  <div className="ml-3">
                    <span className="block text-sm font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                      Status de Check-in
                    </span>
                    <span className="block text-xs text-gray-500">
                      Marque se o participante já confirmou presença no evento.
                    </span>
                  </div>
                </label>
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
                {isSaving ? 'Salvando...' : (currentParticipant.id ? 'Atualizar' : 'Cadastrar')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};