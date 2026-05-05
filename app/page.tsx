// app/page.tsx v2.6.0
"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { Settings2, RefreshCw, History, Trash2, Dices, X, Languages, Menu, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { translations, Language } from "@/locales"
import { NumberRoller } from "@/components/number-roller"
import { useLocalStorage } from "@/hooks/use-local-storage"

// Function to update html lang attribute
const updateHtmlLang = (lang: Language) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang
  }
}

export default function RandomDrawApp() {
  const [lang, setLang] = useLocalStorage<Language>("zendraw-lang", "zh")
  const t = translations[lang]
  const { theme, setTheme } = useTheme()

  // Update html lang attribute when language changes
  React.useEffect(() => {
    updateHtmlLang(lang)
  }, [lang])

  // Settings state with localStorage persistence
  const [min, setMin] = useLocalStorage<number>("zendraw-min", 1)
  const [max, setMax] = useLocalStorage<number>("zendraw-max", 100)
  const [count, setCount] = useLocalStorage<number>("zendraw-count", 1)
  const [allowDuplicates, setAllowDuplicates] = useLocalStorage<boolean>("zendraw-duplicates", true)
  const [autoHide, setAutoHide] = useLocalStorage<boolean>("zendraw-autohide", true)
  const [duration, setDuration] = useLocalStorage<number>("zendraw-duration", 5)
  const [themePreset, setThemePreset] = useLocalStorage<string>("zendraw-theme-preset", "default")
  const [fontFamily, setFontFamily] = useLocalStorage<string>("zendraw-font-family", "sans")
  const [customList, setCustomList] = useLocalStorage<string[]>("zendraw-custom-list", [])
  const [useCustomList, setUseCustomList] = useLocalStorage<boolean>("zendraw-use-custom", false)
  
  // Apply theme and font to body element globally
  React.useEffect(() => {
    const body = document.body;
    
    // Handle theme preset
    body.classList.forEach(cls => {
      if (cls.startsWith('theme-')) {
        body.classList.remove(cls);
      }
    });
    if (themePreset !== 'default') {
      body.classList.add(`theme-${themePreset}`);
    }

    // Handle font family
    body.classList.remove('font-sans', 'font-mono', 'font-serif');
    body.classList.add(`font-${fontFamily}`);
  }, [themePreset, fontFamily]);

  // Display rules state (also persisted)
  const [digits, setDigits] = useLocalStorage<number>("zendraw-digits", 3)
  const [prefix, setPrefix] = useLocalStorage<string>("zendraw-prefix", "")
  const [suffix, setSuffix] = useLocalStorage<string>("zendraw-suffix", "")

  // App state (not persisted)
  const [isDrawing, setIsDrawing] = React.useState<boolean>(false)
  const [currentResults, setCurrentResults] = React.useState<string[]>([])
  const [showUI, setShowUI] = React.useState<boolean>(true)
  const [hasOpenedOnce, setHasOpenedOnce] = React.useState<boolean>(false)

  // Dialog states
  const [alertOpen, setAlertOpen] = React.useState<boolean>(false)
  const [alertMessage, setAlertMessage] = React.useState<string>("")
  const [importDialogOpen, setImportDialogOpen] = React.useState<boolean>(false)
  const [importText, setImportText] = React.useState<string>("")

  // History with string timestamps for localStorage serialization
  const [history, setHistory] = useLocalStorage<{ id: string; timestamp: string; results: string[] }[]>("zendraw-history", [])

  // Mark as opened when UI is shown
  React.useEffect(() => {
    if (showUI) setHasOpenedOnce(true)
  }, [showUI])

  // Auto-hide logic for idle
  React.useEffect(() => {
    if (!showUI || !autoHide || isDrawing) return

    let timer: NodeJS.Timeout
    
    const startTimer = () => {
      timer = setTimeout(() => {
        setShowUI(false)
      }, 8000)
    }

    const resetTimer = () => {
      clearTimeout(timer)
      startTimer()
    }

    startTimer()
    window.addEventListener("mousemove", resetTimer)
    window.addEventListener("keydown", resetTimer)
    window.addEventListener("touchstart", resetTimer)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("mousemove", resetTimer)
      window.removeEventListener("keydown", resetTimer)
      window.removeEventListener("touchstart", resetTimer)
    }
  }, [showUI, autoHide, isDrawing])

  // Format a number based on rules
  const formatNumber = React.useCallback(
    (num: number) => {
      let str = num.toString()
      if (digits > 0) {
        str = str.padStart(digits, "0")
      }
      return `${prefix}${str}${suffix}`
    },
    [digits, prefix, suffix]
  )

  const animationIntervalRef = React.useRef<NodeJS.Timeout | null>(null)

  const performFinalDraw = React.useCallback(() => {
    let formattedResults: string[] = []
    
    if (useCustomList && customList.length > 0) {
      const available = [...customList]
      for (let i = 0; i < count; i++) {
        if (available.length === 0) break;
        const randomIndex = Math.floor(Math.random() * available.length)
        formattedResults.push(available[randomIndex])
        if (!allowDuplicates) {
          available.splice(randomIndex, 1)
        }
      }
    } else {
      const range = max - min + 1
      const finalResults: number[] = []
      if (allowDuplicates) {
        for (let i = 0; i < count; i++) {
          finalResults.push(Math.floor(Math.random() * range) + min)
        }
      } else {
        const available = Array.from({ length: range }, (_, i) => i + min)
        for (let i = 0; i < count; i++) {
          const randomIndex = Math.floor(Math.random() * available.length)
          finalResults.push(available[randomIndex])
          available.splice(randomIndex, 1)
        }
      }
      formattedResults = finalResults.map(formatNumber)
    }

    setCurrentResults(formattedResults)
    setHistory((prev) => [
      { id: Math.random().toString(36).substring(7), timestamp: new Date().toISOString(), results: formattedResults },
      ...prev,
    ])
    setIsDrawing(false)
  }, [min, max, count, allowDuplicates, formatNumber, useCustomList, customList, setHistory])

  const handleDraw = async () => {
    if (isDrawing) {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current)
        animationIntervalRef.current = null
        performFinalDraw()
      }
      return
    }

    if (useCustomList) {
      if (customList.length === 0) {
        setAlertMessage(t.listImportDesc)
        setAlertOpen(true)
        return
      }
      if (!allowDuplicates && count > customList.length) {
        setAlertMessage(t.rangeError)
        setAlertOpen(true)
        return
      }
    } else {
      if (min > max) {
        setAlertMessage(t.minMaxError)
        setAlertOpen(true)
        return
      }

      const range = max - min + 1
      if (!allowDuplicates && count > range) {
        setAlertMessage(t.rangeError)
        setAlertOpen(true)
        return
      }
    }

    setIsDrawing(true)
    setShowUI(false)

    const durationMs = duration * 1000
    const interval = 50
    const steps = durationMs / interval

    let currentStep = 0
    
    animationIntervalRef.current = setInterval(() => {
      let tempResults: string[] = []
      if (useCustomList && customList.length > 0) {
        tempResults = Array.from({ length: count }, () => {
          return customList[Math.floor(Math.random() * customList.length)]
        })
      } else {
        const range = max - min + 1
        tempResults = Array.from({ length: count }, () => {
          return formatNumber(Math.floor(Math.random() * range) + min)
        })
      }
      
      setCurrentResults(tempResults)
      currentStep++

      if (currentStep >= steps) {
        if (animationIntervalRef.current) clearInterval(animationIntervalRef.current)
        animationIntervalRef.current = null
        performFinalDraw()
      }
    }, interval)
  }

  const handleImportSubmit = () => {
    const items = importText.split('\n').filter(i => i.trim() !== '');
    if (items.length > 0) {
      setCustomList(items);
      setUseCustomList(true);
    }
    setImportDialogOpen(false);
    setImportText("");
  }

  const clearHistory = () => {
    setHistory([])
  }

  return (
    <div id="app-root" className="h-screen w-screen overflow-hidden bg-background text-foreground relative flex">
      <div id="app-header" className="absolute top-4 left-4 z-50 flex items-center gap-2">
        <div className="bg-primary p-2 rounded-xl">
          <Dices className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight leading-none">{t.title}</h1>
          <span className="text-[10px] text-muted-foreground font-mono">v2.6.0</span>
        </div>
      </div>

      <div id="floating-controls" className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-background/50 backdrop-blur-md p-1.5 rounded-2xl border shadow-sm">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setLang(l => l === 'en' ? 'zh' : 'en')}
          title={t.switchLang}
          className="rounded-xl"
        >
          <Languages className="h-5 w-5" />
        </Button>
        <Button 
          variant={showUI ? "secondary" : "ghost"}
          size="icon" 
          onClick={() => setShowUI(s => !s)}
          title={t.toggleUI}
          className={cn(
            "rounded-xl transition-all",
            !showUI && !hasOpenedOnce && "animate-pulse ring-2 ring-primary/50"
          )}
        >
          {showUI ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <AnimatePresence>
        {!showUI && (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0 }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-50 lg:flex hidden items-center"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowUI(true)}
              className="h-12 w-6 rounded-l-xl bg-background/50 backdrop-blur-md border-y border-l shadow-sm hover:w-8 transition-all group"
              title={t.clickToExpand}
            >
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors rotate-180" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showUI && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowUI(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div id="sidebar-panel" className={cn(
        "absolute inset-y-0 right-0 z-40 w-full sm:w-[400px] bg-background/95 backdrop-blur-xl border-l shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col",
        showUI ? "translate-x-0" : "translate-x-full"
      )}>
        <div id="sidebar-header" className="p-6 flex items-center gap-3 border-b">
          <div className="bg-primary/10 p-2 rounded-xl">
            <Settings2 className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">{t.settings}</h2>
        </div>

        <div id="sidebar-content" className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="settings">
                <Settings2 className="h-4 w-4 mr-2" />
                {t.settings}
              </TabsTrigger>
              <TabsTrigger value="history">
                <History className="h-4 w-4 mr-2" />
                {t.history}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="settings" className="space-y-6 focus-visible:outline-none">
              <div id="settings-range" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{t.rangeCount}</h3>
                  <p className="text-sm text-muted-foreground">{t.rangeDesc}</p>
                </div>
                {!useCustomList && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min">{t.minVal}</Label>
                      <Input id="min" type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max">{t.maxVal}</Label>
                      <Input id="max" type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="count">{t.drawCount}</Label>
                  <Input id="count" type="number" min={1} value={count} onChange={(e) => setCount(Number(e.target.value))} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">{t.drawDuration}</Label>
                  <Input id="duration" type="number" min={1} max={30} value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
                  <p className="text-[10px] text-muted-foreground leading-none">{t.drawDurationDesc}</p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Label htmlFor="duplicates" className="cursor-pointer">{t.allowDup}</Label>
                  <Switch id="duplicates" checked={allowDuplicates} onCheckedChange={setAllowDuplicates} />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-hide" className="cursor-pointer">{t.autoHide}</Label>
                    <p className="text-[10px] text-muted-foreground leading-none">{t.autoHideDesc}</p>
                  </div>
                  <Switch id="auto-hide" checked={autoHide} onCheckedChange={setAutoHide} />
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="theme-mode">{t.themeMode}</Label>
                  <Select value={theme} onValueChange={(value) => setTheme(value ?? "system")}>
                    <SelectTrigger id="theme-mode">
                      <SelectValue placeholder={t.themeSystem} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">{t.themeLight}</SelectItem>
                      <SelectItem value="dark">{t.themeDark}</SelectItem>
                      <SelectItem value="system">{t.themeSystem}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="theme-preset">{t.themePreset}</Label>
                  <Select value={themePreset} onValueChange={(value) => setThemePreset(value ?? "default")}>
                    <SelectTrigger id="theme-preset">
                      <SelectValue placeholder={t.themeDefault} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">{t.themeDefault}</SelectItem>
                      <SelectItem value="ocean">{t.themeOcean}</SelectItem>
                      <SelectItem value="forest">{t.themeForest}</SelectItem>
                      <SelectItem value="sunset">{t.themeSunset}</SelectItem>
                      <SelectItem value="purple">{t.themePurple}</SelectItem>
                      <SelectItem value="neon">{t.themeNeon}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="font-family">{t.fontFamily}</Label>
                  <Select value={fontFamily} onValueChange={(value) => setFontFamily(value ?? "sans")}>
                    <SelectTrigger id="font-family">
                      <SelectValue placeholder={t.fontSans} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sans">{t.fontSans}</SelectItem>
                      <SelectItem value="mono">{t.fontMono}</SelectItem>
                      <SelectItem value="serif">{t.fontSerif}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="use-custom-list" className="cursor-pointer">{t.useCustomList || "Use Custom List"}</Label>
                    <p className="text-[10px] text-muted-foreground leading-none">
                      {customList.length > 0 ? `${customList.length} items loaded` : "No items loaded"}
                    </p>
                  </div>
                  <Switch id="use-custom-list" checked={useCustomList} onCheckedChange={setUseCustomList} />
                </div>

                <div className="pt-4 grid grid-cols-2 gap-4">
                  <Button variant="outline" onClick={() => {
                    setImportText(customList.join('\n'))
                    setImportDialogOpen(true)
                  }}>
                    {t.listImport}
                  </Button>
                  <Button variant="outline" onClick={() => {
                    const data = history.map(h => h.results.join(', ')).join('\n');
                    const blob = new Blob([data], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'draw-results.txt';
                    a.click();
                  }}>
                    {t.export}
                  </Button>
                </div>
              </div>

              <div className="w-full h-px bg-border" />

              {!useCustomList && (
                <div id="settings-display" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{t.displayRules}</h3>
                    <p className="text-sm text-muted-foreground">{t.displayDesc}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="digits">{t.minDigits}</Label>
                    <Input id="digits" type="number" min={0} value={digits} onChange={(e) => setDigits(Number(e.target.value))} />
                    <p className="text-xs text-muted-foreground">{t.minDigitsDesc}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prefix">{t.prefix}</Label>
                      <Input id="prefix" value={prefix} onChange={(e) => setPrefix(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="suffix">{t.suffix}</Label>
                      <Input id="suffix" value={suffix} onChange={(e) => setSuffix(e.target.value)} />
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="history" className="focus-visible:outline-none">
              <div id="history-header" className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{t.drawHistory}</h3>
                  <p className="text-sm text-muted-foreground">{t.historyDesc}</p>
                </div>
                {history.length > 0 && (
                  <Button variant="ghost" size="icon" onClick={clearHistory} title={t.clearHistory}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
              
              <div id="history-list" className="space-y-4">
                {history.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground text-sm border border-dashed rounded-xl">
                    {t.noHistory}
                  </div>
                ) : (
                  history.map((record) => (
                    <div key={record.id} className="p-4 rounded-xl bg-secondary/50 border">
                      <div className="text-xs text-muted-foreground mb-2">
                        {new Date(record.timestamp).toLocaleTimeString()}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {record.results.map((res, idx) => (
                          <span key={idx} className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-background shadow-sm text-sm font-medium border">
                            {res}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Custom List Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.listImport}</DialogTitle>
            <DialogDescription>{t.listImportDesc}</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Textarea
              placeholder={t.listImportDesc}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="min-h-[200px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
              {lang === 'zh' ? '取消' : 'Cancel'}
            </Button>
            <Button onClick={handleImportSubmit}>
              {lang === 'zh' ? '导入' : 'Import'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog */}
      <Dialog open={alertOpen} onOpenChange={setAlertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{lang === 'zh' ? '提示' : 'Notice'}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">{alertMessage}</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setAlertOpen(false)}>
              {lang === 'zh' ? '确定' : 'OK'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div id="main-display" 
        className={cn(
          "flex-1 flex flex-col items-center justify-center relative transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          showUI ? "mr-0 lg:mr-[400px] opacity-20 lg:opacity-100 pointer-events-none lg:pointer-events-auto" : "mr-0"
        )}
        onClick={() => {
          if (showUI) setShowUI(false)
        }}
      >
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:40px_40px] [mask-image:radial-gradient(white,transparent_80%)] pointer-events-none opacity-20 dark:opacity-10" />
        
        <div id="results-container" className="z-10 flex-1 flex flex-col items-center justify-center w-full p-4 sm:p-12">
          {currentResults.length === 0 ? (
            <div className="text-center space-y-6">
              <Dices className="h-32 w-32 mx-auto text-muted-foreground/20" />
              <p className="text-2xl text-muted-foreground font-medium tracking-wide">{t.ready}</p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center content-center gap-4 sm:gap-8 w-full h-full">
              <AnimatePresence mode="popLayout">
                {currentResults.map((result, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.5, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -40 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 25,
                      mass: 1
                    }}
                    className="flex items-center justify-center"
                  >
                    <div className="bg-background/80 text-foreground shadow-2xl rounded-[2rem] px-8 py-6 md:px-16 md:py-12 text-center border border-border/50 backdrop-blur-xl min-w-[200px]">
                      <NumberRoller 
                        value={result} 
                        isDrawing={isDrawing} 
                        className="text-6xl sm:text-8xl md:text-[10vw] font-black tracking-tighter tabular-nums leading-none"
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div id="action-container" className="z-20 pb-12 w-full max-w-xl px-4">
          <Button 
            id="draw-button"
            size="lg" 
            className="w-full h-20 text-2xl sm:text-3xl font-black rounded-2xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)] shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            onClick={handleDraw}
            disabled={isDrawing}
          >
            {isDrawing ? (
              <>
                <RefreshCw className="mr-4 h-8 w-8 animate-spin" />
                {t.drawing}
              </>
            ) : (
              <>
                <Dices className="mr-4 h-8 w-8" />
                {t.startDraw}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

