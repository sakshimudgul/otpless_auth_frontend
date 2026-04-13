import { create } from 'zustand';

export const useClientStore = create((set) => ({
  clients: [],
  setClients: (clients) => set({ clients }),
  addClient: (client) => set((state) => ({ 
    clients: [...state.clients, client] 
  })),
  removeClient: (clientId) => set((state) => ({ 
    clients: state.clients.filter(c => c.id !== clientId) 
  })),
  updateClient: (clientId, updatedData) => set((state) => ({
    clients: state.clients.map(client => 
      client.id === clientId ? { ...client, ...updatedData } : client
    )
  })),
  clearClients: () => set({ clients: [] }),
}));