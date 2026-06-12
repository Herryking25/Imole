export interface Profile {
  id?: string;
  name: string;
  age: number;
  language: "en" | "yo" | "pcm";
  createdAt: string;
}

export interface Session {
  date: string; // YYYY-MM-DD
  skillArea: "mentalMath" | "speaking" | "finance" | "creativity" | "emotionalIQ";
  challengeId: string;
  response: string;
  score: number;
  completedAt: string;
}

export interface Streak {
  current: number;
  best: number;
  lastCompletedDate: string; // YYYY-MM-DD
}

export interface Scores {
  mentalMath: number;
  speaking: number;
  finance: number;
  creativity: number;
  emotionalIQ: number;
  totalXp: number;
}

interface AccountData {
  profile: Profile;
  sessions: Session[];
  streak: Streak;
  scores: Scores;
}

const KEYS = {
  PROFILE: "imole_profile",
  SESSIONS: "imole_sessions",
  STREAK: "imole_streak",
  SCORES: "imole_scores",
  ACCOUNTS: "imole_accounts",
  ACTIVE_ACCOUNT_ID: "imole_active_account_id"
};

function createAccountId(): string {
  return `imole_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// Helper to get formatted date string (YYYY-MM-DD) in local time
export function getLocalDateString(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper to parse date string into local date midnight
function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export const StorageService = {
  // --- PROFILE ---
  getProfile(): Profile | null {
    const data = localStorage.getItem(KEYS.PROFILE);
    const profile: Profile | null = data ? JSON.parse(data) : null;
    if (profile && !profile.id) {
      const migratedProfile = { ...profile, id: createAccountId() };
      this.saveProfile(migratedProfile);
      return migratedProfile;
    }
    return profile;
  },

  saveProfile(profile: Profile): void {
    const nextProfile = profile.id ? profile : { ...profile, id: createAccountId() };
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(nextProfile));
    localStorage.setItem(KEYS.ACTIVE_ACCOUNT_ID, nextProfile.id);
    this.saveActiveAccountData(nextProfile);
  },

  getAccounts(): Profile[] {
    const data = localStorage.getItem(KEYS.ACCOUNTS);
    const accounts: Record<string, AccountData> = data ? JSON.parse(data) : {};
    return Object.values(accounts)
      .map(account => account.profile)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  signIn(accountId: string): Profile | null {
    const accounts = this.getAccountMap();
    const account = accounts[accountId];
    if (!account) return null;

    localStorage.setItem(KEYS.PROFILE, JSON.stringify(account.profile));
    localStorage.setItem(KEYS.ACTIVE_ACCOUNT_ID, account.profile.id || accountId);
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(account.sessions));
    localStorage.setItem(KEYS.STREAK, JSON.stringify(account.streak));
    localStorage.setItem(KEYS.SCORES, JSON.stringify(account.scores));
    return account.profile;
  },

  signOut(): void {
    const activeProfile = this.getProfile();
    if (activeProfile) {
      this.saveActiveAccountData(activeProfile);
    }

    localStorage.removeItem(KEYS.PROFILE);
    localStorage.removeItem(KEYS.ACTIVE_ACCOUNT_ID);
    localStorage.removeItem(KEYS.SESSIONS);
    localStorage.removeItem(KEYS.STREAK);
    localStorage.removeItem(KEYS.SCORES);
  },

  // --- SESSIONS ---
  getSessions(): Session[] {
    const data = localStorage.getItem(KEYS.SESSIONS);
    return data ? JSON.parse(data) : [];
  },

  saveSession(session: Session): void {
    const sessions = this.getSessions();
    sessions.push(session);
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
  },

  hasCompletedToday(): boolean {
    const sessions = this.getSessions();
    const todayStr = getLocalDateString();
    return sessions.some(s => s.date === todayStr);
  },

  // --- STREAK ---
  getStreak(): Streak {
    const data = localStorage.getItem(KEYS.STREAK);
    const defaultStreak: Streak = { current: 0, best: 0, lastCompletedDate: "" };
    if (!data) return defaultStreak;
    
    const streak: Streak = JSON.parse(data);
    
    // Check if streak is broken (more than 1 day has passed since last completed date)
    if (streak.lastCompletedDate) {
      const todayStr = getLocalDateString();
      if (streak.lastCompletedDate !== todayStr) {
        const lastDate = parseLocalDate(streak.lastCompletedDate);
        const todayDate = parseLocalDate(todayStr);
        const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 1) {
          // Streak broken! Reset current streak
          streak.current = 0;
          this.saveStreak(streak);
        }
      }
    }
    
    return streak;
  },

  saveStreak(streak: Streak): void {
    localStorage.setItem(KEYS.STREAK, JSON.stringify(streak));
  },

  updateStreakOnCompletion(): Streak {
    const streak = this.getStreak();
    const todayStr = getLocalDateString();

    if (streak.lastCompletedDate === todayStr) {
      // Already completed today, do not increment streak again
      return streak;
    }

    if (streak.lastCompletedDate) {
      const lastDate = parseLocalDate(streak.lastCompletedDate);
      const todayDate = parseLocalDate(todayStr);
      const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Completed consecutive day
        streak.current += 1;
      } else {
        // Streak was broken, set to 1
        streak.current = 1;
      }
    } else {
      // First completion ever
      streak.current = 1;
    }

    if (streak.current > streak.best) {
      streak.best = streak.current;
    }

    streak.lastCompletedDate = todayStr;
    this.saveStreak(streak);
    return streak;
  },

  // --- SCORES ---
  getScores(): Scores {
    const data = localStorage.getItem(KEYS.SCORES);
    const defaultScores: Scores = {
      mentalMath: 0,
      speaking: 0,
      finance: 0,
      creativity: 0,
      emotionalIQ: 0,
      totalXp: 0
    };
    return data ? JSON.parse(data) : defaultScores;
  },

  saveScores(scores: Scores): void {
    localStorage.setItem(KEYS.SCORES, JSON.stringify(scores));
  },

  addScore(skillArea: keyof Omit<Scores, "totalXp">, score: number, xp: number): Scores {
    const scores = this.getScores();
    scores[skillArea] += score;
    scores.totalXp += xp;
    this.saveScores(scores);
    return scores;
  },

  // --- RESET ALL DATA ---
  resetAllData(): void {
    const activeProfile = this.getProfile();
    if (activeProfile?.id) {
      const accounts = this.getAccountMap();
      delete accounts[activeProfile.id];
      this.saveAccountMap(accounts);
    }

    localStorage.removeItem(KEYS.PROFILE);
    localStorage.removeItem(KEYS.SESSIONS);
    localStorage.removeItem(KEYS.STREAK);
    localStorage.removeItem(KEYS.SCORES);
    localStorage.removeItem(KEYS.ACTIVE_ACCOUNT_ID);
  },

  getAccountMap(): Record<string, AccountData> {
    const data = localStorage.getItem(KEYS.ACCOUNTS);
    return data ? JSON.parse(data) : {};
  },

  saveAccountMap(accounts: Record<string, AccountData>): void {
    localStorage.setItem(KEYS.ACCOUNTS, JSON.stringify(accounts));
  },

  saveActiveAccountData(profile: Profile): void {
    const id = profile.id || createAccountId();
    const nextProfile = { ...profile, id };
    const accounts = this.getAccountMap();

    accounts[id] = {
      profile: nextProfile,
      sessions: this.getSessions(),
      streak: this.getStreak(),
      scores: this.getScores()
    };

    this.saveAccountMap(accounts);
  }
};
