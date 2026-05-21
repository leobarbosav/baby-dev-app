import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baby as mockBaby } from '../data/mockData';

export interface BabyData {
  name: string;
  age: string;
  birthDate: string;
  birthDateObj: Date;
}

interface BabyContextValue {
  data: BabyData;
  update: (name: string, day: number, month: number, year: number) => Promise<void>;
}

const MESES = [
  'janeiro','fevereiro','março','abril','maio','junho',
  'julho','agosto','setembro','outubro','novembro','dezembro',
];

function calcAge(day: number, month: number, year: number): string {
  const now = new Date();
  let months = (now.getFullYear() - year) * 12 + (now.getMonth() - month);
  if (now.getDate() < day) months -= 1;
  if (months < 1) return 'recém-nascido';
  if (months < 12) return `${months} ${months === 1 ? 'mês' : 'meses'}`;
  const years = Math.floor(months / 12);
  const rem   = months % 12;
  if (rem === 0) return `${years} ${years === 1 ? 'ano' : 'anos'}`;
  return `${years}a ${rem}m`;
}

const defaultData: BabyData = {
  name:         mockBaby.name,
  age:          mockBaby.age,
  birthDate:    mockBaby.birthDate,
  birthDateObj: mockBaby.birthDateObj,
};

const BabyContext = createContext<BabyContextValue>({
  data: defaultData,
  update: async () => {},
});

export function useBaby(): BabyData {
  return useContext(BabyContext).data;
}

export function useBabyUpdate(): (name: string, day: number, month: number, year: number) => Promise<void> {
  return useContext(BabyContext).update;
}

export function BabyProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<BabyData>(defaultData);

  useEffect(() => {
    async function load() {
      try {
        const results = await AsyncStorage.multiGet(['babyName', 'babyDay', 'babyMonth', 'babyYear']);
        const name  = results[0][1];
        const day   = results[1][1];
        const month = results[2][1];
        const year  = results[3][1];
        if (name && month !== null && year) {
          const d = day ? parseInt(day, 10) : 1;
          const m = parseInt(month, 10);
          const y = parseInt(year, 10);
          setData({
            name,
            age:          calcAge(d, m, y),
            birthDate:    `${d} de ${MESES[m]} de ${y}`,
            birthDateObj: new Date(y, m, d),
          });
        }
      } catch {
        // mantém os dados padrão
      }
    }
    load();
  }, []);

  async function update(name: string, day: number, month: number, year: number) {
    await AsyncStorage.multiSet([
      ['babyName',  name],
      ['babyDay',   String(day)],
      ['babyMonth', String(month)],
      ['babyYear',  String(year)],
    ]);
    setData({
      name,
      age:          calcAge(day, month, year),
      birthDate:    `${day} de ${MESES[month]} de ${year}`,
      birthDateObj: new Date(year, month, day),
    });
  }

  return (
    <BabyContext.Provider value={{ data, update }}>
      {children}
    </BabyContext.Provider>
  );
}
