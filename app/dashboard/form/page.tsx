'use client'

// 假设DynamicForm和useFormStore的路径已更正
import { DynamicForm } from '../../ui/form/DynamicForm'
import { useFormStore } from '../../store/formStore'

export default function FormPage() {
  const templates = useFormStore((state:any) => state.templates as any)
  const addTemplate = useFormStore((state:any) => state.addTemplate)

  const handleSubmit = (data: any) => {
    console.log('表单提交数据:', data)
    // 这里处理表单提交逻辑
  }

  const handleAddForm = () => {
    const newTemplate = {
      id: Date.now().toString(), // 使用时间戳作为临时ID
      type: 'complex'
    }
    addTemplate(newTemplate)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">动态表单</h1>
        <button 
          onClick={handleAddForm}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          添加新表单
        </button>
      </div>
      <div className="space-y-8">
        {templates.map((template) => (
          <div key={template.id} className="bg-white p-6 rounded-lg shadow">
            <DynamicForm template={template} onSubmit={handleSubmit} />
          </div>
        ))}
      </div>
    </div>
  )
}
