import { colors } from '../theme';

interface RawMilestone {
  title: string;
  expectedMonths: number;
  area: 'motor' | 'cognitive' | 'social' | 'language';
}

export interface DevelopmentArea {
  key: 'motor' | 'cognitive' | 'social' | 'language';
  label: string;
  color: string;
  progress: number;
  achieved: string[];
  inProgress: { title: string; expected: string }[];
}

const ALL_MILESTONES: RawMilestone[] = [
  // ── Motor ─────────────────────────────────────────────────────────────────
  { area: 'motor', title: 'Levanta a cabeça brevemente',       expectedMonths: 1  },
  { area: 'motor', title: 'Sustenta a cabeça por segundos',    expectedMonths: 2  },
  { area: 'motor', title: 'Sustenta a cabeça com firmeza',     expectedMonths: 3  },
  { area: 'motor', title: 'Rola de bruços para costas',        expectedMonths: 4  },
  { area: 'motor', title: 'Senta com apoio',                   expectedMonths: 5  },
  { area: 'motor', title: 'Rola dos dois lados',               expectedMonths: 6  },
  { area: 'motor', title: 'Senta sem apoio',                   expectedMonths: 7  },
  { area: 'motor', title: 'Transfere objetos entre as mãos',   expectedMonths: 7  },
  { area: 'motor', title: 'Engatinha',                         expectedMonths: 9  },
  { area: 'motor', title: 'Pinça fina (polegar–indicador)',    expectedMonths: 10 },
  { area: 'motor', title: 'Fica em pé com apoio',              expectedMonths: 10 },
  { area: 'motor', title: 'Primeiros passos',                  expectedMonths: 12 },
  { area: 'motor', title: 'Caminha sozinho',                   expectedMonths: 14 },
  { area: 'motor', title: 'Corre',                             expectedMonths: 18 },
  { area: 'motor', title: 'Sobe escadas com apoio',            expectedMonths: 20 },
  { area: 'motor', title: 'Pula com os dois pés',              expectedMonths: 24 },

  // ── Cognitivo ─────────────────────────────────────────────────────────────
  { area: 'cognitive', title: 'Rastreia objetos com os olhos',     expectedMonths: 1  },
  { area: 'cognitive', title: 'Reconhece o rosto dos pais',        expectedMonths: 2  },
  { area: 'cognitive', title: 'Explora objetos com as mãos',       expectedMonths: 3  },
  { area: 'cognitive', title: 'Causa e efeito simples',            expectedMonths: 4  },
  { area: 'cognitive', title: 'Busca objetos parcialmente ocultos',expectedMonths: 6  },
  { area: 'cognitive', title: 'Imita gestos simples',              expectedMonths: 8  },
  { area: 'cognitive', title: 'Permanência do objeto',             expectedMonths: 9  },
  { area: 'cognitive', title: 'Busca objeto completamente oculto', expectedMonths: 10 },
  { area: 'cognitive', title: 'Usa objetos com propósito',         expectedMonths: 12 },
  { area: 'cognitive', title: 'Aponta para pedir',                 expectedMonths: 13 },
  { area: 'cognitive', title: 'Brincadeira de faz-de-conta simples',expectedMonths: 18},
  { area: 'cognitive', title: 'Classifica formas e cores',         expectedMonths: 20 },
  { area: 'cognitive', title: 'Resolve problemas simples',         expectedMonths: 22 },
  { area: 'cognitive', title: 'Conta até 2 objetos',               expectedMonths: 24 },

  // ── Social ────────────────────────────────────────────────────────────────
  { area: 'social', title: 'Contato visual sustentado',        expectedMonths: 1  },
  { area: 'social', title: 'Sorriso social',                   expectedMonths: 2  },
  { area: 'social', title: 'Gargalhadas',                      expectedMonths: 3  },
  { area: 'social', title: 'Demonstra alegria e desgosto',     expectedMonths: 4  },
  { area: 'social', title: 'Reconhece cuidadores principais',  expectedMonths: 5  },
  { area: 'social', title: 'Estranhamento com desconhecidos',  expectedMonths: 7  },
  { area: 'social', title: 'Ansiedade de separação',           expectedMonths: 9  },
  { area: 'social', title: 'Acena "tchau"',                    expectedMonths: 10 },
  { area: 'social', title: 'Brinca de "esconde-achou"',        expectedMonths: 10 },
  { area: 'social', title: 'Busca aprovação dos adultos',      expectedMonths: 12 },
  { area: 'social', title: 'Brinca ao lado de outras crianças',expectedMonths: 15 },
  { area: 'social', title: 'Demonstra empatia básica',         expectedMonths: 18 },
  { area: 'social', title: 'Brinca com outras crianças',       expectedMonths: 20 },
  { area: 'social', title: 'Segue regras simples de jogo',     expectedMonths: 24 },

  // ── Linguagem ─────────────────────────────────────────────────────────────
  { area: 'language', title: 'Reage a sons do ambiente',        expectedMonths: 1  },
  { area: 'language', title: 'Arrulhos e vogais',               expectedMonths: 2  },
  { area: 'language', title: 'Sorri e vocaliza ao ser falado',  expectedMonths: 3  },
  { area: 'language', title: 'Ri em voz alta',                  expectedMonths: 4  },
  { area: 'language', title: 'Balbucia consoante-vogal',        expectedMonths: 5  },
  { area: 'language', title: 'Reage ao próprio nome',           expectedMonths: 6  },
  { area: 'language', title: 'Balbucia sílabas repetidas',      expectedMonths: 7  },
  { area: 'language', title: 'Entende "não"',                   expectedMonths: 9  },
  { area: 'language', title: 'Diz "mama" ou "dada" com sentido',expectedMonths: 10 },
  { area: 'language', title: 'Compreende palavras simples',     expectedMonths: 11 },
  { area: 'language', title: 'Primeira palavra com sentido',    expectedMonths: 12 },
  { area: 'language', title: 'Vocabulário de 5–10 palavras',    expectedMonths: 15 },
  { area: 'language', title: 'Junta duas palavras',             expectedMonths: 18 },
  { area: 'language', title: 'Vocabulário de 50+ palavras',     expectedMonths: 21 },
  { area: 'language', title: 'Frases de 2–3 palavras',          expectedMonths: 24 },
];

