import { translate, translateError } from './translations';

export type Language = 'en' | 'ta';

export function labels(language: Language) {
  const t = (key: Parameters<typeof translate>[0]) => translate(key, language);
  return {
    basic: t('basic'),
    gst: t('gst'),
    discount: t('discount'),
    history: t('history'),
    settings: t('settings'),
    help: t('help'),
    about: t('about'),
    privacy: t('privacy'),
    expression: t('expression'),
    result: t('result'),
    amount: t('amount'),
    rate: t('gstRate'),
    add: t('addGst'),
    remove: t('removeGst'),
    calculateGst: t('calculateGst'),
    calculateDiscount: t('calculateDiscount'),
    base: t('baseAmount'),
    tax: t('gstAmount'),
    total: t('total'),
    price: t('originalPrice'),
    percent: t('percentage'),
    fixed: t('fixedAmount'),
    savings: t('youSave'),
    final: t('finalPrice'),
    copy: t('copy'),
    copied: t('copied'),
    delete: t('delete'),
    clear: t('clearHistory'),
    clearConfirm: t('clearConfirm'),
    empty: t('emptyHistory'),
    language: t('language'),
    theme: t('theme'),
    precision: t('decimalDisplay'),
    system: t('system'),
    light: t('light'),
    dark: t('dark'),
    auto: t('fullPrecision'),
    two: t('twoDecimals'),
    local: t('historyIntro'),
    percentHelp: t('percentHelp'),
    gstIntro: t('gstIntro'),
    gstAmountHelp: t('gstAmountHelp'),
    gstFine: t('gstFine'),
    discountIntro: t('discountIntro'),
    discountFine: t('discountFine'),
    breakdown: t('breakdown'),
    calculation: t('calculation'),
    discountType: t('discountType'),
    discountPercent: t('discountPercent'),
    discountAmount: t('discountAmount'),
    settingsIntro: t('settingsIntro'),
    aboutIntro: t('aboutIntro'),
    aboutOffline:
      language === 'ta'
        ? 'இந்தச் செயலி இணையமின்றி இயங்கும். கணக்கு வரலாறும் விருப்பங்களும் இந்தச் சாதனத்தில் சேமிக்கப்படும்.'
        : 'The installed app works offline. Calculation history and preferences stay on this device.',
    aboutRounding: t('aboutRounding'),
    privacyIntro: t('privacyIntro'),
    privacyStoredTitle: t('privacyStoredTitle'),
    privacyStored:
      language === 'ta'
        ? 'முடிக்கப்பட்ட கணக்குகள், மொழி, தோற்றம் மற்றும் காட்சி விருப்பங்கள் செயலியின் உள்ளூர் சேமிப்பகத்தில் இருக்கும். அவை சாதனங்களுக்கு இடையே ஒத்திசைக்கப்படாது.'
        : 'Completed calculations, language, theme and display preferences are stored in the app on this device. They are not synchronized between devices.',
    privacySharingTitle: t('privacySharingTitle'),
    privacySharing:
      language === 'ta'
        ? 'உங்கள் கணக்குகளோ வரலாறோ சேவையகத்திற்கு அனுப்பப்படுவதில்லை.'
        : 'The calculator does not send your calculations or history to a server.',
    privacyDeleteTitle: t('privacyDeleteTitle'),
    privacyDelete:
      language === 'ta'
        ? 'சேமித்த கணக்குகளை நீக்க வரலாற்றை அழி என்பதைப் பயன்படுத்தவும். செயலியின் தரவை அழித்தால் அல்லது செயலியை அகற்றினால் வரலாறும் விருப்பங்களும் நீங்கும்.'
        : 'Use Clear history to remove saved calculations. Clearing the app’s data or uninstalling it removes history and preferences.',
    privacyOfflineTitle: t('privacyOfflineTitle'),
    privacyContactTitle: t('privacyContactTitle'),
    privacyOffline:
      language === 'ta'
        ? 'செயலியை நிறுவிய பிறகு இணையமின்றியும் கணக்கிடலாம்.'
        : 'After installation, calculations work without an internet connection.',
    helpIntro: t('helpIntro'),
    helpGst: t('helpGst'),
    backTo: t('backTo'),
    copyFailed: t('copyFailed'),
    storageWarning: t('storageWarning'),
    clearButton: t('clear'),
    backspace: t('backspace'),
    sign: t('sign'),
    equals: t('equals'),
    gstTitle: t('gstTitle'),
    discountTitle: t('discountTitle'),
    basicTitle: t('basicTitle'),
  };
}

export { translateError };
