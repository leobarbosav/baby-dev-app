import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baby as mockBaby } from '../data/mockData';

export interface BabyData {
  name: string;
  age: string;
  birthDate: string;
  birthDateObj: Date;
}

const MESES = [
  'janeiro','fevereiro','março','abril','maio','junho',
  'julho','agosto','setembro','outubro','novembro','dezembro',
];

function calcAge(month: number, year: number): string {
  const now = new Date();
  const totalMonths = (now.getFullYear() - year) * 12 + (now.getMonth() - month);
  if (totalMonths < 1) return 'recém-nascido';
  if (totalMonths < 12) return `${totalMonths} ${totalMonths === 1 ? 'mês' : 'meses'}`;
  const years = Math.floor(totalMonths / 12);
  const rem   = totalMonths % 12;
  if (rem === 0) return `${years} ${years === 1 ? 'ano' : 'anos'}`;
  return `${years}a ${rem}m`;
}

const defaultData: BabyData = {
  name:        mockBaby.name,
  age:         mockBaby.age,
  birthDate:   mockBaby.birthDate,
  birthDateObj: mockBaby.birthDateObj,
};

const BabyContext = createContext<BabyData>(defaultData);

export function useBaby(): BabyData {
  return useContext(BabyContext);
}

export function BabyProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<BabyData>(defaultData);

  useEffect(() => {
    async function load() {
      try {
        const results = await AsyncStorage.multiGet(['babyName', 'babyMonth', 'babyYear']);
        const name  = results[0][1];
        const month = results[1][1];
        const year  = results[2][1];

        if (name && month !== null && year) {
          const m = parseInt(month, 10);
          const y = parseInt(year, 10);
          setData({
            name,
            age:         calcAge(m, y),
            birthDate:   `${MESES[m]} de ${y}`,
            birthDateObj: new Date(y, m, 1),
          });
        }
      } catch {
        // mantém os dados padrão
      }
    }
    load();
  }, []);

  return <BabyContext.Provider value={data}>{children}</BabyContext.Provider>;
}
