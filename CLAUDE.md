@AGENTS.md

# baby-dev-app — Contexto para Claude

## O que é
App React Native (Expo) para acompanhamento do desenvolvimento de bebês. Em português (pt-BR). Desenvolvido por Leonardo Barbosa.

## Como rodar
```bash
cd /Users/leobarbosa/baby-dev-app
npx expo start --clear
```
Escanear QR no Expo Go. IP local costuma ser `192.168.2.102:8081`.

## Stack
- React Native + Expo SDK 54 (TypeScript)
- `@react-navigation/native` + `@react-navigation/bottom-tabs`
- `@react-native-async-storage/async-storage`
- `@expo/vector-icons` (Ionicons)
- Google Fonts: Nunito (títulos) + Inter (corpo) via `useFonts`
- `npm install --legacy-peer-deps` (há conflitos de peer deps)

## Estrutura de pastas relevante
```
src/
  components/
    Card.tsx           — card base com sombra
    Badge.tsx          — badge colorida
    ProgressBar.tsx    — barra de progresso
    StatusBadge.tsx    — badge de status de vacina (aplicada/pendente/atrasada)
    VacinaCard.tsx     — card de vacina com botão "Marcar como aplicada"
  context/
    BabyContext.tsx    — contexto global com nome, idade e data de nascimento do bebê
  data/
    mockData.ts        — atividades e áreas de desenvolvimento (mock)
    vacinasData.ts     — 24 vacinas SUS 2024 + calcularCartao()
  navigation/
    index.tsx          — state machine de onboarding + tab navigator
  screens/
    HomeScreen.tsx
    ActivitiesScreen.tsx
    ProgressScreen.tsx
    ProfileScreen.tsx
    VacinasScreen.tsx
    onboarding/
      WelcomeScreen.tsx
      BabyInfoScreen.tsx
      AllSetScreen.tsx
  theme/
    index.ts           — colors, spacing, typography, radius, shadows
```

## AsyncStorage — chaves usadas
| Chave | Conteúdo |
|---|---|
| `onboardingDone` | `'true'` quando onboarding concluído |
| `babyName` | nome do bebê (string) |
| `babyMonth` | mês de nascimento 0-11 (string) |
| `babyYear` | ano de nascimento (string) |
| `vacinasAplicadas` | JSON array de IDs de vacinas aplicadas |

## Fluxo de navegação
`navigation/index.tsx` controla um state machine:
- `loading` → lê AsyncStorage
- `welcome` → WelcomeScreen
- `babyInfo` → BabyInfoScreen
- `allSet` → AllSetScreen
- `done` → Tab navigator (Home / Atividades / Progresso / Vacinas / Perfil) envolto em `<BabyProvider>`

## BabyContext
Lê `babyName`, `babyMonth`, `babyYear` do AsyncStorage e expõe:
- `name` — string
- `age` — ex: "8 meses"
- `birthDate` — ex: "setembro de 2025"
- `birthDateObj` — objeto Date

Todos os screens usam `useBaby()` para acessar esses dados.

## Bug conhecido (corrigir primeiro)
**VacinasScreen.tsx linha 1:** `useEffect` não está importado. Corrigir:
```ts
import React, { useState, useEffect } from 'react';
```

## Próximos passos (backlog priorizado)
1. Corrigir bug useEffect em VacinasScreen.tsx (urgente)
2. Modal de registro — botões "Sono", "Mamou", "Cresceu" na HomeScreen não fazem nada. Precisa de modal com inputs de hora/duração salvando em AsyncStorage.
3. Dados reais no ProgressScreen — desenvolvimento ainda usa mock estático.
4. Backend Supabase — login, sync em nuvem, dados reais entre dispositivos.
5. Animações — micro-interações, progress bars animadas, transições de tela.
