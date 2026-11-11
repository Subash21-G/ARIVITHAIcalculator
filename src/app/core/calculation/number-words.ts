const englishOnes = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
const englishTens = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
const tamilOnes = ['பூஜ்ஜியம்','ஒன்று','இரண்டு','மூன்று','நான்கு','ஐந்து','ஆறு','ஏழு','எட்டு','ஒன்பது','பத்து','பதினொன்று','பன்னிரண்டு','பதின்மூன்று','பதினான்கு','பதினைந்து','பதினாறு','பதினேழு','பதினெட்டு','பத்தொன்பது'];
const tamilTens = ['','','இருபது','முப்பது','நாற்பது','ஐம்பது','அறுபது','எழுபது','எண்பது','தொண்ணூறு'];
const tamilTensJoined = ['','','இருபத்து','முப்பத்து','நாற்பத்து','ஐம்பத்து','அறுபத்து','எழுபத்து','எண்பத்து','தொண்ணூற்று'];

function underThousand(value: number, tamil: boolean): string {
  const ones = tamil ? tamilOnes : englishOnes;
  const tens = tamil ? tamilTens : englishTens;
  if (value < 20) return ones[value];
  if (value < 100) {
    if (tamil) return value % 10 ? tamilTensJoined[Math.floor(value / 10)] + ' ' + ones[value % 10] : tens[Math.floor(value / 10)];
    return tens[Math.floor(value / 10)] + (value % 10 ? '-' + ones[value % 10] : '');
  }
  if (tamil) {
    const hundreds = ['','நூறு','இருநூறு','முந்நூறு','நானூறு','ஐந்நூறு','அறுநூறு','எழுநூறு','எண்ணூறு','தொள்ளாயிரம்'];
    const hundredsJoined = ['','நூற்று','இருநூற்று','முந்நூற்று','நானூற்று','ஐந்நூற்று','அறுநூற்று','எழுநூற்று','எண்ணூற்று','தொள்ளாயிரத்து'];
    const remainder = value % 100;
    return (remainder ? hundredsJoined : hundreds)[Math.floor(value / 100)] + (remainder ? ' ' + underThousand(remainder, true) : '');
  }
  return ones[Math.floor(value / 100)] + ' hundred' + (value % 100 ? ' ' + underThousand(value % 100, false) : '');
}

const englishScales = ['','thousand','lakh','crore','arab','kharab','neel','padma','shankh'];
const tamilScales = ['','ஆயிரம்','லட்சம்','கோடி','அரபு','கரபு','நீலம்','பதுமம்','சங்கு'];
const tamilScalesJoined = ['','ஆயிரத்து','லட்சத்து','கோடியே','அரபு','கரபு','நீலம்','பதுமம்','சங்கு'];

export function numberToWords(value: string, language: 'en' | 'ta' = 'en'): string {
  const tamil = language === 'ta';
  if (!/^-?\d+(?:\.\d+)?$/.test(value)) return '';
  const negative = value.startsWith('-');
  const [whole, fraction] = (negative ? value.slice(1) : value).split('.');
  const groups: number[] = [];
  let remaining = whole;
  groups.push(Number(remaining.slice(-3)));
  remaining = remaining.slice(0, -3);
  while (remaining) {
    if (groups.length === 3 && remaining.length <= 3) { groups.push(Number(remaining)); break; }
    groups.push(Number(remaining.slice(-2)));
    remaining = remaining.slice(0, -2);
  }
  const scales = tamil ? tamilScales : englishScales;
  if (groups.length > scales.length) return '';
  const parts = groups.map((group, index) => {
    if (!group) return '';
    const hasLowerGroup = groups.slice(0, index).some(Boolean);
    const scale = index ? ' ' + (tamil && hasLowerGroup ? tamilScalesJoined[index] : scales[index]) : '';
    let words = tamil && index === 1 && group === 1 ? '' : tamil && index && group === 1 ? 'ஒரு' : underThousand(group, tamil);
    if (tamil && index && group > 1) words = words.replace(/ஒன்று$/, 'ஒரு');
    return (words + scale).trim();
  }).reverse().filter(Boolean);
  const integerWords = parts.join(' ') || (tamil ? tamilOnes[0] : englishOnes[0]);
  const fractionWords = fraction ? (tamil ? ' புள்ளி ' : ' point ') + [...fraction].map(digit => (tamil ? tamilOnes : englishOnes)[Number(digit)]).join(' ') : '';
  return (negative ? (tamil ? 'மைனஸ் ' : 'minus ') : '') + integerWords + fractionWords;
}
