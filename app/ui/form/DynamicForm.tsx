import { RegisterOptions, useForm, UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { useFormStore } from "@/app/store/formStore"
import {
  Form,
} from "@/components/ui/form"

import { SimpleForm } from "./fields/SimpleForm"
import { ComplexForm } from "./fields/ComplexForm"

interface Template {
  id: string;
  name: string;
  type: string;
}

interface DynamicFormProps {
  template: Template;
  form: UseFormReturn<FormValues>;
}

interface FormValues {
  username: string;
  gender: string;
  interests: string[];
  education: string;
  newsletter: boolean;
  bio: string;
}

export function DynamicForm({ template, form }: DynamicFormProps) {
  const templates = useFormStore(state => state.templates)
  const currentTemplate = templates.find(t => t.id === "1")
  console.log(currentTemplate) // 获取当前表单值

  return (
    <Form {...form}>
      <form className="space-y-8">
        {template.type === "simple" && <SimpleForm form={form} templateId="1" />}
        {template.type === "complex" && <ComplexForm form={form}></ComplexForm>}
      </form>
    </Form>
  )
} 