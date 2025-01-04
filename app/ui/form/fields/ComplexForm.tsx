import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

interface ComplexFormProps {
    form: any;
}

export function ComplexForm({ form }: ComplexFormProps) {
  return (
    <>
        <FormField
          control={form.control}
          name="education"
          render={({ field }) => (
            <FormItem>
              <FormLabel>学历</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder={''} />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      { value: 'highschool', label: '高中' },
                      { value: 'bachelor', label: '本科' },
                      { value: 'master', label: '硕士' },
                      { value: 'phd', label: '博士' }
                    ].map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newsletter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>订阅新闻</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>个人简介</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={'请简单介绍一下自己'}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
    </>
  )
} 