'use client'

import { DynamicForm } from '../../ui/form/DynamicForm'
import { useFormStore } from '../../store/formStore'
import { UseFormReturn, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"

export default function FormPage() {
  const templates = useFormStore((state:any) => state.templates as any)
  const addTemplate = useFormStore((state:any) => state.addTemplate)
  
  const form = useForm({
    defaultValues: {
      username: '',
      gender: '',
      interests: [],
      education: '',
      newsletter: false,
      bio: ''
    },
  });

  const onSubmit = async (data: any) => {
    try {
      // 这里添加您的提交逻辑
      console.log('表单提交数据:', data)
      toast.success("表单提交成功！")
    } catch (error) {
      toast.error("表单提交失败，请重试")
    }
  };

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
          <div key={template.id} className="bg-white">
            <DynamicForm 
              template={template} 
              form={form}
            />
          </div>
        ))}
        <Button 
          type="submit" 
          onClick={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "提交中..." : "提交"}
        </Button>
        
        {/* 显示整体表单错误 */}
        {Object.keys(form.formState.errors).length > 0 && (
          <div className="text-red-500 mt-4">
            {Object.entries(form.formState.errors).map(([key, error]) => (
              <p key={key}>{error?.message as string}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
