-- =========================================================
-- 🧀 RATOEIRA — SCHEMA DO BANCO DE DADOS (SUPABASE / POSTGRESQL)
-- Versão de Produção — Banco Zerado (Usuário Zero)
-- =========================================================

-- Extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA DE PERFIS DE USUÁRIOS
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  city TEXT NOT NULL DEFAULT 'Brasil',
  user_class TEXT CHECK (user_class IN ('guardiao', 'rato_ladrao')) DEFAULT 'guardiao',
  avatar_url TEXT,
  xp INTEGER DEFAULT 50,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABELA DE ISQUEIROS (INVENTÁRIO)
CREATE TABLE IF NOT EXISTS lighters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  code_identifier TEXT UNIQUE NOT NULL, -- Ex: RT-042 ou Código EAN 78910...
  nickname TEXT NOT NULL,
  brand_model TEXT CHECK (brand_model IN ('BIC_GRANDE', 'BIC_MINI', 'CLIPPER', 'MACARICO')) DEFAULT 'BIC_GRANDE',
  color_style TEXT NOT NULL DEFAULT '#0070BA',
  color_name TEXT DEFAULT 'Azul',
  photo_url TEXT,
  status TEXT DEFAULT 'NO_BOLSO' CHECK (status IN ('NO_BOLSO', 'PERDIDO', 'FURTADO')),
  current_holder_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABELA DE HISTÓRICO DE CAPTURAS / TROCAS
CREATE TABLE IF NOT EXISTS capture_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lighter_id UUID REFERENCES lighters(id) ON DELETE CASCADE,
  victim_id UUID REFERENCES profiles(id),
  capturer_id UUID REFERENCES profiles(id),
  event_type TEXT CHECK (event_type IN ('RATOEADO', 'DEVOLVIDO', 'ENCONTRADO')),
  location_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABELA DE CONQUISTAS / BADGES DO USUÁRIO
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  badge_name TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ÍNDICES PARA ALTA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_lighters_code ON lighters(code_identifier);
CREATE INDEX IF NOT EXISTS idx_lighters_owner ON lighters(owner_id);
CREATE INDEX IF NOT EXISTS idx_lighters_status ON lighters(status);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- POLÍTICAS DE SEGURANÇA (ROW LEVEL SECURITY - RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lighters ENABLE ROW LEVEL SECURITY;
ALTER TABLE capture_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Permissões de Leitura Pública (para feed e busca de isqueiros no rolê)
CREATE POLICY "Leitura pública de perfis" ON profiles FOR SELECT USING (true);
CREATE POLICY "Leitura pública de isqueiros" ON lighters FOR SELECT USING (true);
CREATE POLICY "Leitura pública de eventos" ON capture_events FOR SELECT USING (true);
CREATE POLICY "Leitura pública de badges" ON user_badges FOR SELECT USING (true);

-- Permissões de Inserção e Modificação
CREATE POLICY "Criação de perfis" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Atualização de perfil próprio" ON profiles FOR UPDATE USING (true);

CREATE POLICY "Criação de isqueiros" ON lighters FOR INSERT WITH CHECK (true);
CREATE POLICY "Atualização de status de isqueiros" ON lighters FOR UPDATE USING (true);
CREATE POLICY "Exclusão de isqueiros" ON lighters FOR DELETE USING (true);

CREATE POLICY "Registro de capturas" ON capture_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Desbloqueio de badges" ON user_badges FOR INSERT WITH CHECK (true);
