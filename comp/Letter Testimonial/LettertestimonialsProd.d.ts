export interface LettertestimonialsprodProps {
  /**
   * Entries
   * @default [{"greeting":{},"body":{},"signature":{}},{"greeting":{},"body":{},"signature":{}},{"greeting":{},"body":{},"signature":{}}]
   */
  entries?: unknown[];
  /**
   * Entry — pass as `currentEntry` not `entry`.
   * Range: min: 1, max: 10, step: 1
   * @default 1
   */
  currentEntry?: number;
  /**
   * Direction — pass as `flipDirection` not `direction`.
   * Options: "front" | "back"
   * @default "back"
   */
  flipDirection?: 'front' | 'back';
  /**
   * Size — pass as `letterSize` not `size`.
   * Range: min: 0.25, max: 1, step: 0.05
   * @default 0.75
   */
  letterSize?: number;
  /**
   * Transition
   * @default {"type":"tween","duration":0.8,"ease":"easeOut"}
   */
  transition?: object;
  /**
   * Shadows
   */
  shadows?: Record<string, unknown>;
  /**
   * Paper — pass as `letterPaperColor` not `paper`.
   */
  letterPaperColor?: string;
  /**
   * Body — pass as `bodyFont` not `body`.
   * @default {"fontSize":17,"fontFamily":"Inter, system-ui, sans-serif","fontWeight":"400"}
   */
  bodyFont?: string;
  /**
   * ㅤ — pass as `bodyColor` not `ㅤ`.
   */
  bodyColor?: string;
  /**
   * Signature — pass as `signatureFont` not `signature`.
   * @default {"fontSize":32,"fontFamily":"Caveat, cursive","fontStyle":"italic","fontWeight":"500"}
   */
  signatureFont?: string;
  /**
   * ㅤ — pass as `signatureColor` not `ㅤ`.
   */
  signatureColor?: string;
  /** Additional properties */
  [key: string]: unknown;
}
