import { create } from 'zustand'

interface FormTemplate {
  id: string;
  type: string;
  username?: string;
  gender?: string;
  interests?: string[];
  
}

const defaultTemplates: FormTemplate[] = [
  {
    id: '1',
    type: 'simple',
    username: '',
    gender: '',
    interests: [] 
  },
  {
    id: '2',
    type: 'complex',
    username: '',
    gender: '',
    interests: [] 
  }
]

export const useFormStore = create((set) => ({
  templates: defaultTemplates,
  addTemplate: (template) =>
    set((state) => ({
      templates: [...state.templates, template],
    })),
  removeTemplate: (id) =>
    set((state) => ({
      templates: state.templates.filter((t) => t.id !== id),
    })),
  updateTemplate: (id: string, template) =>
    set((state) => ({
      templates: state.templates.map((t) => 
        t.id === id ? { ...t, ...template } : t
      ),
    }))
})) 