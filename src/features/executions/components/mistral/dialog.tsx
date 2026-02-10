'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCredentialsByType } from '@/fetures/credentials/hooks/use-credentials';
import { CredentialType } from '@/generated/prisma/enums';

export const AVAILABLE_MODELS = [
  'ministral-3b-latest',
  'ministral-8b-latest',
  'mistral-large-latest',
  'mistral-medium-latest',
  'mistral-medium-2508',
  'mistral-medium-2505',
  'mistral-small-latest',
  'pixtral-large-latest',
  'magistral-small-2507',
  'magistral-medium-2507',
  'magistral-small-2506',
  'magistral-medium-2506',
  'pixtral-12b-2409',
  'open-mistral-7b',
  'open-mixtral-8x7b',
  'open-mixtral-8x22b',
] as const;

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: 'Variable name is required' })
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
      message:
        'Variable name must start with a letter or underscore and container only letters, numbers and underscores',
    }),
  model: z.enum(AVAILABLE_MODELS),
  credentialId: z.string().min(1, { message: 'Credential is required' }),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, { message: 'User prompt is required' }),
});

export type MistralFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: MistralFormValues) => void;
  defaultValues?: Partial<MistralFormValues>;
}

export const MistralDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const { data: credentials, isLoading: isLoadingCredentials } =
    useCredentialsByType(CredentialType.MISTRAL);

  const form = useForm<MistralFormValues>({
    defaultValues: {
      variableName: defaultValues.variableName || '',
      model: defaultValues.model || AVAILABLE_MODELS[0],
      credentialId: defaultValues.credentialId || '',
      systemPrompt: defaultValues.systemPrompt || '',
      userPrompt: defaultValues.userPrompt || '',
    },
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || '',
        model: defaultValues.model || AVAILABLE_MODELS[0],
        credentialId: defaultValues.credentialId || '',
        systemPrompt: defaultValues.systemPrompt || '',
        userPrompt: defaultValues.userPrompt || '',
      });
    }
  }, [open, defaultValues, form]);

  const watchVariableName = form.watch('variableName') || 'myApiCall';

  const handleSubmit = (values: MistralFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mistral</DialogTitle>
          <DialogDescription>
            Configure settings for the Mistral node.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 mt-4"
          >
            <FormField
              control={form.control}
              name="variableName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variable Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="myApiCall" />
                  </FormControl>
                  <FormDescription>
                    Use this name to reference the result in other nodes:{' '}
                    {`{{${watchVariableName}.text}}`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="credentialId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mistral Credential</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingCredentials || !credentials?.length}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a credential" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {credentials?.map((credential) => (
                        <SelectItem key={credential.id} value={credential.id}>
                          <div className="flex items-center gap-2">
                            <Image
                              src="/logos/mistral.svg"
                              alt={`${credential.name} Logo`}
                              width={16}
                              height={16}
                            />
                            {credential.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {AVAILABLE_MODELS.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The Mistral model to use for completion.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="systemPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Prompt (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={
                        'You are a helpful assistant that provides concise answers.'
                      }
                      className="min-h-[60px] font-mono text-sm"
                    />
                  </FormControl>
                  <FormDescription>
                    Sets the behavior of the assistant. Use {'{{variables}}'}
                    for simple values or {'{{json variables}}'} to stringify
                    objects.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={
                        'Summarize this text: {{json httpResponse.data}}'
                      }
                      className="min-h-[60px] font-mono text-sm"
                    />
                  </FormControl>
                  <FormDescription>
                    The prompt to send to the AI. Use {'{{variables}}'}
                    for simple values or {'{{json variables}}'} to stringify
                    objects.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
