import { create } from 'zustand'

const defaultTemplates = [
  {
    id: '1',
    type: 'simple'
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
  updateTemplate: (id, template) =>
    set((state) => ({
      templates: state.templates.map((t) => (t.id === id ? template : t)),
    })),
})) 