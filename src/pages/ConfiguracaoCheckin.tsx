import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Plus,
  Save,
  Loader2,
  X,
  ArrowLeft,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Edit2,
  Trash2,
} from 'lucide-react';
import { api } from '../services/api';
import type { CheckInRule } from '../types';
import { useToast } from '../contexts/ToastContext';
import { hasConflicts, hasAtLeastOneActive } from '../utils/checkinRules'; // Importação das lógicas puras

export const ConfiguracaoCheckin = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [regras, setRegras] = useState<CheckInRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRule, setCurrentRule] = useState<CheckInRule>({
    id: '',
    name: '',
    minutesBefore: 60,
    minutesAfter: 30,
    isMandatory: false,
    isActive: true,
  });

  useEffect(() => {
    if (id) {
      api.getRegrasCheckin(id).then((data) => {
        setRegras(data);
        setIsLoading(false);
      });
    }
  }, [id]);

  const openModalForAdd = () => {
    setCurrentRule({
      id: Date.now().toString(),
      name: '',
      minutesBefore: 60,
      minutesAfter: 30,
      isMandatory: false,
      isActive: true,
    });
    setIsModalOpen(true);
  };
  const openModalForEdit = (rule: CheckInRule) => {
    setCurrentRule({ ...rule });
    setIsModalOpen(true);
  };

  const handleSaveRule = () => {
    if (!currentRule.name.trim()) return addToast('O nome é obrigatório.', 'error');
    const novasRegras = [...regras];
    const index = novasRegras.findIndex((r) => r.id === currentRule.id);
    if (index >= 0) novasRegras[index] = currentRule;
    else novasRegras.push(currentRule);

    if (!hasAtLeastOneActive(novasRegras))
      return addToast('Deve existir pelo menos uma regra ativa.', 'error');
    if (hasConflicts(novasRegras))
      return addToast('Conflito de horários entre regras obrigatórias.', 'error');

    setRegras(novasRegras);
    setIsModalOpen(false);
    addToast('Regra aplicada temporariamente.', 'info');
  };

  const toggleRegraStatus = (ruleId: string) => {
    const novasRegras = regras.map((r) => (r.id === ruleId ? { ...r, isActive: !r.isActive } : r));
    if (!hasAtLeastOneActive(novasRegras))
      return addToast('Não é possível desativar a última regra.', 'error');
    if (hasConflicts(novasRegras)) return addToast('Conflito de horários!', 'error');
    setRegras(novasRegras);
  };

  const deleteRegra = (ruleId: string) => {
    const novasRegras = regras.filter((r) => r.id !== ruleId);
    if (!hasAtLeastOneActive(novasRegras))
      return addToast('Não pode remover a última regra.', 'error');
    setRegras(novasRegras);
    addToast('Regra removida.', 'info');
  };

  const salvarAlteracoesNaAPI = async () => {
    if (!id) return;
    setIsSaving(true);
    try {
      await api.salvarRegrasCheckin(id, regras);
      addToast('Regras guardadas com sucesso!', 'success');
    } catch {
      addToast('Erro.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading)
    return (
      <div className="h-full flex justify-center items-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );

  return (
    <div className="p-6 md:p-8 h-full flex flex-col relative">
      <div
        className="flex items-center text-sm text-gray-500 mb-4 cursor-pointer hover:text-blue-600"
        onClick={() => navigate('/eventos')}
      >
        <ArrowLeft size={16} className="mr-1" /> Voltar para Eventos
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Regras de Check-in</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={openModalForAdd}
            className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg"
          >
            <Plus size={20} className="mr-2" /> Nova Regra
          </button>
          <button
            onClick={salvarAlteracoesNaAPI}
            disabled={isSaving}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            {isSaving ? (
              <Loader2 size={20} className="animate-spin mr-2" />
            ) : (
              <Save size={20} className="mr-2" />
            )}{' '}
            Guardar Alterações
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {regras.map((regra) => (
          <div
            key={regra.id}
            className={`bg-white rounded-xl shadow-sm border ${regra.isActive ? 'border-gray-200' : 'border-gray-200 opacity-60'} p-5 flex flex-col`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                {regra.isMandatory ? (
                  <ShieldAlert
                    size={20}
                    className={regra.isActive ? 'text-red-500' : 'text-gray-400'}
                  />
                ) : (
                  <CheckCircle2
                    size={20}
                    className={regra.isActive ? 'text-green-500' : 'text-gray-400'}
                  />
                )}
                <h3 className="font-semibold text-gray-900 truncate" title={regra.name}>
                  {regra.name}
                </h3>
              </div>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={regra.isActive}
                    onChange={() => toggleRegraStatus(regra.id)}
                  />
                  <div
                    className={`block w-10 h-6 rounded-full transition-colors ${regra.isActive ? 'bg-blue-500' : 'bg-gray-300'}`}
                  ></div>
                  <div
                    className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${regra.isActive ? 'transform translate-x-4' : ''}`}
                  ></div>
                </div>
              </label>
            </div>
            <div className="flex-1 space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <Clock size={16} className="mr-2 text-gray-400" />
                <span>
                  Liberta <b>{regra.minutesBefore} min</b> antes
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock size={16} className="mr-2 text-gray-400" />
                <span>
                  Encerra <b>{regra.minutesAfter} min</b> depois
                </span>
              </div>
              <div className="flex items-center text-sm">
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${regra.isMandatory ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'}`}
                >
                  {regra.isMandatory ? 'Obrigatório' : 'Opcional'}
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
              <button
                onClick={() => openModalForEdit(regra)}
                className="text-gray-500 hover:text-blue-600 p-1"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => deleteRegra(regra.id)}
                className="text-gray-500 hover:text-red-600 p-1"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Configurar Regra</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Regra
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={currentRule.name}
                  onChange={(e) => setCurrentRule({ ...currentRule, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Liberar check-in
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      className="w-full pl-3 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      value={currentRule.minutesBefore}
                      onChange={(e) =>
                        setCurrentRule({ ...currentRule, minutesBefore: Number(e.target.value) })
                      }
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 text-sm">
                      min antes
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Encerrar check-in
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      className="w-full pl-3 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      value={currentRule.minutesAfter}
                      onChange={(e) =>
                        setCurrentRule({ ...currentRule, minutesAfter: Number(e.target.value) })
                      }
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 text-sm">
                      min depois
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={currentRule.isMandatory}
                    onChange={(e) =>
                      setCurrentRule({ ...currentRule, isMandatory: e.target.checked })
                    }
                  />
                  <span className="ml-2 text-sm text-gray-700 font-medium">Regra Obrigatória</span>
                </label>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveRule}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg"
              >
                Aplicar Regra
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
