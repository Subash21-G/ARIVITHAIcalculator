import React, { useEffect, useState } from 'react';
import {
  Alert,
  Appearance,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import Decimal from 'decimal.js';
import { calculate } from './src/engine';
import { calculateDiscount, calculateGst, DiscountResult, GstResult } from './src/finance';
import { numberToWords } from './src/number-words';
import { labels, translateError } from './src/labels';

type Page = 'basic' | 'gst' | 'discount' | 'history' | 'settings' | 'help' | 'about' | 'privacy';
type RecordItem = { id: string; expression: string; result: string; createdAt: string };
type Data = {
  history: RecordItem[];
  language: 'en' | 'ta';
  theme: 'system' | 'light' | 'dark';
  decimalDisplay: 'auto' | '2';
};
const initial: Data = { history: [], language: 'en', theme: 'system', decimalDisplay: 'auto' };
const key = 'arivithai-native:v1';
const privacyPolicyUrl = 'https://subash21-g.github.io/ARIVITHAIcalculator/privacy-policy.html';
const validRecord = (value: unknown): value is RecordItem => {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === 'string' &&
    typeof record.expression === 'string' &&
    record.expression.length <= 200 &&
    typeof record.result === 'string' &&
    record.result.length <= 200 &&
    typeof record.createdAt === 'string' &&
    !Number.isNaN(Date.parse(record.createdAt))
  );
};
const keys = [
  'AC',
  '⌫',
  '(',
  ')',
  '7',
  '8',
  '9',
  '÷',
  '4',
  '5',
  '6',
  '×',
  '1',
  '2',
  '3',
  '−',
  '±',
  '0',
  '.',
  '+',
  '%',
  '=',
];

