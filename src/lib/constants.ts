import { DailyMission, Lighter, PrestigeBadge, UserProfile } from '@/types';

export const RAT_AVATARS = [
  '/avatars/10168944-169b-4bf0-a86d-eefa7ae449b9.webp',
  '/avatars/1424f982-d4be-467e-948c-e3be7b4f2b0c.webp',
  '/avatars/3328c994-cb62-4650-8376-c6b485aa3a59.webp',
  '/avatars/3c0579ab-de54-4a5b-a4e0-78792cf01a9e.webp',
  '/avatars/4079ed92-2fb4-40cd-b6ee-59bf535138c9.webp',
  '/avatars/6a9bf98b-c99a-4e9d-b01d-a2205be3822f.webp',
  '/avatars/80837607-72c6-4da8-8091-a7fcc2acbe86.webp',
  '/avatars/b9621877-295e-46b2-8d76-c90bf2f8e6d0.webp',
  '/avatars/watermarked_img_13570810014542577675.webp',
  '/avatars/watermarked_img_275796448752631315.webp',
];

// Perfil de Usuário Zero (estado inicial limpo para produção)
export const INITIAL_PROFILE: UserProfile = {
  id: 'usr-zero',
  username: 'NOVO_RATO',
  city: 'São Paulo - SP',
  user_class: 'guardiao',
  avatar_url: RAT_AVATARS[0],
  xp: 50,
  level: 1,
  title: 'Rato de Esgoto',
  created_at: new Date().toISOString(),
};

// Inventário inicial zerado para produção
export const INITIAL_LIGHTERS: Lighter[] = [];

// Missões iniciais zeradas
export const INITIAL_MISSIONS: DailyMission[] = [
  {
    id: 'mis-01',
    title: 'Sextou na Toca',
    description: 'Atualize o status de 2 isqueiros hoje',
    xp_reward: 40,
    current: 0,
    total: 2,
    completed: false,
    theme_color: 'green',
  },
  {
    id: 'mis-02',
    title: 'Mão Leve de Fim de Semana',
    description: 'Capture 1 isqueiro no rolê (Modo Ladrão)',
    xp_reward: 120,
    current: 0,
    total: 1,
    completed: false,
    theme_color: 'magenta',
  },
  {
    id: 'mis-03',
    title: 'Expandindo o Bando',
    description: 'Siga 3 novos perfis de ratos na sua região',
    xp_reward: 60,
    current: 0,
    total: 3,
    completed: false,
    theme_color: 'cyan',
  },
];

// Mural de medalhas de prestígio (todas bloqueadas para início do jogo)
export const INITIAL_BADGES: PrestigeBadge[] = [
  {
    id: 'bdg-01',
    name: 'Primeira Vítima',
    description: 'Teve seu primeiro isqueiro surrupiado no rolê.',
    icon: '😭',
    unlocked: false,
  },
  {
    id: 'bdg-02',
    name: 'Houdini',
    description: 'Fez um isqueiro desaparecer em menos de 5 minutos.',
    icon: '🎩',
    unlocked: false,
  },
  {
    id: 'bdg-03',
    name: 'Cleptomaníaco',
    description: 'Coleção de espólios com mais de 5 isqueiros capturados.',
    icon: '🥷',
    unlocked: false,
  },
  {
    id: 'bdg-04',
    name: 'Xerife do Fogo',
    description: 'Devolveu 3 isqueiros perdidos para os verdadeiros donos.',
    icon: '🤠',
    unlocked: false,
  },
  {
    id: 'bdg-05',
    name: 'Sommelier',
    description: 'Possui em inventário pelo menos 4 modelos diferentes (Bic, Clipper, Mini, Maçarico).',
    icon: '🍷',
    unlocked: false,
  },
  {
    id: 'bdg-06',
    name: 'Imã de Encrenca',
    description: 'Perdeu 2 isqueiros no mesmíssimo dia.',
    icon: '🧲',
    unlocked: false,
  },
];

export const LIGHTER_COLORS = [
  { name: 'Azul', hex: '#0070BA' },
  { name: 'Rosa Choque', hex: '#FF007F' },
  { name: 'Verde Neon', hex: '#39FF14' },
  { name: 'Amarelo', hex: '#FFE600' },
  { name: 'Vermelho', hex: '#EF4444' },
  { name: 'Preto', hex: '#1C1917' },
  { name: 'Estampado', hex: '#8B5CF6' },
];
