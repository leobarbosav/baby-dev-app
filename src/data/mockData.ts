export const baby = {
  name: 'Sofia',
  age: '8 meses',
  birthDate: '15/09/2025',
  birthDateObj: new Date('2025-09-15'),
  photo: null,
};

export const activities = [
  {
    id: '1',
    title: 'Dançando com música',
    area: 'Motor Grosso',
    areaKey: 'motor',
    duration: 15,
    stars: 5,
    done: false,
    description: 'Coloque uma música animada e dance com o bebê no colo, movimentando os braços e o corpo no ritmo.',
  },
  {
    id: '2',
    title: 'Jogo de espelhos',
    area: 'Social',
    areaKey: 'social',
    duration: 10,
    stars: 4,
    done: false,
    description: 'Mostre o reflexo do bebê no espelho. Faça expressões e incentive-o a imitar.',
  },
  {
    id: '3',
    title: 'Pintando com pincéis',
    area: 'Motor Fino',
    areaKey: 'motor',
    duration: 10,
    stars: 5,
    done: true,
    completedAt: '09:30',
    description: 'Use tinta atóxica e pincéis macios para estimular a coordenação motora fina.',
  },
];

export const sleepRecords = [
  { id: '1', date: '2026-05-20', start: '09:00', end: '10:30', duration: 90 },
  { id: '2', date: '2026-05-20', start: '13:00', end: '14:45', duration: 105 },
  { id: '3', date: '2026-05-19', start: '09:15', end: '10:45', duration: 90 },
  { id: '4', date: '2026-05-19', start: '13:30', end: '15:30', duration: 120 },
  { id: '5', date: '2026-05-18', start: '08:45', end: '10:00', duration: 75 },
];

export const feedingRecords = [
  { id: '1', date: '2026-05-20', time: '07:00', type: 'Amamentação', amount: '20 min' },
  { id: '2', date: '2026-05-20', time: '10:45', type: 'Mamadeira', amount: '150 ml' },
  { id: '3', date: '2026-05-20', time: '13:00', type: 'Papa', amount: '180g' },
];

export const developmentAreas = [
  {
    key: 'motor',
    label: 'Motor',
    color: '#5B8FF9',
    progress: 0.8,
    achieved: ['Senta sem apoio', 'Transfere objetos', 'Rola dos dois lados'],
    inProgress: [
      { title: 'Engatinhar', expected: '8-10 meses' },
      { title: 'Pegar objetos pequenos', expected: '9 meses' },
    ],
  },
  {
    key: 'cognitive',
    label: 'Cognitivo',
    color: '#9B59B6',
    progress: 0.6,
    achieved: ['Reconhece o próprio nome', 'Busca objetos escondidos'],
    inProgress: [
      { title: 'Imitar gestos simples', expected: '8-9 meses' },
    ],
  },
  {
    key: 'social',
    label: 'Social',
    color: '#F4A35B',
    progress: 0.7,
    achieved: ['Sorri em resposta', 'Estranhamento'],
    inProgress: [
      { title: 'Acena tchau', expected: '9-10 meses' },
    ],
  },
  {
    key: 'language',
    label: 'Linguagem',
    color: '#2ECC71',
    progress: 0.5,
    achieved: ['Balbucia sílabas', 'Reage ao próprio nome'],
    inProgress: [
      { title: 'Diz "mama" ou "dada"', expected: '10 meses' },
    ],
  },
];
