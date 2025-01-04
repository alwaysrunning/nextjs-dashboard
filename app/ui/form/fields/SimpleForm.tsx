import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

interface SimpleFormProps {
    form: any;
}

export function SimpleForm({ form }: SimpleFormProps) {
  return (
    <>
        <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
            <FormItem>
                <FormLabel>用户名</FormLabel>
                <FormControl>
                <Input placeholder="shadcn" {...field} />
                </FormControl>
            </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
            <FormItem>
                <FormLabel>性别</FormLabel>
                <FormControl>
                <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value || ''}
                    defaultValue={field.value || ''}
                >
                    {[
                    { value: 'male', label: '男' },
                    { value: 'female', label: '女' },
                    { value: 'other', label: '其他' }
                    ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <label htmlFor={option.value}>{option.label}</label>
                    </div>
                    ))}
                </RadioGroup>
                </FormControl>
            </FormItem>
            )}
        />
        <FormField
          control={form.control}
          name="interests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>兴趣爱好</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-2">
                  {[
                    { value: 'reading', label: '阅读' },
                    { value: 'sports', label: '运动' },
                    { value: 'music', label: '音乐' }
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        checked={field.value?.includes(option.value)}
                        onCheckedChange={(checked) => {
                          const values = new Set(field.value || []);
                          if (checked) {
                            values.add(option.value);
                          } else {
                            values.delete(option.value);
                          }
                          field.onChange(Array.from(values));
                        }}
                      />
                      <label>{option.label}</label>
                    </div>
                  ))}
                </div>
              </FormControl>
            </FormItem>
          )}
        />
    </>
  )
} 