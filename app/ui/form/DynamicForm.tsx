import { RegisterOptions, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
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
  onSubmit: (data: any) => void;
}

interface FormValues {
  username: string;
  gender: string;
  interests: string[];
  education: string;
  newsletter: boolean;
  bio: string;
}

export function DynamicForm({ template, onSubmit }: DynamicFormProps) {
  const form = useForm<FormValues>({
    defaultValues: {
      username: '',
      gender: '',
      interests: [],
      education: '',
      newsletter: false,
      bio: ''
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {template.type === "simple" && <SimpleForm form={form}></SimpleForm>}
        {template.type === "complex" && <ComplexForm form={form}></ComplexForm>}
        <Button type="submit">提交</Button>
      </form>
    </Form>
  )
} 