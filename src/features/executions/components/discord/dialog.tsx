'use client';

import { zodResolver } from '@hookform/resolvers/zod';
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
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: 'Variable name is required' })
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
      message:
        'Variable name must start with a letter or underscore and container only letters, numbers and underscores',
    }),
  username: z.string().optional(),
  content: z.string().min(1, { message: 'Content is required' }).max(2000, {
    message: 'Content must be at most 2000 characters',
  }),
  webhookUrl: z.string().min(1, { message: 'Webhook URL is required' }),
});

export type DiscordFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: DiscordFormValues) => void;
  defaultValues?: Partial<DiscordFormValues>;
}

export const DiscordDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const form = useForm<DiscordFormValues>({
    defaultValues: {
      variableName: defaultValues.variableName || '',
      username: defaultValues.username || '',
      content: defaultValues.content || '',
      webhookUrl: defaultValues.webhookUrl || '',
    },
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || '',
        username: defaultValues.username || '',
        content: defaultValues.content || '',
        webhookUrl: defaultValues.webhookUrl || '',
      });
    }
  }, [open, defaultValues, form]);

  const watchVariableName = form.watch('variableName') || 'myDiscord';

  const handleSubmit = (values: DiscordFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Discord Configuration</DialogTitle>
          <DialogDescription>
            Configure the Discord webhook settings for this node.
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
                    <Input {...field} placeholder="myDiscord" />
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
              name="webhookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Webhook URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://discord.com/api/webhooks/..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Get this from Discord: Channel Settings -&gt; Integrations
                    -&gt; Webhooks -&gt; New Webhook
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={'Summary: {{myDiscord.text}}'}
                      className="min-h-[60px] font-mono text-sm"
                    />
                  </FormControl>
                  <FormDescription>
                    The message to send. Use {'{{variables}}'} for simple values
                    or {'{{json variables}}'} to stringify objects.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bot Username (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={'Workflow Bot'}
                      className="min-h-[60px] font-mono text-sm"
                    />
                  </FormControl>
                  <FormDescription>
                    Override the webhook's default username.
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
