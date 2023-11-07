import { IBorderRadius } from 'shared/types/props';
import { BorderRadius } from './const';

/**
 * Helpers for work with border radius
 */

export const defaultBorderRadius: IBorderRadius = { tl: BorderRadius.Normal, tr: BorderRadius.Normal, bl: BorderRadius.Normal, br: BorderRadius.Normal }

export function generateBorderRadiusCSS(config: IBorderRadius = defaultBorderRadius): string {
  return [
    `br-tl-${config.tl}`,
    `br-tr-${config.tr}`,
    `br-bl-${config.bl}`,
    `br-br-${config.br}`,
  ].join(" ");
}