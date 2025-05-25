'use client';

import {useForm} from 'react-hook-form';
import {Button} from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {Input} from './ui/input';
import {Label} from './ui/label';
import {zodResolver} from '@hookform/resolvers/zod';
import {RequestFormValues, requestSchema} from '@/types/app/components/dialog';
import {useCreateHelpRequestMutation} from '@/hooks/queries/help-requests/useCreateHelpRequestMutation';
import {useAuth} from '@/hooks/useAuth';
import {useState} from 'react';

const RequestDialog = () => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
  });

  const {mutate: createHelpRequest, isPending} = useCreateHelpRequestMutation();
  const {userId} = useAuth();

  const onSubmit = (data: RequestFormValues) => {
    createHelpRequest({...data, user_id: userId});
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button asChild>
          <span className="cursor-pointer">Create Request</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Help Request</DialogTitle>
          <DialogDescription>
            Please fill out the form below to create a new help request.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2.5">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="City"
                {...register('city', {required: true})}
              />
              {errors.city && (
                <span className="text-red-500 text-xs">City is required</span>
              )}
            </div>
            <div className="grid gap-2.5">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="Category"
                {...register('category', {required: true})}
              />
              {errors.category && (
                <span className="text-red-500 text-xs">
                  Category is required
                </span>
              )}
            </div>
            <div className="grid gap-2.5">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                placeholder="Describe your request"
                className="border rounded-md p-2"
                rows={4}
                {...register('description', {required: true})}
              />
              {errors.description && (
                <span className="text-red-500 text-xs">
                  Description is required
                </span>
              )}
            </div>
          </div>
          <Button
            type="submit"
            className="mt-4 cursor-pointer"
            disabled={isPending}
          >
            {isPending ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDialog;
