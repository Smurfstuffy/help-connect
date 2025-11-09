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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {zodResolver} from '@hookform/resolvers/zod';
import {RequestFormValues, requestSchema} from '@/types/app/components/dialog';
import {useCreateHelpRequestMutation} from '@/hooks/queries/help-requests/useCreateHelpRequestMutation';
import {useAuth} from '@/hooks/useAuth';
import {useState} from 'react';
import {
  Plus,
  FileText,
  MapPin,
  AlertTriangle,
  Tag,
  Check,
  AlertCircle,
} from 'lucide-react';
import {
  CATEGORY_OPTIONS,
  URGENCY_OPTIONS,
  HELP_REQUEST_URGENCY,
  HelpRequestCategory,
  HelpRequestUrgency,
} from '@/types/app/enums';

const RequestDialog = () => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: {errors},
  } = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      urgency: HELP_REQUEST_URGENCY.MEDIUM,
    },
  });

  const {mutate: createHelpRequest, isPending} = useCreateHelpRequestMutation();
  const {userId} = useAuth();

  const onSubmit = (data: RequestFormValues) => {
    createHelpRequest({
      ...data,
      category: data.category as HelpRequestCategory,
      urgency: data.urgency as HelpRequestUrgency,
      user_id: userId,
    });
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-10 px-4 py-2 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200">
          <span className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Request
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6" />
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
                <MapPin className="w-4 h-4" />
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
                  <AlertTriangle className="w-3 h-3" />
                  City is required
                </span>
              )}
            </div>
            <div className="grid gap-2.5">
              <Label htmlFor="category" className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Category
              </Label>
              <Select
                value={watch('category')}
                onValueChange={value => {
                  setValue('category', value as HelpRequestCategory, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  trigger('category');
                }}
              >
                <SelectTrigger
                  id="category"
                  className="w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <span className="text-red-500 text-xs flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {errors.category.message || 'Category is required'}
                </span>
              )}
            </div>
            <div className="grid gap-2.5">
              <Label htmlFor="urgency" className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Urgency
              </Label>
              <Select
                value={watch('urgency') || HELP_REQUEST_URGENCY.MEDIUM}
                onValueChange={value => {
                  setValue('urgency', value as HelpRequestUrgency, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  trigger('urgency');
                }}
              >
                <SelectTrigger
                  id="urgency"
                  className="w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <SelectValue placeholder="Select urgency level" />
                </SelectTrigger>
                <SelectContent>
                  {URGENCY_OPTIONS.map(urgency => (
                    <SelectItem key={urgency} value={urgency}>
                      {urgency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.urgency && (
                <span className="text-red-500 text-xs flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {errors.urgency.message || 'Urgency is required'}
                </span>
              )}
            </div>
            <div className="grid gap-2.5">
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
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
                  <AlertTriangle className="w-3 h-3" />
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
                <Check className="w-4 h-4" />
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
