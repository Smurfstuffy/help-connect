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
      <DialogTrigger asChild>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-10 px-4 py-2 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200">
          <span className="flex items-center gap-2">
            <span className="text-lg">➕</span>
            Create Request
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">📝</span>
            Create a New Help Request
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Please fill out the form below to create a new help request.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2.5">
              <Label htmlFor="city" className="flex items-center gap-2">
                <span className="text-lg">📍</span>
                City
              </Label>
              <Input
                id="city"
                placeholder="Enter your city"
                className="focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                {...register('city', {required: true})}
              />
              {errors.city && (
                <span className="text-red-500 text-xs flex items-center gap-1">
                  <span>⚠️</span>
                  City is required
                </span>
              )}
            </div>
            <div className="grid gap-2.5">
              <Label htmlFor="category" className="flex items-center gap-2">
                <span className="text-lg">🏷️</span>
                Category
              </Label>
              <Input
                id="category"
                placeholder="Enter category (e.g., Food, Transportation)"
                className="focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                {...register('category', {required: true})}
              />
              {errors.category && (
                <span className="text-red-500 text-xs flex items-center gap-1">
                  <span>⚠️</span>
                  Category is required
                </span>
              )}
            </div>
            <div className="grid gap-2.5">
              <Label htmlFor="description" className="flex items-center gap-2">
                <span className="text-lg">📝</span>
                Description
              </Label>
              <textarea
                id="description"
                placeholder="Describe your request in detail..."
                className="border rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                rows={4}
                {...register('description', {required: true})}
              />
              {errors.description && (
                <span className="text-red-500 text-xs flex items-center gap-1">
                  <span>⚠️</span>
                  Description is required
                </span>
              )}
            </div>
          </div>
          <Button
            type="submit"
            className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 transition-all duration-200 shadow-lg hover:shadow-xl"
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Submitting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>✅</span>
                Submit Request
              </span>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDialog;
