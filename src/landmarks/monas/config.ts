export const WORLD_SCALE = 0.1

export const MONAS_CONFIG = {
  totalHeight: 132 * WORLD_SCALE,
  museumWidth: 45 * WORLD_SCALE,
  museumHeight: 8 * WORLD_SCALE,
  cupTopHeight: 17 * WORLD_SCALE,
  towerTopHeight: 115 * WORLD_SCALE,
  flameHeight: 14 * WORLD_SCALE,
  flameWidth: 6 * WORLD_SCALE,
  towerBottomWidth: 3.6 * WORLD_SCALE,
  towerTopWidth: 2.5 * WORLD_SCALE,
  observationWidth: 11 * WORLD_SCALE,
  dioramaSize: 18,
} as const

export const MONAS_LEVELS = {
  museumCenter: MONAS_CONFIG.museumHeight / 2,
  cupCenter: 1.25,
  shaftBottom: MONAS_CONFIG.cupTopHeight,
  shaftHeight: MONAS_CONFIG.towerTopHeight - MONAS_CONFIG.cupTopHeight,
  observationCenter: MONAS_CONFIG.towerTopHeight - 0.12,
  flameCenter: MONAS_CONFIG.totalHeight - MONAS_CONFIG.flameHeight / 2,
} as const