export default function App() {
  const { height } = useWindowDimensions();
  const compactBasic = height < 800;
  const shortBasic = height < 700;
  const basicKeyHeight = shortBasic ? 42 : compactBasic ? 49 : 56;
  const [page, setPage] = useState<Page>('basic');
  const [data, setData] = useState<Data>(initial);
  const [ready, setReady] = useState(false);
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState('1000');
  const [rate, setRate] = useState('18');
  const [gstMode, setGstMode] = useState<'exclusive' | 'inclusive'>('exclusive');
  const [gstResult, setGstResult] = useState<GstResult | null>(null);
  const [price, setPrice] = useState('2000');
  const [discountValue, setDiscountValue] = useState('20');
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [discountResult, setDiscountResult] = useState<DiscountResult | null>(null);
  const [, refreshColor] = useState(0);
  useEffect(() => {
    AsyncStorage.getItem(key)
      .then((raw) => {
        if (raw) {
          const saved = JSON.parse(raw) as Partial<Data>;
          setData({
            history: Array.isArray(saved.history)
              ? saved.history.filter(validRecord).slice(0, 100)
              : [],
            language: saved.language === 'ta' ? 'ta' : 'en',
            theme: saved.theme === 'dark' || saved.theme === 'light' ? saved.theme : 'system',
            decimalDisplay: saved.decimalDisplay === '2' ? '2' : 'auto',
          });
        }
      })
      .catch(() => Alert.alert('Storage', 'Saved data could not be loaded.'))
      .finally(() => setReady(true));
    const subscription = Appearance.addChangeListener(() => refreshColor((v) => v + 1));
    return () => subscription.remove();
  }, []);
  useEffect(() => {
    if (ready)
      AsyncStorage.setItem(key, JSON.stringify(data)).catch(() =>
        Alert.alert('Storage', 'Changes could not be saved.'),
      );
  }, [data, ready]);
  const t = labels(data.language);
  const dark =
    data.theme === 'dark' || (data.theme === 'system' && Appearance.getColorScheme() === 'dark');
  const color = dark
    ? { bg: '#071F1B', panel: '#0E332D', display: '#124339', text: '#F8FAFC', muted: '#B4D4C9', border: '#246557', accent: '#10B981', accentText: '#071F1B', amber: '#10B981', walnut: '#071F1B', operator: '#155C49', key: '#14463A' }
    : { bg: '#F8FAFC', panel: '#FFFFFF', display: '#EFFAF5', text: '#071F1B', muted: '#526A65', border: '#CDE7DC', accent: '#047857', accentText: '#F8FAFC', amber: '#10B981', walnut: '#071F1B', operator: '#DCFCE7', key: '#FFFFFF' };
  const update = (patch: Partial<Data>) => setData((previous) => ({ ...previous, ...patch }));
  const save = (input: string, output: string) =>
    setData((previous) => ({
      ...previous,
      history: [
        {
          id: Date.now() + '-' + Math.random(),
          expression: input,
          result: output,
          createdAt: new Date().toISOString(),
        },
        ...previous.history,
      ].slice(0, 100),
    }));
  const showError = (e: unknown) => setError(e instanceof Error ? e.message : 'Calculation failed');
  const copyValue = async (value: string) => {
    try {
      await Clipboard.setStringAsync(value);
      setCopied(true);
      setError('');
    } catch {
      setError('Could not copy the result');
    }
  };
  const press = (value: string) => {
    if (value === 'AC') {
      setExpression('');
      setResult('');
      setError('');
      return;
    }
    if (value === '=') {
      try {
        const answer = calculate(expression);
        setResult(answer);
        setError('');
        save(expression, answer);
      } catch (e) {
        setResult('');
        showError(e);
      }
      return;
    }
    setResult('');
    setError('');
    if (value === '⌫') {
      setExpression((v) => v.slice(0, -1));
      return;
    }
    if (value === '±') {
      setExpression((v) => {
        const match = v.match(/(?:\d+(?:\.\d*)?|\.\d+)$/);
        if (!match) return v;
        const start = v.length - match[0].length;
        return start > 0 && v[start - 1] === '−' && (start === 1 || /[+×÷(−]/.test(v[start - 2]))
          ? v.slice(0, start - 1) + match[0]
          : v.slice(0, start) + '−' + match[0];
      });
      return;
    }
    setExpression((v) => (v.length < 200 ? v + value : v));
  };
  const displayResult =
    result && data.decimalDisplay === '2' ? new Decimal(result).toFixed(2) : result;
  const Button = ({
    title,
    onPress,
    selected = false,
    glow = false,
    small = false,
  }: {
    title: string;
    onPress: () => void;
    selected?: boolean;
    glow?: boolean;
    small?: boolean;
  }) => (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={selected ? { selected: true } : undefined}
      onPress={onPress}
      style={[
        styles.button,
        { backgroundColor: glow ? color.amber : selected ? color.accent : color.panel, borderColor: glow ? color.amber : color.border, elevation: glow ? 4 : 0 },
        small && styles.small,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          { color: glow ? color.walnut : selected ? color.accentText : color.text },
          small && styles.smallText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
  const Field = ({
    label,
    value,
    change,
  }: {
    label: string;
    value: string;
    change: (v: string) => void;
  }) => (
    <View style={styles.field}>
      <Text style={[styles.label, { color: color.muted }]}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        keyboardType="decimal-pad"
        value={value}
        onChangeText={(v) => {
          change(v);
          setError('');
        }}
        style={[
          styles.input,
          { color: color.text, backgroundColor: color.panel, borderColor: color.border },
        ]}
      />
    </View>
  );
  const Row = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.row}>
      <Text style={{ color: color.muted }}>{label}</Text>
      <Text style={[styles.value, { color: color.text }]}>{value}</Text>
    </View>
  );
  const Section = ({ children }: { children: React.ReactNode }) => (
    <View style={[styles.section, page === 'basic' && compactBasic && styles.compactSection, { backgroundColor: color.panel, borderColor: color.border }]}>
      {children}
    </View>
  );
  const Choice = ({
    items,
    value,
    choose,
  }: {
    items: [string, string][];
    value: string;
    choose: (v: any) => void;
  }) => (
    <View style={styles.choices}>
      {items.map(([id, label]) => (
        <Button key={id} title={label} selected={id === value} small onPress={() => choose(id)} />
      ))}
    </View>
  );
  return (
    <View style={[styles.root, { backgroundColor: color.bg, paddingTop: Platform.OS === 'android' ? Math.max(24, StatusBar.currentHeight ?? 0) : 0 }]}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
      <View style={[styles.header, { backgroundColor: color.panel }]}>
        <Text style={[styles.brand,{color:dark?color.amber:color.walnut}]}>அ ARIVITHAI</Text>
        <Text style={{ color: color.muted }}>{t[page]}</Text>
      </View>
      <ScrollView
        contentContainerStyle={[styles.content, page === 'basic' && compactBasic && styles.compactContent]}
        keyboardShouldPersistTaps="handled"
        scrollEnabled
      >
        {page === 'basic' &&
          Section({
            children: (
              <>
                <Text style={[styles.label, { color: color.muted }]}>{t.expression}</Text>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.expression, compactBasic && styles.compactExpression, { color: color.text }]}>{expression || '0'}</Text>
                <Text style={[styles.label, { color: color.muted }]}>{t.result}</Text>
                <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.answer, compactBasic && styles.compactAnswer, { color: color.accent }]}>{displayResult || '—'}</Text>
                {displayResult ? (
                  <Text style={{ color: color.muted }}>
                    {numberToWords(displayResult, data.language)}
                  </Text>
                ) : null}
                {error ? (
                  <Text style={styles.error}>{translateError(error, data.language)}</Text>
                ) : null}
                <View style={[styles.keypad, compactBasic && styles.compactKeypad]}>
                  {keys.map((k) => (
                    <TouchableOpacity
                      key={k}
                      accessibilityRole="button"
                      accessibilityLabel={
                        k === 'AC'
                          ? t.clearButton
                          : k === '⌫'
                            ? t.backspace
                            : k === '±'
                              ? t.sign
                              : k === '='
                                ? t.equals
                                : k
                      }
                      style={[styles.key, { height: basicKeyHeight, backgroundColor: k === '=' ? color.amber : ['÷','×','−','+','%','(',')'].includes(k) ? color.operator : color.key, elevation: k === '=' ? 5 : 0 }]}
                      onPress={() => press(k)}
                    >
                      <Text style={[styles.keyText, { color: k === '=' ? color.walnut : color.text }]}>
                        {k}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            ),
          })}
        {page === 'gst' &&
          Section({
            children: (
              <>
                <Text style={[styles.title, { color: color.text }]}>{t.gstTitle}</Text>
                <Text style={[styles.note, { color: color.muted }]}>{t.gstIntro}</Text>
                {Field({
                  label: t.amount,
                  value: amount,
                  change: (v) => {
                    setAmount(v);
                    setGstResult(null);
                    setCopied(false);
                  },
                })}
                <Text style={[styles.note, { color: color.muted }]}>{t.gstAmountHelp}</Text>
                {Field({
                  label: t.rate,
                  value: rate,
                  change: (v) => {
                    setRate(v);
                    setGstResult(null);
                    setCopied(false);
                  },
                })}
                <Text style={[styles.label, { color: color.muted }]}>{t.calculation}</Text>
                <Choice
                  items={[
                    ['exclusive', t.add],
                    ['inclusive', t.remove],
                  ]}
                  value={gstMode}
                  choose={(v) => {
                    setGstMode(v);
                    setGstResult(null);
                    setCopied(false);
                    setError('');
                  }}
                />
                <Button
                  title={t.calculateGst}
                  selected
                  glow
                  onPress={() => {
                    try {
                      const r = calculateGst(amount, rate, gstMode);
                      setGstResult(r);
                      setCopied(false);
                      setError('');
                      save(`${amount} @ ${rate}% GST`, r.total);
                    } catch (e) {
                      setGstResult(null);
                      showError(e);
                    }
                  }}
                />
                {error ? (
                  <Text style={styles.error}>{translateError(error, data.language)}</Text>
                ) : null}
                {gstResult && (
                  <>
                    <Text style={[styles.label, { color: color.text }]}>{t.breakdown}</Text>
                    <Row label={t.base} value={'₹' + gstResult.base} />
                    <Row label={t.tax} value={'₹' + gstResult.tax} />
                    <Row label={t.total} value={'₹' + gstResult.total} />
                    <Button
                      title={copied ? t.copied : t.copy}
                      onPress={() => copyValue(gstResult.total)}
                    />
                  </>
                )}
                <Text style={[styles.note, { color: color.muted }]}>{t.gstFine}</Text>
              </>
            ),
          })}
        {page === 'discount' &&
          Section({
            children: (
              <>
                <Text style={[styles.title, { color: color.text }]}>{t.discountTitle}</Text>
                <Text style={[styles.note, { color: color.muted }]}>{t.discountIntro}</Text>
                {Field({
                  label: t.price,
                  value: price,
                  change: (v) => {
                    setPrice(v);
                    setDiscountResult(null);
                    setCopied(false);
                  },
                })}
                <Text style={[styles.label, { color: color.muted }]}>{t.discountType}</Text>
                <Choice
                  items={[
                    ['percent', t.percent],
                    ['fixed', t.fixed],
                  ]}
                  value={discountType}
                  choose={(v) => {
                    setDiscountType(v);
                    setDiscountResult(null);
                    setCopied(false);
                    setError('');
                  }}
                />
                {Field({
                  label: discountType === 'percent' ? t.discountPercent : t.discountAmount,
                  value: discountValue,
                  change: (v) => {
                    setDiscountValue(v);
                    setDiscountResult(null);
                    setCopied(false);
                  },
                })}
                <Button
                  title={t.calculateDiscount}
                  selected
                  glow
                  onPress={() => {
                    try {
                      const r = calculateDiscount(price, discountValue, discountType);
                      setDiscountResult(r);
                      setCopied(false);
                      setError('');
                      save(
                        `${price} − ${discountValue}${discountType === 'percent' ? '%' : ' ₹'}`,
                        r.final,
                      );
                    } catch (e) {
                      setDiscountResult(null);
                      showError(e);
                    }
                  }}
                />
                {error ? (
                  <Text style={styles.error}>{translateError(error, data.language)}</Text>
                ) : null}
                {discountResult && (
                  <>
                    <Text style={[styles.label, { color: color.text }]}>{t.breakdown}</Text>
                    <Row label={t.price} value={'₹' + discountResult.original} />
                    <Row label={t.savings} value={'₹' + discountResult.savings} />
                    <Row label={t.final} value={'₹' + discountResult.final} />
                    <Button
                      title={copied ? t.copied : t.copy}
                      onPress={() => copyValue(discountResult.final)}
                    />
                  </>
                )}
                <Text style={[styles.note, { color: color.muted }]}>{t.discountFine}</Text>
              </>
            ),
          })}
        {page === 'history' &&
          Section({
            children: (
              <>
                <Text style={[styles.title, { color: color.text }]}>{t.history}</Text>
                <Text style={{ color: color.muted }}>{t.local}</Text>
                {error ? (
                  <Text style={styles.error}>{translateError(error, data.language)}</Text>
                ) : null}
                {data.history.length === 0 ? (
                  <Text style={[styles.note, { color: color.muted }]}>{t.empty}</Text>
                ) : (
                  data.history.map((item) => (
                    <View key={item.id} style={[styles.history, { borderColor: color.border }]}>
                      <Text style={{ color: color.text }}>
                        {item.expression} = {item.result}
                      </Text>
                      <Text style={{ color: color.muted }}>
                        {numberToWords(item.result, data.language)}
                      </Text>
                      <Text style={{ color: color.muted }}>
                        {new Date(item.createdAt).toLocaleString()}
                      </Text>
                      <View style={styles.choices}>
                        <Button title={t.copy} small onPress={() => copyValue(item.result)} />
                        <Button
                          title={t.delete}
                          small
                          onPress={() =>
                            update({ history: data.history.filter((x) => x.id !== item.id) })
                          }
                        />
                      </View>
                    </View>
                  ))
                )}
                {data.history.length > 0 && (
                  <Button
                    title={t.clear}
                    onPress={() =>
                      Alert.alert(t.clear, t.clearConfirm, [
                        { text: 'Cancel' },
                        {
                          text: t.delete,
                          style: 'destructive',
                          onPress: () => update({ history: [] }),
                        },
                      ])
                    }
                  />
                )}
              </>
            ),
          })}
        {page === 'settings' &&
          Section({
            children: (
              <>
                <Text style={[styles.title, { color: color.text }]}>{t.settings}</Text>
                <Text style={[styles.note, { color: color.muted }]}>{t.settingsIntro}</Text>
                <Text style={[styles.label, { color: color.muted }]}>{t.language}</Text>
                <Choice
                  items={[
                    ['en', 'English'],
                    ['ta', 'தமிழ்'],
                  ]}
                  value={data.language}
                  choose={(v) => update({ language: v })}
                />
                <Text style={[styles.label, { color: color.muted }]}>{t.theme}</Text>
                <Choice
                  items={[
                    ['system', t.system],
                    ['light', t.light],
                    ['dark', t.dark],
                  ]}
                  value={data.theme}
                  choose={(v) => update({ theme: v })}
                />
                <Text style={[styles.label, { color: color.muted }]}>{t.precision}</Text>
                <Choice
                  items={[
                    ['auto', t.auto],
                    ['2', t.two],
                  ]}
                  value={data.decimalDisplay}
                  choose={(v) => update({ decimalDisplay: v })}
                />
                <View style={styles.choices}>
                  <Button title={t.help} small onPress={() => setPage('help')} />
                  <Button title={t.about} small onPress={() => setPage('about')} />
                  <Button title={t.privacy} small onPress={() => setPage('privacy')} />
                </View>
                <Button
                  title={data.language === 'ta' ? 'இணைய தனியுரிமைக் கொள்கையைத் திற' : 'Open online privacy policy'}
                  onPress={() => {
                    Linking.openURL(privacyPolicyUrl).catch(() =>
                      Alert.alert(t.privacy, data.language === 'ta' ? 'இணையப் பக்கத்தைத் திறக்க முடியவில்லை.' : 'Could not open the privacy policy page.'),
                    );
                  }}
                />
              </>
            ),
          })}
        {page === 'help' &&
          Section({
            children: (
              <>
                <Text style={[styles.title, { color: color.text }]}>{t.help}</Text>
                <Text style={[styles.note, { color: color.text }]}>{t.helpIntro}</Text>
                <Text style={[styles.note, { color: color.text }]}>{t.percentHelp}</Text>
                <Text style={{ color: color.text }}>
                  0.1 + 0.2 = 0.3{'\n'}200 + 10% = 220{'\n'}(2 + 3) × 4 = 20
                </Text>
                <Text style={[styles.note, { color: color.text }]}>{t.helpGst}</Text>
                <Button title={t.backTo} onPress={() => setPage('settings')} />
              </>
            ),
          })}
        {page === 'about' &&
          Section({
            children: (
              <>
                <Text style={[styles.title, { color: color.text }]}>{t.about}</Text>
                <Text style={[styles.note, { color: color.text }]}>{t.aboutIntro}</Text>
                <Text style={[styles.note, { color: color.text }]}>{t.aboutOffline}</Text>
                <Text style={[styles.note, { color: color.text }]}>{t.aboutRounding}</Text>
              </>
            ),
          })}
        {page === 'privacy' &&
          Section({
            children: (
              <>
                <Text style={[styles.title, { color: color.text }]}>{t.privacy}</Text>
                <Text style={[styles.note, { color: color.text }]}>{t.privacyIntro}</Text>
                <Text style={[styles.label, { color: color.text }]}>{t.privacyStoredTitle}</Text>
                <Text style={[styles.note, { color: color.text }]}>{t.privacyStored}</Text>
                <Text style={[styles.label, { color: color.text }]}>{t.privacySharingTitle}</Text>
                <Text style={[styles.note, { color: color.text }]}>{t.privacySharing}</Text>
                <Text style={[styles.label, { color: color.text }]}>{t.privacyDeleteTitle}</Text>
                <Text style={[styles.note, { color: color.text }]}>{t.privacyDelete}</Text>
                <Text style={[styles.label, { color: color.text }]}>{t.privacyOfflineTitle}</Text>
                <Text style={[styles.note, { color: color.text }]}>{t.privacyOffline}</Text>
                <Text style={[styles.label, { color: color.text }]}>{t.privacyContactTitle}</Text>
                <Text selectable style={[styles.note, { color: color.text }]}>subashgbose21@gmail.com</Text>
              </>
            ),
          })}
      </ScrollView>
      <View style={[styles.tabs, { backgroundColor: color.panel }]}>
        {(['basic', 'gst', 'discount', 'history', 'settings'] as Page[]).map((p) => (
          <TouchableOpacity
            key={p}
            accessibilityRole="tab"
            accessibilityLabel={t[p]}
            accessibilityState={{ selected: page === p }}
            style={styles.tab}
            onPress={() => {
              setPage(p);
              setError('');
            }}
          >
            <Text
              numberOfLines={2}
              style={{
                color: page === p ? color.accent : color.muted,
                fontSize: 12,
                fontWeight: '700',
                textAlign: 'center',
              }}
            >
              {t[p]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingTop: 12, paddingHorizontal: 20, paddingBottom: 12 },
  brand: { fontSize: 21, fontWeight: '800' },
  content: { padding: 16, paddingBottom: 30 },
  compactContent: { padding: 10, paddingBottom: 8 },
  section: { borderWidth: 1, borderRadius: 20, padding: 18, marginBottom: 14 },
  compactSection: { padding: 12, marginBottom: 0 },
  title: { fontSize: 25, fontWeight: '800', marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '700', marginBottom: 6 },
  expression: { fontSize: 30, textAlign: 'right', minHeight: 45 },
  compactExpression: { fontSize: 26, minHeight: 34 },
  answer: {
    fontSize: 38,
    fontWeight: '800',
    textAlign: 'right',
    marginBottom: 8,
  },
  compactAnswer: { fontSize: 32, marginBottom: 4 },
  note: { marginTop: 16, marginBottom: 12, lineHeight: 20 },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' },
  compactKeypad: { gap: 6 },
  key: {
    width: '22%',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: { fontSize: 22, fontWeight: '700' },
  field: { marginBottom: 14 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, height: 48, fontSize: 18 },
  choices: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginVertical: 10 },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: { fontSize: 16, fontWeight: '700' },
  small: { paddingVertical: 8, marginBottom: 0 },
  smallText: { fontSize: 13 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  value: { fontSize: 18, fontWeight: '700' },
  error: { color: '#bc3030', marginVertical: 10 },
  history: { borderTopWidth: 1, paddingVertical: 12 },
  tabs: { flexDirection: 'row', paddingBottom: Platform.OS === 'android' ? 22 : 10, paddingTop: 10 },
  tab: { flex: 1, minWidth: 0, alignItems: 'center', justifyContent: 'center', minHeight: 38, paddingHorizontal: 2 },
});
