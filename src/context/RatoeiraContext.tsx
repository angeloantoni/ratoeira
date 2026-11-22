'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  UserProfile, 
  Lighter, 
  DailyMission, 
  PrestigeBadge, 
  CaptureAlert, 
  LighterStatus 
} from '@/types';
import { 
  INITIAL_PROFILE, 
  INITIAL_LIGHTERS, 
  INITIAL_MISSIONS, 
  INITIAL_BADGES 
} from '@/lib/constants';
import { sound } from '@/lib/soundfx';

interface XpToastData {
  id: number;
  amount: number;
  reason: string;
}

interface RatoeiraContextType {
  profile: UserProfile;
  lighters: Lighter[];
  missions: DailyMission[];
  badges: PrestigeBadge[];
  activeAlert: CaptureAlert | null;
  isAudioEnabled: boolean;
  isDrawerOpen: boolean;
  xpToast: XpToastData | null;
  toggleDrawer: () => void;
  toggleAudio: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addLighter: (lighter: Omit<Lighter, 'id' | 'created_at' | 'owner_id'>) => Lighter;
  updateLighterStatus: (id: string, status: LighterStatus) => void;
  deleteLighter: (id: string) => void;
  addXP: (amount: number, reason?: string) => void;
  triggerRatAlert: (lighter?: Lighter) => void;
  dismissAlert: (penalty?: boolean) => void;
  claimMission: (missionId: string) => void;
  resetToDefaults: () => void;
}

const RatoeiraContext = createContext<RatoeiraContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'ratoeira_profile_prod_v2',
  LIGHTERS: 'ratoeira_lighters_prod_v2',
  MISSIONS: 'ratoeira_missions_prod_v2',
  BADGES: 'ratoeira_badges_prod_v2',
  AUDIO: 'ratoeira_audio_enabled_v2',
};

