export type UserClass = 'guardiao' | 'rato_ladrao';

export type LighterModel = 'BIC_GRANDE' | 'BIC_MINI' | 'CLIPPER' | 'MACARICO';

export type LighterStatus = 'NO_BOLSO' | 'PERDIDO' | 'FURTADO';

export interface UserProfile {
  id: string;
  username: string;
  city: string;
  user_class: UserClass;
  avatar_url: string;
  xp: number;
  level: number;
  title: string;
  created_at: string;
}

export interface Lighter {
  id: string;
  owner_id: string;
  code_identifier: string; // e.g. RT-042 or EAN barcode 7891020304050
  nickname: string;
  brand_model: LighterModel;
  color_style: string; // Hex color or styling tag
  color_name: string;
  photo_url?: string;
  status: LighterStatus;
  is_spoils?: boolean; // Capturado de outro usuário (Espólio)
  original_owner?: string;
  current_holder_id?: string;
  created_at: string;
  lost_notes?: string;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  xp_reward: number;
  current: number;
  total: number;
  completed: boolean;
  theme_color: 'green' | 'magenta' | 'cyan';
}

export interface PrestigeBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlocked_at?: string;
}

export interface CaptureAlert {
  id: string;
  lighter: Lighter;
  offender_username: string;
  penalty_xp: number;
  time_ago: string;
}
