'use client';
import React, {createContext, useContext, useState, useEffect} from 'react';

export type AppLanguage = 'en' | 'ua';

interface LanguageContextType {
  language: AppLanguage;
  setLanguage: (_lang: AppLanguage) => void;
  t: (_key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

// Translation dictionary
const translations: Record<AppLanguage, Record<string, string>> = {
  en: {
    // Navigation
    'nav.helpConnect': 'Help Connect',
    'nav.myRequests': 'My Requests',
    'nav.chats': 'Chats',
    'nav.logout': 'Logout',
    'nav.settings': 'Settings',
    // Chat
    'chat.title': 'Chat',
    'chat.description':
      'Connect and coordinate help with your conversation partner.',
    'chat.writeMessage': 'Write a message...',
    'chat.sendMessage': 'Send Message',
    'chat.disconnected': 'Disconnected',
    'chat.connected': 'Connected',
    'chat.usersOnline': 'user(s) online',
    'chat.noMessages': 'No messages yet',
    'chat.startConversation': 'Start the conversation!',
    'chat.loadingMessages': 'Loading messages...',
    'chat.loadingOlder': 'Loading older messages...',
    'chat.generateSummary': 'Generate Summary',
    'chat.generating': 'Generating...',
    'chat.translate': 'Translate',
    'chat.translating': 'Translating...',
    'chat.showOriginal': 'Show original',
    // Home
    'home.title': 'Help Connect',
    'home.description':
      'Connect with volunteers and get the help you need, or offer your assistance to those in need.',
    // My Requests
    'myRequests.title': 'My Help Requests',
    'myRequests.description':
      'Manage and track your help requests and see responses from volunteers.',
    // Help Request Filters
    'filters.searchPlaceholder':
      'Search by city, category, urgency, or description...',
    'filters.showFilters': 'Show Filters',
    'filters.hideFilters': 'Hide Filters',
    'filters.clearAll': 'Clear All',
    'filters.category': 'Category',
    'filters.allCategories': 'All Categories',
    'filters.urgency': 'Urgency',
    'filters.allUrgencyLevels': 'All Urgency Levels',
    'filters.status': 'Status',
    'filters.allStatus': 'All Status',
    'filters.open': 'Open',
    'filters.closed': 'Closed',
    'filters.city': 'City',
    'filters.filterByCity': 'Filter by city...',
    'filters.fromDate': 'From Date',
    'filters.toDate': 'To Date',
    // Status
    'status.active': 'Active',
    'status.closed': 'Closed',
    // Help Request List
    'list.loading': 'Loading help requests...',
    'list.noRequests': 'No help requests found',
    'list.beFirst': 'Be the first to create a help request!',
    'list.loadingMore': 'Loading more...',
    // Request Dialog
    'request.createRequest': 'Create Request',
    'request.createNew': 'Create a New Help Request',
    'request.formDescription':
      'Fill out the form below or use AI to describe your request.',
    'request.aiDescription':
      'Describe your help request in natural language, and AI will extract the details.',
    'request.form': 'Form',
    'request.aiText': 'AI Text',
    'request.describeRequest': 'Describe Your Request',
    'request.aiPlaceholder':
      'Example: We need help with transporting things for displaced people from Lviv to Drohobych by the end of the week',
    'request.characters': 'characters',
    'request.moreNeeded': 'more needed',
    'request.parseWithAI': 'Parse with AI',
    'request.processing': 'Processing...',
    'request.city': 'City',
    'request.enterCity': 'Enter your city',
    'request.cityRequired': 'City is required',
    'request.category': 'Category',
    'request.selectCategory': 'Select a category',
    'request.categoryRequired': 'Category is required',
    'request.urgency': 'Urgency',
    'request.selectUrgency': 'Select urgency level',
    'request.urgencyRequired': 'Urgency is required',
    'request.description': 'Description',
    'request.describeDetail': 'Describe your request in detail...',
    'request.descriptionRequired': 'Description is required',
    'request.submitRequest': 'Submit Request',
    'request.submitting': 'Submitting...',
    'request.parseError': 'Please enter a description of your help request.',
    'request.parseErrorMinLength':
      'Please provide at least {min} characters with more details about your request.',
    'request.parseErrorFailed':
      'Failed to process your request. Please try again or use the form instead.',
    // Help Request Card
    'card.details': 'Help Request Details',
    'card.createdBy': 'Request created by:',
    'card.city': 'City:',
    'card.category': 'Category:',
    'card.urgency': 'Urgency:',
    'card.directMessage': 'Direct Message',
    'card.creating': 'Creating...',
    'card.closeRequest': 'Close Request',
    'card.activateRequest': 'Activate Request',
    'card.updating': 'Updating...',
    'card.delete': 'Delete',
    'card.deleting': 'Deleting...',
    'card.close': 'Close',
    // Conversation List
    'conversations.loading': 'Loading conversations...',
    'conversations.error': 'Error loading conversations',
    'conversations.refresh': 'Please try refreshing the page.',
    'conversations.searchPlaceholder': 'Search by chat title...',
    'conversations.noConversations': 'No conversations yet',
    'conversations.startConversation':
      'Start a conversation by responding to a help request!',
    'conversations.noResults': 'No conversations found',
    'conversations.adjustSearch': 'Try adjusting your search query.',
    'conversations.chatWith': 'Chat with',
    'conversations.helping': 'Helping',
    'conversations.gettingHelp': 'Getting help from',
    'conversations.started': 'Started:',
    'conversations.unknownUser': 'Unknown User',
    // Post Chat Deletion Dialog
    'dialog.deleteRequestTitle': 'Delete Help Request?',
    'dialog.closeRequestTitle': 'Close Help Request?',
    'dialog.deleteRequestDescription':
      'Would you like to delete the related help request as well?',
    'dialog.closeRequestDescription':
      'Would you like to mark this help request as closed?',
    'dialog.deleteRequestMessage':
      'The chat has been deleted. You can also delete the associated help request if it is no longer needed.',
    'dialog.closeRequestMessage':
      'The chat has been deleted. You can mark the help request as closed if the issue has been resolved.',
    'dialog.deleteRequest': 'Delete Request',
    'dialog.deleting': 'Deleting...',
    'dialog.closeRequest': 'Close Request',
    'dialog.closing': 'Closing...',
    // Settings
    'settings.title': 'Settings',
    'settings.description': 'Update your profile information',
    'settings.name': 'Name',
    'settings.namePlaceholder': 'Enter your name',
    'settings.surname': 'Surname',
    'settings.surnamePlaceholder': 'Enter your surname',
    'settings.role': 'Role',
    'settings.rolePlaceholder': 'Select your role',
    'settings.user': 'User',
    'settings.volunteer': 'Volunteer',
    'settings.loading': 'Loading settings...',
    'settings.saveChanges': 'Save Changes',
    'settings.saving': 'Saving...',
    'settings.updateError': 'Failed to update profile',
    // Login
    'login.title': 'Sign in to your account',
    'login.subtitle': 'Or',
    'login.createAccount': 'create a new account',
    'login.email': 'Email',
    'login.emailPlaceholder': 'Enter your email',
    'login.password': 'Password',
    'login.passwordPlaceholder': 'Enter your password',
    'login.signIn': 'Sign in',
    'login.signingIn': 'Signing in...',
    'login.unexpectedError': 'An unexpected error occurred',
    // Register
    'register.title': 'Create your account',
    'register.subtitle': 'Or',
    'register.signIn': 'sign in to your account',
    'register.name': 'Name',
    'register.namePlaceholder': 'Enter your name',
    'register.surname': 'Surname',
    'register.surnamePlaceholder': 'Enter your surname',
    'register.email': 'Email',
    'register.emailPlaceholder': 'Enter your email',
    'register.password': 'Password',
    'register.passwordPlaceholder': 'Enter your password',
    'register.role': 'Role',
    'register.rolePlaceholder': 'Select your role',
    'register.user': 'User',
    'register.volunteer': 'Volunteer',
    'register.createAccount': 'Create account',
    'register.creatingAccount': 'Creating account...',
    'register.unexpectedError': 'An unexpected error occurred',
  },
  ua: {
    // Navigation
    'nav.helpConnect': "Допомога Зв'язок",
    'nav.myRequests': 'Мої Запити',
    'nav.chats': 'Чати',
    'nav.logout': 'Вийти',
    'nav.settings': 'Налаштування',
    // Chat
    'chat.title': 'Чат',
    'chat.description':
      "Зв'яжіться та координуйте допомогу з вашим партнером по розмові.",
    'chat.writeMessage': 'Написати повідомлення...',
    'chat.sendMessage': 'Надіслати повідомлення',
    'chat.disconnected': 'Відключено',
    'chat.connected': 'Підключено',
    'chat.usersOnline': 'користувач(ів) онлайн',
    'chat.noMessages': 'Повідомлень поки немає',
    'chat.startConversation': 'Почніть розмову!',
    'chat.loadingMessages': 'Завантаження повідомлень...',
    'chat.loadingOlder': 'Завантаження старіших повідомлень...',
    'chat.generateSummary': 'Створити резюме',
    'chat.generating': 'Генерується...',
    'chat.translate': 'Перекласти',
    'chat.translating': 'Перекладається...',
    'chat.showOriginal': 'Показати оригінал',
    // Home
    'home.title': "Допомога Зв'язок",
    'home.description':
      "Зв'яжіться з волонтерами та отримайте потрібну допомогу, або запропонуйте свою допомогу тим, хто в ній потребує.",
    // My Requests
    'myRequests.title': 'Мої запити на допомогу',
    'myRequests.description':
      'Керуйте та відстежуйте свої запити на допомогу та переглядайте відповіді від волонтерів.',
    // Help Request Filters
    'filters.searchPlaceholder':
      'Пошук за містом, категорією, терміновістю або описом...',
    'filters.showFilters': 'Показати фільтри',
    'filters.hideFilters': 'Приховати фільтри',
    'filters.clearAll': 'Очистити все',
    'filters.category': 'Категорія',
    'filters.allCategories': 'Всі категорії',
    'filters.urgency': 'Терміновість',
    'filters.allUrgencyLevels': 'Всі рівні терміновості',
    'filters.status': 'Статус',
    'filters.allStatus': 'Всі статуси',
    'filters.open': 'Відкрито',
    'filters.closed': 'Закрито',
    'filters.city': 'Місто',
    'filters.filterByCity': 'Фільтр за містом...',
    'filters.fromDate': 'Від дати',
    'filters.toDate': 'До дати',
    // Status
    'status.active': 'Активний',
    'status.closed': 'Закрито',
    // Help Request List
    'list.loading': 'Завантаження запитів на допомогу...',
    'list.noRequests': 'Запитів на допомогу не знайдено',
    'list.beFirst': 'Будьте першим, хто створить запит на допомогу!',
    'list.loadingMore': 'Завантаження ще...',
    // Request Dialog
    'request.createRequest': 'Створити запит',
    'request.createNew': 'Створити новий запит на допомогу',
    'request.formDescription':
      'Заповніть форму нижче або використайте AI для опису вашого запиту.',
    'request.aiDescription':
      'Опишіть ваш запит на допомогу природною мовою, і AI витягне деталі.',
    'request.form': 'Форма',
    'request.aiText': 'AI Текст',
    'request.describeRequest': 'Опишіть ваш запит',
    'request.aiPlaceholder':
      'Приклад: Нам потрібна допомога з перевезенням речей для переселенців зі Львова до Дрогобича до кінця тижня',
    'request.characters': 'символів',
    'request.moreNeeded': 'ще потрібно',
    'request.parseWithAI': 'Розпарсити з AI',
    'request.processing': 'Обробка...',
    'request.city': 'Місто',
    'request.enterCity': 'Введіть ваше місто',
    'request.cityRequired': "Місто обов'язкове",
    'request.category': 'Категорія',
    'request.selectCategory': 'Виберіть категорію',
    'request.categoryRequired': "Категорія обов'язкова",
    'request.urgency': 'Терміновість',
    'request.selectUrgency': 'Виберіть рівень терміновості',
    'request.urgencyRequired': "Терміновість обов'язкова",
    'request.description': 'Опис',
    'request.describeDetail': 'Опишіть ваш запит детально...',
    'request.descriptionRequired': "Опис обов'язковий",
    'request.submitRequest': 'Надіслати запит',
    'request.submitting': 'Надсилання...',
    'request.parseError': 'Будь ласка, введіть опис вашого запиту на допомогу.',
    'request.parseErrorMinLength':
      'Будь ласка, надайте принаймні {min} символів з більш детальною інформацією про ваш запит.',
    'request.parseErrorFailed':
      'Не вдалося обробити ваш запит. Будь ласка, спробуйте ще раз або використайте форму.',
    // Help Request Card
    'card.details': 'Деталі запиту на допомогу',
    'card.createdBy': 'Запит створено:',
    'card.city': 'Місто:',
    'card.category': 'Категорія:',
    'card.urgency': 'Терміновість:',
    'card.directMessage': 'Пряме повідомлення',
    'card.creating': 'Створення...',
    'card.closeRequest': 'Закрити запит',
    'card.activateRequest': 'Активувати запит',
    'card.updating': 'Оновлення...',
    'card.delete': 'Видалити',
    'card.deleting': 'Видалення...',
    'card.close': 'Закрити',
    // Conversation List
    'conversations.loading': 'Завантаження розмов...',
    'conversations.error': 'Помилка завантаження розмов',
    'conversations.refresh': 'Будь ласка, спробуйте оновити сторінку.',
    'conversations.searchPlaceholder': 'Пошук за назвою чату...',
    'conversations.noConversations': 'Розмов поки немає',
    'conversations.startConversation':
      'Почніть розмову, відповівши на запит на допомогу!',
    'conversations.noResults': 'Розмов не знайдено',
    'conversations.adjustSearch': 'Спробуйте змінити запит пошуку.',
    'conversations.chatWith': 'Чат з',
    'conversations.helping': 'Допомагаю',
    'conversations.gettingHelp': 'Отримую допомогу від',
    'conversations.started': 'Почато:',
    'conversations.unknownUser': 'Невідомий користувач',
    // Post Chat Deletion Dialog
    'dialog.deleteRequestTitle': 'Видалити запит на допомогу?',
    'dialog.closeRequestTitle': 'Закрити запит на допомогу?',
    'dialog.deleteRequestDescription':
      "Чи хочете ви також видалити пов'язаний запит на допомогу?",
    'dialog.closeRequestDescription':
      'Чи хочете ви позначити цей запит на допомогу як закритий?',
    'dialog.deleteRequestMessage':
      "Чат було видалено. Ви також можете видалити пов'язаний запит на допомогу, якщо він більше не потрібен.",
    'dialog.closeRequestMessage':
      'Чат було видалено. Ви можете позначити запит на допомогу як закритий, якщо проблема вирішена.',
    'dialog.deleteRequest': 'Видалити запит',
    'dialog.deleting': 'Видалення...',
    'dialog.closeRequest': 'Закрити запит',
    'dialog.closing': 'Закриття...',
    // Settings
    'settings.title': 'Налаштування',
    'settings.description': 'Оновіть інформацію профілю',
    'settings.name': "Ім'я",
    'settings.namePlaceholder': "Введіть ваше ім'я",
    'settings.surname': 'Прізвище',
    'settings.surnamePlaceholder': 'Введіть ваше прізвище',
    'settings.role': 'Роль',
    'settings.rolePlaceholder': 'Виберіть вашу роль',
    'settings.user': 'Користувач',
    'settings.volunteer': 'Волонтер',
    'settings.loading': 'Завантаження налаштувань...',
    'settings.saveChanges': 'Зберегти зміни',
    'settings.saving': 'Збереження...',
    'settings.updateError': 'Не вдалося оновити профіль',
    // Login
    'login.title': 'Увійдіть до свого облікового запису',
    'login.subtitle': 'Або',
    'login.createAccount': 'створіть новий обліковий запис',
    'login.email': 'Електронна пошта',
    'login.emailPlaceholder': 'Введіть вашу електронну пошту',
    'login.password': 'Пароль',
    'login.passwordPlaceholder': 'Введіть ваш пароль',
    'login.signIn': 'Увійти',
    'login.signingIn': 'Вхід...',
    'login.unexpectedError': 'Сталася неочікувана помилка',
    // Register
    'register.title': 'Створіть свій обліковий запис',
    'register.subtitle': 'Або',
    'register.signIn': 'увійдіть до свого облікового запису',
    'register.name': "Ім'я",
    'register.namePlaceholder': "Введіть ваше ім'я",
    'register.surname': 'Прізвище',
    'register.surnamePlaceholder': 'Введіть ваше прізвище',
    'register.email': 'Електронна пошта',
    'register.emailPlaceholder': 'Введіть вашу електронну пошту',
    'register.password': 'Пароль',
    'register.passwordPlaceholder': 'Введіть ваш пароль',
    'register.role': 'Роль',
    'register.rolePlaceholder': 'Виберіть вашу роль',
    'register.user': 'Користувач',
    'register.volunteer': 'Волонтер',
    'register.createAccount': 'Створити обліковий запис',
    'register.creatingAccount': 'Створення облікового запису...',
    'register.unexpectedError': 'Сталася неочікувана помилка',
  },
};

export function LanguageProvider({children}: {children: React.ReactNode}) {
  const [language, setLanguageState] = useState<AppLanguage>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('app-language') as AppLanguage;
    if (savedLanguage === 'en' || savedLanguage === 'ua') {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);
  };

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{language, setLanguage, t}}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