const AREA_META: Record<string, { label: string; color: string }> = {
  motor:     { label: 'Motor',     color: colors.motor     },
  cognitive: { label: 'Cognitivo', color: colors.cognitive },
  social:    { label: 'Social',    color: colors.social    },
  language:  { label: 'Linguagem', color: colors.language  },
};

function expectedLabel(months: number): string {
  return months === 1 ? '1 mês' : `${months} meses`;
}

export function getDevelopmentAreas(ageMonths: number): DevelopmentArea[] {
  const areas = ['motor', 'cognitive', 'social', 'language'] as const;

  return areas.map(areaKey => {
    const all = ALL_MILESTONES.filter(m => m.area === areaKey);
    const achieved = all.filter(m => m.expectedMonths <= ageMonths);
    const upcoming = all.filter(m => m.expectedMonths > ageMonths);

    const progress = all.length > 0 ? achieved.length / all.length : 0;

    // Show last 4 achieved (most recent first) and next 3 upcoming
    const achievedTitles = achieved
      .slice(-4)
      .reverse()
      .map(m => m.title);

    const inProgress = upcoming.slice(0, 3).map(m => ({
      title: m.title,
      expected: expectedLabel(m.expectedMonths),
    }));

    return {
      key: areaKey,
      label: AREA_META[areaKey].label,
      color: AREA_META[areaKey].color,
      progress,
      achieved: achievedTitles,
      inProgress,
    };
  });
}
