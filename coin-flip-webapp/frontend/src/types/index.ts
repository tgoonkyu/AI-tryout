/**
 * Common type definitions for the Coin Flip Application
 */

// ========== API Response Types ==========

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

// ========== Authentication Types ==========

export interface User {
  userId: string;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

// ========== Flip Types ==========

export type FlipResult = 'HEADS' | 'TAILS';

export interface Flip {
  flipId: string;
  result: FlipResult;
  createdAt: string;
  ownerType: 'user' | 'guest';
}

export interface FlipHistoryEntry {
  flipId: string;
  result: FlipResult;
  createdAt: string;
  serialNumber: number;
}

export interface FlipRequest {
  userId?: string;
  sessionId?: string;
}

export interface FlipResponse {
  flipId: string;
  result: FlipResult;
  timestamp: string;
  ownerType: 'user' | 'guest';
}

// ========== Statistics Types ==========

export interface PeriodStats {
  totalFlips: number;
  headsCount: number;
  tailsCount: number;
  headsRatio: number;
  startDate: string;
  endDate: string;
}

export interface StatsResponse {
  totalFlips: number;
  headsCount: number;
  tailsCount: number;
  headsRatio: number;
  tailsRatio: number;
  today: PeriodStats;
  thisWeek: PeriodStats;
  thisMonth: PeriodStats;
}

// ========== UI State Types ==========

export type ThemeMode = 'light' | 'dark';

export interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
}

export interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playFlipStart: () => void;
  playCoinRattle: () => void;
  stopCoinRattle: () => void;
  playFlipEnd: (result: FlipResult) => void;
}

// ========== Animation Types ==========

export interface AnimationSettings {
  skipAnimation: boolean;
  animationDuration: number;
  showPreview: boolean;
}

export interface CoinAnimationProps {
  isFlipping: boolean;
  result?: FlipResult;
  onAnimationComplete: (result: FlipResult) => void;
  skipAnimation?: boolean;
  duration?: number;
}

// ========== Component Props Types ==========

export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  color?: 'primary' | 'secondary' | 'inherit';
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export interface TableColumn<T> {
  id: keyof T;
  label: string;
  align?: 'left' | 'center' | 'right';
  format?: (value: any) => string;
  sortable?: boolean;
  minWidth?: number;
}

// ========== Form Types ==========

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FormErrors;
}

// ========== Local Storage Types ==========

export interface StorageKeys {
  AUTH_TOKEN: 'coinflip_auth_token';
  USER_DATA: 'coinflip_user_data';
  THEME_MODE: 'coinflip_theme_mode';
  SOUND_MUTED: 'coinflip_sound_muted';
  SKIP_ANIMATION: 'coinflip_skip_animation';
  GUEST_HISTORY: 'coinflip_guest_history';
  GUEST_SESSION_ID: 'coinflip_guest_session_id';
}

// ========== API Endpoint Types ==========

export interface ApiEndpoints {
  auth: {
    login: '/auth/login';
    register: '/auth/register';
    logout: '/auth/logout';
    validate: '/auth/validate';
  };
  flip: {
    create: '/flip';
  };
  history: {
    list: '/history';
    clear: '/history';
  };
  stats: {
    summary: '/stats/summary';
  };
  user: {
    profile: '/user/profile';
  };
}