export const RatoeiraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [lighters, setLighters] = useState<Lighter[]>(INITIAL_LIGHTERS);
  const [missions, setMissions] = useState<DailyMission[]>(INITIAL_MISSIONS);
  const [badges, setBadges] = useState<PrestigeBadge[]>(INITIAL_BADGES);
  const [activeAlert, setActiveAlert] = useState<CaptureAlert | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [xpToast, setXpToast] = useState<XpToastData | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
      const storedLighters = localStorage.getItem(STORAGE_KEYS.LIGHTERS);
      const storedMissions = localStorage.getItem(STORAGE_KEYS.MISSIONS);
      const storedBadges = localStorage.getItem(STORAGE_KEYS.BADGES);
      const storedAudio = localStorage.getItem(STORAGE_KEYS.AUDIO);

      if (storedProfile) setProfile(JSON.parse(storedProfile));
      if (storedLighters) setLighters(JSON.parse(storedLighters));
      if (storedMissions) setMissions(JSON.parse(storedMissions));
      if (storedBadges) setBadges(JSON.parse(storedBadges));
      if (storedAudio !== null) {
        const val = JSON.parse(storedAudio);
        setIsAudioEnabled(val);
        sound.setEnabled(val);
      }
    } catch (e) {
      console.warn('Erro ao carregar dados do LocalStorage:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save changes to local storage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      localStorage.setItem(STORAGE_KEYS.LIGHTERS, JSON.stringify(lighters));
      localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));
      localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
      localStorage.setItem(STORAGE_KEYS.AUDIO, JSON.stringify(isAudioEnabled));
    } catch (e) {
      console.warn('Erro ao salvar no LocalStorage:', e);
    }
  }, [profile, lighters, missions, badges, isAudioEnabled, isHydrated]);

  const toggleDrawer = () => {
    sound.click();
    setIsDrawerOpen((prev) => !prev);
  };

  const toggleAudio = () => {
    setIsAudioEnabled((prev) => {
      const next = !prev;
      sound.setEnabled(next);
      if (next) sound.click();
      return next;
    });
  };

  const calculateTitleAndLevel = (xp: number) => {
    if (xp < 300) return { level: 1, title: 'Rato de Esgoto' };
    if (xp < 700) return { level: 2, title: 'Rato Calouro' };
    if (xp < 1200) return { level: 3, title: 'Rato Esperto' };
    if (xp < 1800) return { level: 4, title: 'Rato Experiente' };
    if (xp < 2600) return { level: 5, title: 'Rato de Beco' };
    if (xp < 4000) return { level: 6, title: 'Barão do Fogo' };
    return { level: 7, title: 'Rei da Ratoeira' };
  };

  const addXP = (amount: number, reason: string = 'Ação no rolê') => {
    sound.xpGain();
    setXpToast({ id: Date.now(), amount, reason });
    setTimeout(() => {
      setXpToast((current) => (current?.id === Date.now() ? null : current));
    }, 3000);

    setProfile((prev) => {
      const newXp = Math.max(0, prev.xp + amount);
      const { level, title } = calculateTitleAndLevel(newXp);
      return {
        ...prev,
        xp: newXp,
        level,
        title,
      };
    });
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    sound.click();
    setProfile((prev) => {
      const updated = { ...prev, ...updates };
      const { level, title } = calculateTitleAndLevel(updated.xp);
      return { ...updated, level, title };
    });
  };

  const addLighter = (lighterData: Omit<Lighter, 'id' | 'created_at' | 'owner_id'>): Lighter => {
    const newLighter: Lighter = {
      ...lighterData,
      id: 'lt-' + Date.now().toString(36),
      owner_id: profile.id,
      created_at: new Date().toISOString(),
    };

    setLighters((prev) => [newLighter, ...prev]);
    addXP(100, 'Isqueiro fichado na Ratoeira!');
    return newLighter;
  };

  const updateLighterStatus = (id: string, status: LighterStatus) => {
    sound.click();
    setLighters((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );

    // Update daily mission "Sextou na Toca" if not complete
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === 'mis-01' && !m.completed) {
          const nextVal = Math.min(m.total, m.current + 1);
          return {
            ...m,
            current: nextVal,
            completed: nextVal >= m.total,
          };
        }
        return m;
      })
    );
  };

  const deleteLighter = (id: string) => {
    sound.click();
    setLighters((prev) => prev.filter((item) => item.id !== id));
  };

  const triggerRatAlert = (lighter?: Lighter) => {
    const targetLighter = lighter || lighters.find((l) => l.status === 'PERDIDO') || lighters[0];
    sound.ratAlert();
    setActiveAlert({
      id: 'alert-' + Date.now(),
      lighter: targetLighter,
      offender_username: 'lucas_sp',
      penalty_xp: 50,
      time_ago: 'agora mesmo',
    });
  };

  const dismissAlert = (applyPenalty: boolean = false) => {
    sound.click();
    if (applyPenalty && activeAlert) {
      addXP(-activeAlert.penalty_xp, 'Ratoeado no rolê');
    }
    setActiveAlert(null);
  };

  const claimMission = (missionId: string) => {
    const mission = missions.find((m) => m.id === missionId);
    if (!mission || !mission.completed) return;
    addXP(mission.xp_reward, `Missão cumprida: ${mission.title}`);
  };

  const resetToDefaults = () => {
    sound.click();
    setProfile(INITIAL_PROFILE);
    setLighters(INITIAL_LIGHTERS);
    setMissions(INITIAL_MISSIONS);
    setBadges(INITIAL_BADGES);
    setActiveAlert(null);
    localStorage.clear();
  };

  return (
    <RatoeiraContext.Provider
      value={{
        profile,
        lighters,
        missions,
        badges,
        activeAlert,
        isAudioEnabled,
        isDrawerOpen,
        xpToast,
        toggleDrawer,
        toggleAudio,
        updateProfile,
        addLighter,
        updateLighterStatus,
        deleteLighter,
        addXP,
        triggerRatAlert,
        dismissAlert,
        claimMission,
        resetToDefaults,
      }}
    >
      {children}
    </RatoeiraContext.Provider>
  );
};

export const useRatoeira = () => {
  const context = useContext(RatoeiraContext);
  if (!context) {
    throw new Error('useRatoeira deve ser usado dentro de RatoeiraProvider');
  }
  return context;
};
