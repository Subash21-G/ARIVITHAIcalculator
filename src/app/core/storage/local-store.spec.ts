import { LocalStore } from './local-store';

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length(){return this.values.size;}
  clear(){this.values.clear();}
  getItem(key:string){return this.values.get(key) ?? null;}
  key(index:number){return [...this.values.keys()][index] ?? null;}
  removeItem(key:string){this.values.delete(key);}
  setItem(key:string,value:string){this.values.set(key,value);}
}

describe('local storage adapter', () => {
  it('saves history and settings across instances', () => {
    const storage = new MemoryStorage();
    const first = new LocalStore(storage);
    first.add('0.1+0.2', '0.3'); first.setLanguage('ta'); first.setTheme('dark'); first.setDecimalDisplay('2');
    const second = new LocalStore(storage);
    expect(second.history()[0].expression).toBe('0.1+0.2');
    expect(second.language()).toBe('ta'); expect(second.theme()).toBe('dark'); expect(second.decimalDisplay()).toBe('2');
  });
  it('deletes a single record and clears all records', () => {
    const store = new LocalStore(new MemoryStorage());
    store.add('1+1','2'); store.add('2+2','4');
    store.delete(store.history()[0].id);
    expect(store.history().map(item=>item.result)).toEqual(['2']);
    store.clear(); expect(store.history()).toEqual([]);
  });
  it('caps history at 100 records', () => {
    const store = new LocalStore(new MemoryStorage());
    for(let index=0;index<110;index++)store.add(String(index),String(index));
    expect(store.history()).toHaveLength(100);
    expect(store.history()[0].expression).toBe('109');
  });
  it('recovers from corrupt and future schemas', () => {
    const storage = new MemoryStorage();
    storage.setItem('arivithai:v1','invalid json');
    expect(new LocalStore(storage).history()).toEqual([]);
    storage.setItem('arivithai:v1',JSON.stringify({version:2,history:[{}]}));
    expect(new LocalStore(storage).history()).toEqual([]);
  });
  it('filters invalid records', () => {
    const storage = new MemoryStorage();
    storage.setItem('arivithai:v1',JSON.stringify({version:1,history:[{}, {id:'ok',expression:'1+1',result:'2',createdAt:'2026-11-05T00:00:00.000Z'}],language:'oops',theme:'oops'}));
    const store = new LocalStore(storage);
    expect(store.history()).toHaveLength(1);
    expect(store.language()).toBe('en'); expect(store.theme()).toBe('system'); expect(store.decimalDisplay()).toBe('auto');
  });
  it('keeps in-memory changes when storage fails', () => {
    const broken = {getItem(){throw new Error('blocked');},setItem(){throw new Error('blocked');}} as unknown as Storage;
    const store = new LocalStore(broken);
    store.add('1+1','2');
    expect(store.history()).toHaveLength(1);
    expect(store.warning()).toContain('unavailable');
  });
});
