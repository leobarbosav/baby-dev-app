import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SleepRecord {
  id: string;
  date: string;
  start: string;
  end: string;
  duration: number;
}

export interface FeedingRecord {
  id: string;
  date: string;
  time: string;
  type: string;
  amount: string;
}

export interface GrowthRecord {
  id: string;
  date: string;
  weight?: number; // kg
  height?: number; // cm
}

const KEYS = {
  sleep: 'sleep_records',
  feeding: 'feeding_records',
  growth: 'growth_records',
  activitiesDone: (date: string) => `activities_done_${date}`,
};

export function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

// Sleep
export async function getSleepRecords(): Promise<SleepRecord[]> {
  const raw = await AsyncStorage.getItem(KEYS.sleep);
  return raw ? JSON.parse(raw) : [];
}
export async function addSleepRecord(record: SleepRecord): Promise<void> {
  const all = await getSleepRecords();
  await AsyncStorage.setItem(KEYS.sleep, JSON.stringify([record, ...all]));
}

// Feeding
export async function getFeedingRecords(): Promise<FeedingRecord[]> {
  const raw = await AsyncStorage.getItem(KEYS.feeding);
  return raw ? JSON.parse(raw) : [];
}
export async function addFeedingRecord(record: FeedingRecord): Promise<void> {
  const all = await getFeedingRecords();
  await AsyncStorage.setItem(KEYS.feeding, JSON.stringify([record, ...all]));
}

// Growth
export async function getGrowthRecords(): Promise<GrowthRecord[]> {
  const raw = await AsyncStorage.getItem(KEYS.growth);
  return raw ? JSON.parse(raw) : [];
}
export async function addGrowthRecord(record: GrowthRecord): Promise<void> {
  const all = await getGrowthRecords();
  await AsyncStorage.setItem(KEYS.growth, JSON.stringify([record, ...all]));
}

// Activities done per day — Record<activityId, completedAt>
export async function getActivitiesDone(date: string): Promise<Record<string, string>> {
  const raw = await AsyncStorage.getItem(KEYS.activitiesDone(date));
  return raw ? JSON.parse(raw) : {};
}
export async function saveActivityDone(date: string, id: string, completedAt: string): Promise<void> {
  const current = await getActivitiesDone(date);
  current[id] = completedAt;
  await AsyncStorage.setItem(KEYS.activitiesDone(date), JSON.stringify(current));
}
