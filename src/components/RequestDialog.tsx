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
import {useLanguage} from '@/contexts/LanguageContext';

type RequestMode = 'form' | 'ai';

const MIN_AI_TEXT_LENGTH = 20;

const RequestDialog = () => {
  const {t} = useLanguage();
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
      setParseError(t('request.parseError'));
      return;
    }

    if (trimmedText.length < MIN_AI_TEXT_LENGTH) {
      setParseError(
        t('request.parseErrorMinLength').replace(
          '{min}',
          MIN_AI_TEXT_LENGTH.toString(),
        ),
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
      setParseError(t('request.parseErrorFailed'));
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
            {t('request.createRequest')}
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6" />
            {t('request.createNew')}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {mode === 'form'
              ? t('request.formDescription')
              : t('request.aiDescription')}
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
            {t('request.form')}
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
            {t('request.aiText')}
          </Button>
        </div>

        {mode === 'ai' ? (
          <div className="space-y-4">
            <div className="grid gap-2.5">
              <Label htmlFor="ai-text" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                {t('request.describeRequest')}
              </Label>
              <textarea
                id="ai-text"
                placeholder={t('request.aiPlaceholder')}
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
                  {aiText.trim().length} / {MIN_AI_TEXT_LENGTH}{' '}
                  {t('request.characters')}
                  {aiText.trim().length < MIN_AI_TEXT_LENGTH &&
                    ` (${MIN_AI_TEXT_LENGTH - aiText.trim().length} ${t('request.moreNeeded')})`}
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
                  {t('request.processing')}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {t('request.parseWithAI')}
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
                  {t('request.city')}
                </Label>
                <Input
                  id="city"
                  placeholder={t('request.enterCity')}
                  className="focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  {...register('city', {required: true})}
                />
                {errors.city && (
                  <span className="text-red-500 text-xs flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {t('request.cityRequired')}
                  </span>
                )}
              </div>
              <div className="grid gap-2.5">
                <Label htmlFor="category" className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  {t('request.category')}
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
                    <SelectValue placeholder={t('request.selectCategory')} />
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
                    {errors.category.message || t('request.categoryRequired')}
                  </span>
                )}
              </div>
              <div className="grid gap-2.5">
                <Label htmlFor="urgency" className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {t('request.urgency')}
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
                    <SelectValue placeholder={t('request.selectUrgency')} />
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
                    {errors.urgency.message || t('request.urgencyRequired')}
                  </span>
                )}
              </div>
              <div className="grid gap-2.5">
                <Label
                  htmlFor="description"
                  className="flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  {t('request.description')}
                </Label>
                <textarea
                  id="description"
                  placeholder={t('request.describeDetail')}
                  className="border rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  rows={4}
                  {...register('description', {required: true})}
                />
                {errors.description && (
                  <span className="text-red-500 text-xs flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {t('request.descriptionRequired')}
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
                  {t('request.submitting')}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  {t('request.submitRequest')}
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
