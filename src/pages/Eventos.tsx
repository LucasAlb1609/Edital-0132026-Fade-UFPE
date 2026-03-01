import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit2, Trash2, Settings, Loader2, X } from 'lucide-react';
import { api } from '../services/api';
import type { Evento } from '../types';
import { useToast } from '../contexts/ToastContext';

export const Eventos = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busca, setBusca] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentEvento, setCurrentEvento] = useState<Evento>({
    id: '',
    name: '',
    date: '',
    location: '',
    status: 'Ativo',
  });

  const carregarEventos = () => {
    setIsLoading(true);
    api.getEventos().then((data) => {
      setEventos(data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    carregarEventos();
  }, []);

  const openModalAdd = () => {
    setCurrentEvento({ id: '', name: '', date: '', location: '', status: 'Ativo' });
    setIsModalOpen(true);
  };
  const openModalEdit = (evento: Evento) => {
    setCurrentEvento({ ...evento });
    setIsModalOpen(true);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentEvento.name || !currentEvento.date || !currentEvento.location) {
      addToast('Preencha todos os campos obrigatórios.', 'error');
      return;
    }

    if (currentEvento.status === 'Ativo') {
      const eventDate = new Date(currentEvento.date.replace(' ', 'T'));
      if (eventDate < new Date()) {
        addToast('Um evento "Ativo" não pode ter data no passado.', 'error');
        return;
      }
    }

    setIsSaving(true);
    try {
      await api.salvarEvento(currentEvento);
      addToast('Evento guardado com sucesso!', 'success');
      setIsModalOpen(false);
      carregarEventos();
    } catch {
      // catch vazio para não usar variável
      addToast('Erro ao guardar evento.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem a certeza que deseja remover este evento?')) return;
    try {
      await api.excluirEvento(id);
      addToast('Evento removido com sucesso!', 'success');
      carregarEventos();
    } catch {
      addToast('Erro ao remover evento.', 'error');
    }
  };

  const eventosFiltrados = eventos.filter((evt) =>
    evt.name.toLowerCase().includes(busca.toLowerCase())
  );
  const [datePart, timePart] = currentEvento.date ? currentEvento.date.split(' ') : ['', ''];
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) =>
    setCurrentEvento({ ...currentEvento, date: `${e.target.value} ${timePart || '00:00'}`.trim() });
  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) =>
    setCurrentEvento({ ...currentEvento, date: `${datePart || ''} ${e.target.value}`.trim() });

  return (
    <div className="p-6 md:p-8 h-full flex flex-col relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Gerir Eventos</h1>
        <button
          onClick={openModalAdd}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} className="mr-2" /> Novo Evento
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Pesquisar eventos..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                  <th className="px-6 py-4 font-medium">Nome do Evento</th>
                  <th className="px-6 py-4 font-medium">Data</th>
                  <th className="px-6 py-4 font-medium">Local</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {eventosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Nenhum evento encontrado.
                    </td>
                  </tr>
                ) : (
                  eventosFiltrados.map((evento) => (
                    <tr key={evento.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{evento.name}</td>
                      <td className="px-6 py-4 text-gray-600">{evento.date}</td>
                      <td className="px-6 py-4 text-gray-600">{evento.location}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${evento.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                        >
                          {evento.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => navigate(`/eventos/${evento.id}/checkin`)}
                          className="text-gray-400 hover:text-blue-600 p-1 mx-1 transition-colors"
                          title="Configurar Regras"
                        >
                          <Settings size={18} />
                        </button>
                        <button
                          onClick={() => openModalEdit(evento)}
                          className="text-gray-400 hover:text-blue-600 p-1 mx-1 transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(evento.id)}
                          className="text-gray-400 hover:text-red-600 p-1 mx-1 transition-colors"
                          title="Remover"
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                {currentEvento.id ? 'Editar Evento' : 'Novo Evento'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={currentEvento.name}
                    onChange={(e) => setCurrentEvento({ ...currentEvento, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                    <input
                      type="date"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      value={datePart}
                      onChange={handleDateChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                    <input
                      type="time"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      value={timePart}
                      onChange={handleTimeChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Local</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={currentEvento.location}
                    onChange={(e) =>
                      setCurrentEvento({ ...currentEvento, location: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={currentEvento.status}
                    onChange={(e) =>
                      setCurrentEvento({
                        ...currentEvento,
                        status: e.target.value as 'Ativo' | 'Encerrado',
                      })
                    }
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Encerrado">Encerrado</option>
                  </select>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={18} className="animate-spin mr-2" /> : null} Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
