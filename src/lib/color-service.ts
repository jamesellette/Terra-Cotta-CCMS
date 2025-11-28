export type HarmonyType = 
  | 'complementary' 
  | 'analogous' 
  | 'triadic' 
  | 'split-complementary'
  | 'tetradic'
  | 'square'
  | 'monochromatic';

export type ExportFormat = 'hex' | 'rgb' | 'hsl' | 'cmyk' | 'css' | 'json' | 'ase' | 'aco';

export interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  cmyk: { c: number; m: number; y: number; k: number };
  name?: string;
}

export interface GradientStop {
  color: Color;
  position: number;
}

export interface ColorPalette {
  id: string;
  name: string;
  colors: Color[];
  harmony?: HarmonyType;
  createdAt: number;
}

export class ColorService {
  hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  }

  rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }

  hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }

  rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const k = 1 - Math.max(r, g, b);
    const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
    const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
    const y = k === 1 ? 0 : (1 - b - k) / (1 - k);

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100),
    };
  }

  hexToColor(hex: string): Color {
    const rgb = this.hexToRgb(hex);
    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    const cmyk = this.rgbToCmyk(rgb.r, rgb.g, rgb.b);

    return { hex, rgb, hsl, cmyk };
  }

  generatePalette(baseColor: string, harmony: HarmonyType): Color[] {
    const base = this.hexToColor(baseColor);
    const hue = base.hsl.h;
    const sat = base.hsl.s;
    const light = base.hsl.l;

    let hues: number[] = [];

    switch (harmony) {
      case 'complementary':
        hues = [hue, (hue + 180) % 360];
        break;
      case 'analogous':
        hues = [(hue - 30 + 360) % 360, hue, (hue + 30) % 360];
        break;
      case 'triadic':
        hues = [hue, (hue + 120) % 360, (hue + 240) % 360];
        break;
      case 'split-complementary':
        hues = [hue, (hue + 150) % 360, (hue + 210) % 360];
        break;
      case 'tetradic':
        hues = [hue, (hue + 90) % 360, (hue + 180) % 360, (hue + 270) % 360];
        break;
      case 'square':
        hues = [hue, (hue + 90) % 360, (hue + 180) % 360, (hue + 270) % 360];
        break;
      case 'monochromatic':
        const mono1 = this.hslToRgb(hue, sat, Math.max(10, light - 20));
        const mono2 = this.hslToRgb(hue, sat, Math.max(5, light - 10));
        const mono3 = this.hslToRgb(hue, sat, Math.min(95, light + 10));
        const mono4 = this.hslToRgb(hue, sat, Math.min(100, light + 20));
        return [
          this.hexToColor(this.rgbToHex(mono1.r, mono1.g, mono1.b)),
          this.hexToColor(this.rgbToHex(mono2.r, mono2.g, mono2.b)),
          base,
          this.hexToColor(this.rgbToHex(mono3.r, mono3.g, mono3.b)),
          this.hexToColor(this.rgbToHex(mono4.r, mono4.g, mono4.b)),
        ];
    }

    return hues.map(h => {
      const rgb = this.hslToRgb(h, sat, light);
      return this.hexToColor(this.rgbToHex(rgb.r, rgb.g, rgb.b));
    });
  }

  extractFromImage(imageData: ImageData, maxColors: number = 16): Color[] {
    const pixels = imageData.data;
    const colorMap = new Map<string, number>();

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];

      if (a < 128) continue;

      const quantized = {
        r: Math.round(r / 32) * 32,
        g: Math.round(g / 32) * 32,
        b: Math.round(b / 32) * 32,
      };

      const key = `${quantized.r},${quantized.g},${quantized.b}`;
      colorMap.set(key, (colorMap.get(key) || 0) + 1);
    }

    const sortedColors = Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxColors)
      .map(([key]) => {
        const [r, g, b] = key.split(',').map(Number);
        return this.hexToColor(this.rgbToHex(r, g, b));
      });

    return sortedColors;
  }

  createGradient(colors: Color[], steps: number): GradientStop[] {
    if (colors.length < 2) return [];

    const stops: GradientStop[] = [];
    const segmentSteps = Math.floor(steps / (colors.length - 1));

    for (let i = 0; i < colors.length - 1; i++) {
      const start = colors[i];
      const end = colors[i + 1];

      for (let j = 0; j < segmentSteps; j++) {
        const t = j / segmentSteps;
        const r = Math.round(start.rgb.r + (end.rgb.r - start.rgb.r) * t);
        const g = Math.round(start.rgb.g + (end.rgb.g - start.rgb.g) * t);
        const b = Math.round(start.rgb.b + (end.rgb.b - start.rgb.b) * t);

        stops.push({
          color: this.hexToColor(this.rgbToHex(r, g, b)),
          position: (i * segmentSteps + j) / steps,
        });
      }
    }

    stops.push({
      color: colors[colors.length - 1],
      position: 1,
    });

    return stops;
  }

  exportPalette(colors: Color[], format: ExportFormat): string | Blob {
    switch (format) {
      case 'hex':
        return colors.map(c => c.hex.toUpperCase()).join('\n');

      case 'rgb':
        return colors.map(c => `rgb(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b})`).join('\n');

      case 'hsl':
        return colors.map(c => `hsl(${c.hsl.h}, ${c.hsl.s}%, ${c.hsl.l}%)`).join('\n');

      case 'cmyk':
        return colors.map(c => `cmyk(${c.cmyk.c}%, ${c.cmyk.m}%, ${c.cmyk.y}%, ${c.cmyk.k}%)`).join('\n');

      case 'css':
        return colors
          .map((c, i) => `--color-${i + 1}: ${c.hex};`)
          .join('\n');

      case 'json':
        return JSON.stringify(
          colors.map((c, i) => ({
            name: c.name || `Color ${i + 1}`,
            hex: c.hex,
            rgb: c.rgb,
            hsl: c.hsl,
            cmyk: c.cmyk,
          })),
          null,
          2
        );

      case 'ase':
        return this.exportASE(colors);

      case 'aco':
        return this.exportACO(colors);

      default:
        return colors.map(c => c.hex).join('\n');
    }
  }

  private exportASE(colors: Color[]): Blob {
    const signature = 'ASEF';
    const version = [0x00, 0x01, 0x00, 0x00];
    const blockCount = colors.length;

    const blocks: number[] = [];

    colors.forEach((color, index) => {
      const name = color.name || `Color ${index + 1}`;
      const nameBytes = Array.from(new TextEncoder().encode(name));
      const blockType = [0x00, 0x01];
      const blockLength = 22 + nameBytes.length * 2 + 2;

      blocks.push(...blockType);
      blocks.push(...this.numberToBytes(blockLength, 4));

      blocks.push(...this.numberToBytes(nameBytes.length + 1, 2));
      nameBytes.forEach(byte => {
        blocks.push(0x00, byte);
      });
      blocks.push(0x00, 0x00);

      blocks.push(0x52, 0x47, 0x42, 0x20);
      blocks.push(...this.floatToBytes(color.rgb.r / 255));
      blocks.push(...this.floatToBytes(color.rgb.g / 255));
      blocks.push(...this.floatToBytes(color.rgb.b / 255));

      blocks.push(0x00, 0x02);
    });

    const header = [
      ...Array.from(new TextEncoder().encode(signature)),
      ...version,
      ...this.numberToBytes(blockCount, 4),
    ];

    return new Blob([new Uint8Array([...header, ...blocks])], { type: 'application/octet-stream' });
  }

  private exportACO(colors: Color[]): Blob {
    const version = [0x00, 0x01];
    const colorCount = colors.length;

    const bytes: number[] = [
      ...version,
      ...this.numberToBytes(colorCount, 2),
    ];

    colors.forEach(color => {
      bytes.push(0x00, 0x00);
      bytes.push(...this.numberToBytes(color.rgb.r * 257, 2));
      bytes.push(...this.numberToBytes(color.rgb.g * 257, 2));
      bytes.push(...this.numberToBytes(color.rgb.b * 257, 2));
      bytes.push(0x00, 0x00);
    });

    return new Blob([new Uint8Array(bytes)], { type: 'application/octet-stream' });
  }

  private numberToBytes(num: number, bytes: number): number[] {
    const result: number[] = [];
    for (let i = bytes - 1; i >= 0; i--) {
      result.push((num >> (i * 8)) & 0xff);
    }
    return result;
  }

  private floatToBytes(float: number): number[] {
    const buffer = new ArrayBuffer(4);
    new DataView(buffer).setFloat32(0, float, false);
    return Array.from(new Uint8Array(buffer));
  }

  adjustBrightness(color: Color, amount: number): Color {
    const newL = Math.max(0, Math.min(100, color.hsl.l + amount));
    const rgb = this.hslToRgb(color.hsl.h, color.hsl.s, newL);
    return this.hexToColor(this.rgbToHex(rgb.r, rgb.g, rgb.b));
  }

  adjustSaturation(color: Color, amount: number): Color {
    const newS = Math.max(0, Math.min(100, color.hsl.s + amount));
    const rgb = this.hslToRgb(color.hsl.h, newS, color.hsl.l);
    return this.hexToColor(this.rgbToHex(rgb.r, rgb.g, rgb.b));
  }

  getContrastRatio(color1: Color, color2: Color): number {
    const l1 = this.getLuminance(color1);
    const l2 = this.getLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  private getLuminance(color: Color): number {
    const { r, g, b } = color.rgb;
    const [rs, gs, bs] = [r, g, b].map(c => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }
}

export const colorService = new ColorService();
