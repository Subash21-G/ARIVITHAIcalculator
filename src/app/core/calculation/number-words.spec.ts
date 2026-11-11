import { describe, expect, it } from 'vitest';
import { numberToWords } from './number-words';
import { calculate } from './engine';

describe('numberToWords', () => {
  it('uses Indian place values', () => {
    expect(numberToWords('1234567')).toBe('twelve lakh thirty-four thousand five hundred sixty-seven');
    expect(numberToWords('0')).toBe('zero');
  });
  it('speaks negative and decimal digits', () => {
    expect(numberToWords('-12.05')).toBe('minus twelve point zero five');
    expect(numberToWords('0.30')).toBe('zero point three zero');
  });
  it('uses Tamil when selected', () => {
    expect(numberToWords('12', 'ta')).toBe('பன்னிரண்டு');
    expect(numberToWords('7849034', 'ta')).toBe('எழுபத்து எட்டு லட்சத்து நாற்பத்து ஒன்பது ஆயிரத்து முப்பத்து நான்கு');
    expect(numberToWords('100034', 'ta')).toBe('ஒரு லட்சத்து முப்பத்து நான்கு');
    expect(numberToWords('900', 'ta')).toBe('தொள்ளாயிரம்');
    expect(numberToWords('-0.05', 'ta')).toBe('மைனஸ் பூஜ்ஜியம் புள்ளி பூஜ்ஜியம் ஐந்து');
    expect(numberToWords('9012345679', 'ta')).toBe('தொள்ளாயிரத்து ஒரு கோடியே இருபத்து மூன்று லட்சத்து நாற்பத்து ஐந்து ஆயிரத்து அறுநூற்று எழுபத்து ஒன்பது');
  });
  it('matches the calculated result in the reported example', () => {
    const result = calculate('7854255-5221');
    expect(result).toBe('7849034');
    expect(numberToWords(result, 'ta')).toBe('எழுபத்து எட்டு லட்சத்து நாற்பத்து ஒன்பது ஆயிரத்து முப்பத்து நான்கு');
  });
  it('matches the larger calculation shown in the screenshot', () => {
    const result = calculate('10000000000-987654321');
    expect(result).toBe('9012345679');
    expect(numberToWords(result, 'ta')).toBe('தொள்ளாயிரத்து ஒரு கோடியே இருபத்து மூன்று லட்சத்து நாற்பத்து ஐந்து ஆயிரத்து அறுநூற்று எழுபத்து ஒன்பது');
  });
});
