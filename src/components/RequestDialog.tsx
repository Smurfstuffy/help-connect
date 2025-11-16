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
  Sparkles,
  Edit,
} from 'lucide-react';
import {
  CATEGORY_OPTIONS,
  URGENCY_OPTIONS,
  HELP_REQUEST_URGENCY,
  HelpRequestCategory,
  HelpRequestUrgency,
} from '@/types/app/enums';
import {parseHelpRequest} from '@/services/axios/help-requests/parseHelpRequest';

type RequestMode = 'form' | 'ai';

const MIN_AI_TEXT_LENGTH = 20;

const RequestDialog = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<RequestMode>('form');
  const [aiText, setAiText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    formState: {errors},
  } = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      urgency: HELP_REQUEST_URGENCY.MEDIUM,
    },
  });

  const {mutate: createHelpRequest, isPending} = useCreateHelpRequestMutation();
  const {userId} = useAuth();

  const handleParseAiText = async () => {
    const trimmedText = aiText.trim();

    if (!trimmedText) {
      setParseError('Please enter a description of your help request.');
      return;
    }

    if (trimmedText.length < MIN_AI_TEXT_LENGTH) {
      setParseError(
        `Please provide at least ${MIN_AI_TEXT_LENGTH} characters with more details about your request.`,
      );
      return;
    }

    setIsParsing(true);
    setParseError(null);

    try {
      const result = await parseHelpRequest(aiText);

      if ('error' in result && result.error) {
        setParseError(result.message);
        setIsParsing(false);
        return;
      }

      // Type guard: result is ParsedHelpRequest at this point
      const parsedResult = result as {
        city: string;
        category: HelpRequestCategory;
        urgency: HelpRequestUrgency;
        description: string;
      };

      // Pre-fill the form with parsed data
      setValue('city', parsedResult.city);
      setValue('category', parsedResult.category);
      setValue('urgency', parsedResult.urgency);
      setValue('description', parsedResult.description);
      trigger();

      // Switch to form mode so user can review and edit
      setMode('form');
      setAiText('');
    } catch {
      setParseError(
        'Failed to process your request. Please try again or use the form instead.',
      );
    } finally {
      setIsParsing(false);
    }
  };

  const onSubmit = (data: RequestFormValues) => {
    createHelpRequest({
      ...data,
      category: data.category as HelpRequestCategory,
      urgency: data.urgency as HelpRequestUrgency,
      user_id: userId,
    });
    setOpen(false);
    reset();
    setMode('form');
    setAiText('');
    setParseError(null);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset everything when dialog closes
      reset();
      setMode('form');
      setAiText('');
      setParseError(null);
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
            {mode === 'form'
              ? 'Fill out the form below or use AI to describe your request.'
              : 'Describe your help request in natural language, and AI will extract the details.'}
          </DialogDescription>
        </DialogHeader>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-4">
          <Button
            type="button"
            variant={mode === 'form' ? 'default' : 'outline'}
            onClick={() => {
              setMode('form');
              setParseError(null);
            }}
            className="flex-1 cursor-pointer"
          >
            <Edit className="w-4 h-4 mr-2" />
            Form
          </Button>
          <Button
            type="button"
            variant={mode === 'ai' ? 'default' : 'outline'}
            onClick={() => {
              setMode('ai');
              setParseError(null);
            }}
            className="flex-1 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Text
          </Button>
        </div>

        {mode === 'ai' ? (
          <div className="space-y-4">
            <div className="grid gap-2.5">
              <Label htmlFor="ai-text" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Describe Your Request
              </Label>
              <textarea
                id="ai-text"
                placeholder="Example: We need help with transporting things for displaced people from Lviv to Drohobych by the end of the week"
                className="border rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none min-h-[120px]"
                value={aiText}
                onChange={e => {
                  setAiText(e.target.value);
                  setParseError(null);
                }}
              />
              <div className="flex items-center justify-between text-xs">
                <span
                  className={
                    aiText.trim().length < MIN_AI_TEXT_LENGTH
                      ? 'text-gray-500'
                      : 'text-green-600'
                  }
                >
                  {aiText.trim().length} / {MIN_AI_TEXT_LENGTH} characters
                  {aiText.trim().length < MIN_AI_TEXT_LENGTH &&
                    ` (${MIN_AI_TEXT_LENGTH - aiText.trim().length} more needed)`}
                </span>
              </div>
              {parseError && (
                <span className="text-red-500 text-xs flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {parseError}
                </span>
              )}
            </div>
            <Button
              type="button"
              onClick={handleParseAiText}
              disabled={
                isParsing ||
                !aiText.trim() ||
                aiText.trim().length < MIN_AI_TEXT_LENGTH
              }
              className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isParsing ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Parse with AI
                </span>
              )}
            </Button>
          </div>
        ) : (
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
                <Label
                  htmlFor="description"
                  className="flex items-center gap-2"
                >
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RequestDialog;
