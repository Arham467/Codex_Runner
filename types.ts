/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


export enum GameStatus {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  SHOP = 'SHOP',
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY',
  SETTINGS = 'SETTINGS',
  PAUSED = 'PAUSED',
  CREATOR = 'CREATOR'
}

export enum ObjectType {
  OBSTACLE = 'OBSTACLE',
  GEM = 'GEM',
  LETTER = 'LETTER',
  SHOP_PORTAL = 'SHOP_PORTAL',
  ALIEN = 'ALIEN',
  MISSILE = 'MISSILE'
}

export interface GameObject {
  id: string;
  type: ObjectType;
  position: [number, number, number]; // x, y, z
  active: boolean;
  value?: string; // For letters (C, O, D...)
  color?: string;
  targetIndex?: number; // Index in the CODEX target word
  points?: number; // Score value for gems
  hasFired?: boolean; // For Aliens
}

export const LANE_WIDTH = 2.2;
export const JUMP_HEIGHT = 2.5;
export const JUMP_DURATION = 0.6; // seconds
export const RUN_SPEED_BASE = 22.5;
export const SPAWN_DISTANCE = 120;
export const REMOVE_DISTANCE = 20; // Behind player

// Letter Color Mapping
export const LETTER_COLORS: Record<string, string> = {
    'C': '#00ffff', // Cyan
    'O': '#ff9100', // Orange
    'D': '#ff00ff', // Pink/Magenta
    'E': '#39ff14', // Lime/Neon Green
    'X': '#bc13fe', // Purple
    'H': '#ff3d00', // Deep Orange
    'A': '#faff00', // Yellow
    'N': '#00e5ff', // Light Blue
    'S': '#d500f9', // Purple
    'K': '#76ff03', // Light Green
    'P': '#ff4081', // Pink
    'I': '#3d5afe', // Indigo
};

export const LEVEL_TARGETS: Record<number, string[]> = {
    1: ['C', 'O', 'D', 'E', 'X'],
    2: ['H', 'A', 'N', 'D', 'S', 'H', 'A', 'K', 'E'],
    3: ['O', 'P', 'E', 'N', 'A', 'I'],
};

export interface ShopItem {
    id: string;
    name: string;
    description: string;
    cost: number;
    icon: any; // Lucide icon component
    oneTime?: boolean; // If true, remove from pool after buying
}
