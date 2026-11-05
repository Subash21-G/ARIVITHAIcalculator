import { Injectable, inject } from '@angular/core';
import { LocalStoreService } from '../storage/local-store';

const en = {
  calculator:'Calculator', basic:'Basic', gst:'GST', discount:'Discount', history:'History', settings:'Settings', help:'Help', installApp:'Install app', updateApp:'Update app',
  basicTitle:'Basic calculator', gstTitle:'GST calculator', discountTitle:'Discount calculator',
  expression:'Expression', result:'Result', clear:'Clear all', backspace:'Backspace', sign:'Toggle sign', equals:'Equals',
  everyday:'Everyday maths, made clear', percentHelp:'For addition and subtraction, a percent is based on the preceding value. Example: 200 + 10% = 220.',
  gstIntro:'Enter the rate that applies to your item. Displayed currency values are rounded to two decimals.', amount:'Amount', gstAmountHelp:'Enter the price before or after GST, according to the mode.', gstRate:'GST rate (%)', calculation:'Calculation', addGst:'Add GST to base amount', removeGst:'Remove GST from total', calculateGst:'Calculate GST', breakdown:'Breakdown', baseAmount:'Base amount', gstAmount:'GST amount', total:'Total', copyTotal:'Copy total', copied:'Copied', gstFine:'Confirm the correct GST rate for your item. This tool is for calculation, not tax advice.',
  discountIntro:'Find your savings and final price. Displayed currency values are rounded to two decimals.', originalPrice:'Original price', discountType:'Discount type', percentage:'Percentage (%)', fixedAmount:'Fixed amount (₹)', discountPercent:'Discount percentage', discountAmount:'Discount amount', calculateDiscount:'Calculate discount', youSave:'You save', finalPrice:'Final price', copyFinal:'Copy final price', discountFine:'A fixed discount cannot exceed the original price.',
  historyIntro:'Completed calculations are stored only on this device.', emptyHistory:'No calculations saved yet.', copy:'Copy', delete:'Delete', clearHistory:'Clear history', clearConfirm:'Delete all saved calculations on this device?',
  language:'Language', theme:'Theme', system:'System', light:'Light', dark:'Dark', decimalDisplay:'Decimal display', fullPrecision:'Full precision', twoDecimals:'Two decimal places', settingsIntro:'Preferences are saved on this device.', storageWarning:'Local storage is unavailable; changes may not persist.',
  helpTitle:'Help', helpIntro:'Use the keypad or your keyboard to enter expressions. Enter evaluates; Escape clears; Backspace removes the last character.', helpGst:'For an inclusive price of ₹1180 at 18% GST, the base is ₹1000 and the tax is ₹180.', backTo:'Back to calculator', copyFailed:'Could not copy the result',
} as const;
type Key = keyof typeof en;
const ta: Record<Key, string> = {
  calculator:'கணிப்பான்', basic:'அடிப்படை', gst:'ஜிஎஸ்டி', discount:'தள்ளுபடி', history:'வரலாறு', settings:'அமைப்புகள்', help:'உதவி', installApp:'செயலியை நிறுவு', updateApp:'செயலியை புதுப்பி',
  basicTitle:'அடிப்படை கணிப்பான்', gstTitle:'ஜிஎஸ்டி கணிப்பான்', discountTitle:'தள்ளுபடி கணிப்பான்',
  expression:'கணக்கு', result:'விடை', clear:'அனைத்தையும் அழி', backspace:'கடைசி எழுத்தை அழி', sign:'குறியை மாற்று', equals:'சமம்',
  everyday:'அன்றாடக் கணக்குகள் எளிதாக', percentHelp:'கூட்டல் மற்றும் கழித்தலில் சதவீதம் முன் உள்ள மதிப்பைச் சார்ந்தது. எ.கா. 200 + 10% = 220.',
  gstIntro:'உங்கள் பொருளுக்கான வரி விகிதத்தை உள்ளிடவும். பண மதிப்புகள் இரண்டு தசம இடங்களுக்குச் சுருக்கப்படும்.', amount:'தொகை', gstAmountHelp:'தேர்ந்தெடுத்த முறைக்கேற்ப வரிக்கு முன் அல்லது பின் உள்ள விலையை உள்ளிடவும்.', gstRate:'ஜிஎஸ்டி விகிதம் (%)', calculation:'கணக்கீடு', addGst:'அடிப்படைத் தொகையுடன் வரி சேர்', removeGst:'மொத்தத்திலிருந்து வரியை நீக்கு', calculateGst:'ஜிஎஸ்டி கணக்கிடு', breakdown:'விவரம்', baseAmount:'அடிப்படைத் தொகை', gstAmount:'வரி தொகை', total:'மொத்தம்', copyTotal:'மொத்தத்தை நகலெடு', copied:'நகலெடுக்கப்பட்டது', gstFine:'உங்கள் பொருளுக்கான சரியான வரி விகிதத்தை உறுதிசெய்க. இது வரி ஆலோசனை அல்ல.',
  discountIntro:'சேமிப்பையும் இறுதி விலையையும் காண்க. பண மதிப்புகள் இரண்டு தசம இடங்களுக்குச் சுருக்கப்படும்.', originalPrice:'அசல் விலை', discountType:'தள்ளுபடி வகை', percentage:'சதவீதம் (%)', fixedAmount:'நிலையான தொகை (₹)', discountPercent:'தள்ளுபடி சதவீதம்', discountAmount:'தள்ளுபடி தொகை', calculateDiscount:'தள்ளுபடி கணக்கிடு', youSave:'சேமிப்பு', finalPrice:'இறுதி விலை', copyFinal:'இறுதி விலையை நகலெடு', discountFine:'நிலையான தள்ளுபடி அசல் விலையை மீறக்கூடாது.',
  historyIntro:'முடிக்கப்பட்ட கணக்குகள் இந்தச் சாதனத்தில் மட்டும் சேமிக்கப்படும்.', emptyHistory:'இன்னும் கணக்குகள் சேமிக்கப்படவில்லை.', copy:'நகலெடு', delete:'நீக்கு', clearHistory:'வரலாற்றை அழி', clearConfirm:'இந்தச் சாதனத்தில் சேமித்த எல்லா கணக்குகளையும் நீக்கவா?',
  language:'மொழி', theme:'தோற்றம்', system:'சாதன அமைப்பு', light:'ஒளி', dark:'இருள்', decimalDisplay:'தசமக் காட்சி', fullPrecision:'முழு துல்லியம்', twoDecimals:'இரண்டு தசம இடங்கள்', settingsIntro:'விருப்பங்கள் இந்தச் சாதனத்தில் சேமிக்கப்படும்.', storageWarning:'உள்ளூர் சேமிப்பு கிடைக்கவில்லை; மாற்றங்கள் நிலைக்காமல் போகலாம்.',
  helpTitle:'உதவி', helpIntro:'கணக்கை உள்ளிட விசைப்பலகையைப் பயன்படுத்தவும். Enter கணக்கிடும்; Escape அழிக்கும்; Backspace கடைசி எழுத்தை நீக்கும்.', helpGst:'18% வரி உட்பட்ட ₹1180 விலையில் அடிப்படை ₹1000, வரி ₹180.', backTo:'கணிப்பானுக்குத் திரும்பு', copyFailed:'விடையை நகலெடுக்க முடியவில்லை',
};
const tamilErrors: Record<string, string> = {
  'Enter an expression':'கணக்கை உள்ளிடவும்', 'Expression is too long':'கணக்கு மிக நீளமாக உள்ளது',
  'Invalid number':'தவறான எண்', 'Unsupported character':'பயன்படுத்த முடியாத எழுத்து',
  'Incomplete expression':'முழுமையற்ற கணக்கு', 'Missing closing parenthesis':'மூடும் அடைப்புக்குறி இல்லை',
  'Invalid expression':'தவறான கணக்கு', 'Too many nested parentheses':'அதிகமான அடைப்புக்குறிகள்',
  'Cannot divide by zero':'பூஜ்ஜியத்தால் வகுக்க முடியாது', 'Result is out of range':'விடை வரம்பை மீறுகிறது',
  'Enter a valid amount':'சரியான தொகையை உள்ளிடவும்', 'Enter a valid GST rate':'சரியான வரி விகிதத்தை உள்ளிடவும்',
  'Enter a valid original price':'சரியான அசல் விலையை உள்ளிடவும்', 'Enter a valid discount':'சரியான தள்ளுபடியை உள்ளிடவும்',
  'GST rate must be 100% or less':'வரி விகிதம் 100% அல்லது குறைவாக இருக்க வேண்டும்',
  'Discount percent must be 100% or less':'தள்ளுபடி சதவீதம் 100% அல்லது குறைவாக இருக்க வேண்டும்',
  'Discount cannot exceed the original price':'தள்ளுபடி அசல் விலையை மீறக்கூடாது',
  'Invalid GST mode':'தவறான வரி முறை', 'Invalid discount type':'தவறான தள்ளுபடி வகை',
  'Calculation failed':'கணக்கிட முடியவில்லை',
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  private store = inject(LocalStoreService);
  t(key: Key): string { return this.store.language() === 'ta' ? ta[key] : en[key]; }
  error(message: string): string { return this.store.language() === 'ta' ? tamilErrors[message] ?? message : message; }
}
