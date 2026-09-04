
export type QRType = 'url' | 'fastcall' | 'text' | 'vcard' | 'wifi' | 'email' | 'sms' | 'facebook' | 'pdf' | 'mp3' | 'appstore' | 'images' | 'tiktok';


export type DotType = 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';
export type CornerType = 'square' | 'dot' | 'extra-rounded';

export interface QRConfig {
  value: string;
  size: number;
  fgColor: string;
  bgColor: string;
  level: 'L' | 'M' | 'Q' | 'H';
  includeMargin: boolean;
  dotType: DotType;
  cornerType: CornerType;
}
