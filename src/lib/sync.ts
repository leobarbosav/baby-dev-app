import { supabase } from './supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getSleepRecords, getFeedingRecords, getGrowthRecords,
  SleepRecord, FeedingRecord, GrowthRecord,
} from '../utils/storage';

// ── Perfil do bebê ────────────────────────────────────────────────────────────

export async function syncBabyProfile(
  name: string, day: number, month: number, year: number,
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('baby_profile').upsert({
    user_id: user.id, name, birth_day: day, birth_month: month, birth_year: year,
  }, { onConflict: 'user_id' });
}

export async function pullBabyProfile(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from('baby_profile')
    .select('*')
    .eq('user_id', user.id)
    .single();
  if (!data) return false;
  await AsyncStorage.multiSet([
    ['babyName',  data.name],
    ['babyDay',   String(data.birth_day)],
    ['babyMonth', String(data.birth_month)],
    ['babyYear',  String(data.birth_year)],
    ['onboardingDone', 'true'],
  ]);
  return true;
}

// ── Sono ──────────────────────────────────────────────────────────────────────

export async function pushSleepRecord(record: SleepRecord): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('sleep_records').upsert({
    id: record.id,
    user_id: user.id,
    date: record.date,
    start_time: record.start,
    end_time: record.end,
    duration: record.duration,
  });
}

// ── Alimentação ───────────────────────────────────────────────────────────────

export async function pushFeedingRecord(record: FeedingRecord): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('feeding_records').upsert({
    id: record.id,
    user_id: user.id,
    date: record.date,
    time: record.time,
    type: record.type,
    amount: record.amount,
  });
}

// ── Crescimento ───────────────────────────────────────────────────────────────

export async function pushGrowthRecord(record: GrowthRecord): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('growth_records').upsert({
    id: record.id,
    user_id: user.id,
    date: record.date,
    weight: record.weight ?? null,
    height: record.height ?? null,
  });
}

// ── Vacinas ───────────────────────────────────────────────────────────────────

export async function syncVacinas(ids: string[]): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('vacinas_aplicadas').delete().eq('user_id', user.id);
  if (ids.length === 0) return;
  await supabase.from('vacinas_aplicadas').insert(
    ids.map(vacina_id => ({ user_id: user.id, vacina_id })),
  );
}

// ── Pull completo (ao fazer login) ────────────────────────────────────────────

export async function pullAllData(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const [sleepRes, feedingRes, growthRes, vacinasRes] = await Promise.all([
    supabase.from('sleep_records').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('feeding_records').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('growth_records').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('vacinas_aplicadas').select('vacina_id').eq('user_id', user.id),
  ]);

  if (sleepRes.data) {
    const records: SleepRecord[] = sleepRes.data.map(r => ({
      id: r.id, date: r.date, start: r.start_time, end: r.end_time, duration: r.duration,
    }));
    await AsyncStorage.setItem('sleep_records', JSON.stringify(records));
  }

  if (feedingRes.data) {
    const records: FeedingRecord[] = feedingRes.data.map(r => ({
      id: r.id, date: r.date, time: r.time, type: r.type, amount: r.amount,
    }));
    await AsyncStorage.setItem('feeding_records', JSON.stringify(records));
  }

  if (growthRes.data) {
    const records: GrowthRecord[] = growthRes.data.map(r => ({
      id: r.id, date: r.date,
      weight: r.weight ?? undefined,
      height: r.height ?? undefined,
    }));
    await AsyncStorage.setItem('growth_records', JSON.stringify(records));
  }

  if (vacinasRes.data) {
    const ids = vacinasRes.data.map(r => r.vacina_id);
    await AsyncStorage.setItem('vacinasAplicadas', JSON.stringify(ids));
  }
}
