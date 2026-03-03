import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Interface que define a estrutura de um alerta (Toast)
interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

// Interface com as funções exportadas pelo contexto
interface ToastContextData {
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

// Cria o contexto global para notificações
const ToastContext = createContext<ToastContextData>({} as ToastContextData);

// Provedor que envolve a aplicação para permitir o uso de notificações
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  // Lista de notificações ativas no ecrã
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Adiciona um novo alerta e programa a sua remoção automática
  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const toastId = Date.now();
    setToasts((prev) => [...prev, { id: toastId, message, type }]);

    // Remove o alerta após 4 segundos
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 4000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Container visual dos alertas flutuantes */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-lg shadow-lg text-white font-medium ${
              toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Hook customizado para aceder ao sistema de notificações
export const useToast = () => useContext(ToastContext);
