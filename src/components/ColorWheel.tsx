import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Slider } from '@/components/ui/slider'
import {
  Palette,
  Image as ImageIcon,
  DownloadSimple,
  Copy,
  Plus,
  Trash,
  FloppyDisk,
  Sparkle,
  ArrowsClockwise,
} from '@phosphor-icons/react'
import { colorService, Color, HarmonyType, ExportFormat, ColorPalette } from '@/lib/color-service'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'
import { cn } from '@/lib/utils'

export function ColorWheel() {
  const [baseColor, setBaseColor] = useState('#E8965A')
  const [harmony, setHarmony] = useState<HarmonyType>('complementary')
  const [palette, setPalette] = useState<Color[]>([])
  const [savedPalettes, setSavedPalettes, deleteSavedPalettes] = useKV<ColorPalette[]>('color-palettes', [])
  const [gradientSteps, setGradientSteps] = useState(10)
  const [gradientColors, setGradientColors] = useState<Color[]>([])
  const [exportFormat, setExportFormat] = useState<ExportFormat>('hex')
  const [imageColors, setImageColors] = useState<Color[]>([])
  const [maxColors, setMaxColors] = useState(16)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    generatePalette()
  }, [baseColor, harmony])

  const generatePalette = () => {
    const colors = colorService.generatePalette(baseColor, harmony)
    setPalette(colors)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const extractedColors = colorService.extractFromImage(imageData, maxColors)
        setImageColors(extractedColors)
        toast.success(`Extracted ${extractedColors.length} colors from image`)
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const generateGradient = () => {
    if (gradientColors.length < 2) {
      toast.error('Add at least 2 colors to create a gradient')
      return
    }
    const gradient = colorService.createGradient(gradientColors, gradientSteps)
    toast.success(`Generated gradient with ${gradient.length} steps`)
  }

  const addGradientColor = (color: Color) => {
    setGradientColors(prev => [...prev, color])
    toast.success('Color added to gradient')
  }

  const removeGradientColor = (index: number) => {
    setGradientColors(prev => prev.filter((_, i) => i !== index))
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  const exportPalette = () => {
    const exported = colorService.exportPalette(palette, exportFormat)

    if (exported instanceof Blob) {
      const url = URL.createObjectURL(exported)
      const a = document.createElement('a')
      a.href = url
      a.download = `palette.${exportFormat}`
      a.click()
      URL.revokeObjectURL(url)
      toast.success(`Palette exported as ${exportFormat.toUpperCase()}`)
    } else {
      navigator.clipboard.writeText(exported)
      toast.success(`${exportFormat.toUpperCase()} palette copied to clipboard`)
    }
  }

  const savePalette = () => {
    const newPalette: ColorPalette = {
      id: Date.now().toString(),
      name: `${harmony} Palette`,
      colors: palette,
      harmony,
      createdAt: Date.now(),
    }
    setSavedPalettes((current) => [...(current || []), newPalette])
    toast.success('Palette saved to library')
  }

  const loadPalette = (savedPalette: ColorPalette) => {
    setPalette(savedPalette.colors)
    if (savedPalette.harmony) {
      setHarmony(savedPalette.harmony)
    }
    if (savedPalette.colors.length > 0) {
      setBaseColor(savedPalette.colors[0].hex)
    }
    toast.success('Palette loaded')
  }

  const deletePalette = (id: string) => {
    setSavedPalettes((current) => (current || []).filter(p => p.id !== id))
    toast.success('Palette deleted')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Color Wheel Tool</h1>
        <p className="text-muted-foreground mt-2">
          Generate palettes, extract colors from images, and export in multiple formats
        </p>
      </div>

      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList>
          <TabsTrigger value="generator" className="gap-2">
            <Palette size={18} />
            Palette Generator
          </TabsTrigger>
          <TabsTrigger value="extractor" className="gap-2">
            <ImageIcon size={18} />
            Image Extractor
          </TabsTrigger>
          <TabsTrigger value="gradient" className="gap-2">
            <Sparkle size={18} />
            Gradient Builder
          </TabsTrigger>
          <TabsTrigger value="library" className="gap-2">
            <FloppyDisk size={18} />
            Saved Palettes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Configure your color palette</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="base-color">Base Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="base-color"
                      value={baseColor}
                      onChange={(e) => setBaseColor(e.target.value)}
                      className="flex-1"
                    />
                    <input
                      type="color"
                      value={baseColor}
                      onChange={(e) => setBaseColor(e.target.value)}
                      className="w-12 h-10 rounded-md border cursor-pointer"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="harmony">Color Harmony</Label>
                  <Select value={harmony} onValueChange={(v) => setHarmony(v as HarmonyType)}>
                    <SelectTrigger id="harmony">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="complementary">Complementary</SelectItem>
                      <SelectItem value="analogous">Analogous</SelectItem>
                      <SelectItem value="triadic">Triadic</SelectItem>
                      <SelectItem value="split-complementary">Split Complementary</SelectItem>
                      <SelectItem value="tetradic">Tetradic</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="monochromatic">Monochromatic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="export-format">Export Format</Label>
                  <Select value={exportFormat} onValueChange={(v) => setExportFormat(v as ExportFormat)}>
                    <SelectTrigger id="export-format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hex">HEX</SelectItem>
                      <SelectItem value="rgb">RGB</SelectItem>
                      <SelectItem value="hsl">HSL</SelectItem>
                      <SelectItem value="cmyk">CMYK</SelectItem>
                      <SelectItem value="css">CSS Variables</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="ase">ASE (Adobe)</SelectItem>
                      <SelectItem value="aco">ACO (Photoshop)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button onClick={generatePalette} className="flex-1 gap-2">
                    <ArrowsClockwise size={18} />
                    Regenerate
                  </Button>
                  <Button onClick={savePalette} variant="secondary" className="gap-2">
                    <FloppyDisk size={18} />
                    Save
                  </Button>
                </div>

                <Button onClick={exportPalette} variant="outline" className="w-full gap-2">
                  <DownloadSimple size={18} />
                  Export Palette
                </Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Generated Palette</CardTitle>
                <CardDescription>{palette.length} colors in {harmony} harmony</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex gap-2 h-32 rounded-lg overflow-hidden">
                    {palette.map((color, index) => (
                      <div
                        key={index}
                        className="flex-1 transition-all hover:flex-[1.5] cursor-pointer"
                        style={{ backgroundColor: color.hex }}
                        onClick={() => copyToClipboard(color.hex, 'Color')}
                      />
                    ))}
                  </div>

                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {palette.map((color, index) => (
                        <ColorCard key={index} color={color} index={index} onAddToGradient={addGradientColor} />
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="extractor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Extract Colors from Image</CardTitle>
              <CardDescription>Upload an image to extract its dominant colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="max-colors">Maximum Colors</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="max-colors"
                    value={[maxColors]}
                    onValueChange={([v]) => setMaxColors(v)}
                    min={4}
                    max={32}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-8">{maxColors}</span>
                </div>
              </div>

              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button onClick={() => fileInputRef.current?.click()} className="gap-2">
                  <ImageIcon size={18} />
                  Upload Image
                </Button>
              </div>

              {imageColors.length > 0 && (
                <div className="space-y-4">
                  <div className="flex gap-2 h-32 rounded-lg overflow-hidden">
                    {imageColors.map((color, index) => (
                      <div
                        key={index}
                        className="flex-1 transition-all hover:flex-[1.5] cursor-pointer"
                        style={{ backgroundColor: color.hex }}
                        onClick={() => copyToClipboard(color.hex, 'Color')}
                      />
                    ))}
                  </div>

                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {imageColors.map((color, index) => (
                        <ColorCard key={index} color={color} index={index} onAddToGradient={addGradientColor} />
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              <canvas ref={canvasRef} className="hidden" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gradient" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gradient Builder</CardTitle>
              <CardDescription>Create smooth color gradients with custom steps</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gradient-steps">Gradient Steps</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="gradient-steps"
                    value={[gradientSteps]}
                    onValueChange={([v]) => setGradientSteps(v)}
                    min={5}
                    max={50}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-8">{gradientSteps}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Gradient Colors</Label>
                <div className="flex flex-wrap gap-2">
                  {gradientColors.map((color, index) => (
                    <div key={index} className="relative group">
                      <div
                        className="w-16 h-16 rounded-lg border-2 border-border"
                        style={{ backgroundColor: color.hex }}
                      />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute -top-2 -right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeGradientColor(index)}
                      >
                        <Trash size={14} />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-16 h-16 rounded-lg"
                    onClick={() => {
                      if (palette.length > 0) {
                        addGradientColor(palette[0])
                      } else {
                        addGradientColor(colorService.hexToColor(baseColor))
                      }
                    }}
                  >
                    <Plus size={24} />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Click <Plus className="inline" size={12} /> to add current base color, or use "Add to Gradient" button on color cards
                </p>
              </div>

              <Button onClick={generateGradient} className="gap-2">
                <Sparkle size={18} />
                Generate Gradient
              </Button>

              {gradientColors.length >= 2 && (
                <div
                  className="h-32 rounded-lg"
                  style={{
                    background: `linear-gradient(to right, ${gradientColors.map(c => c.hex).join(', ')})`,
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Saved Palettes</CardTitle>
              <CardDescription>Manage your saved color palettes</CardDescription>
            </CardHeader>
            <CardContent>
              {!savedPalettes || savedPalettes.length === 0 ? (
                <div className="text-center py-12">
                  <Palette size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No saved palettes</h3>
                  <p className="text-sm text-muted-foreground">
                    Create a palette and click "Save" to add it to your library
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {savedPalettes.map((savedPalette) => (
                      <Card key={savedPalette.id} className="overflow-hidden">
                        <div className="flex gap-2 h-16">
                          {savedPalette.colors.map((color, index) => (
                            <div
                              key={index}
                              className="flex-1"
                              style={{ backgroundColor: color.hex }}
                            />
                          ))}
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold">{savedPalette.name}</h4>
                              <p className="text-xs text-muted-foreground">
                                {savedPalette.colors.length} colors • {new Date(savedPalette.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => loadPalette(savedPalette)}
                              >
                                Load
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deletePalette(savedPalette.id)}
                              >
                                <Trash size={16} />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ColorCardProps {
  color: Color
  index: number
  onAddToGradient: (color: Color) => void
}

function ColorCard({ color, index, onAddToGradient }: ColorCardProps) {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied`)
  }

  const getContrastColor = (bgColor: Color) => {
    const luminance = colorService.getContrastRatio(bgColor, colorService.hexToColor('#000000'))
    return luminance > 4.5 ? '#000000' : '#FFFFFF'
  }

  const contrastColor = getContrastColor(color)

  return (
    <Card className="overflow-hidden">
      <div className="flex">
        <div
          className="w-24 flex items-center justify-center text-lg font-bold"
          style={{ backgroundColor: color.hex, color: contrastColor }}
        >
          {index + 1}
        </div>
        <div className="flex-1 p-4 space-y-2">
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80"
              onClick={() => copyToClipboard(color.hex, 'HEX')}
            >
              <Copy size={12} className="mr-1" />
              {color.hex}
            </Badge>
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80"
              onClick={() => copyToClipboard(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`, 'RGB')}
            >
              <Copy size={12} className="mr-1" />
              RGB({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-accent"
              onClick={() => copyToClipboard(`hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`, 'HSL')}
            >
              HSL({color.hsl.h}, {color.hsl.s}%, {color.hsl.l}%)
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-accent"
              onClick={() => copyToClipboard(`cmyk(${color.cmyk.c}%, ${color.cmyk.m}%, ${color.cmyk.y}%, ${color.cmyk.k}%)`, 'CMYK')}
            >
              CMYK({color.cmyk.c}, {color.cmyk.m}, {color.cmyk.y}, {color.cmyk.k})
            </Badge>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            onClick={() => onAddToGradient(color)}
          >
            <Plus size={14} />
            Add to Gradient
          </Button>
        </div>
      </div>
    </Card>
  )
}
