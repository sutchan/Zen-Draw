// app/page.tsx v2.7.0
"use client"

import * as React from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { Settings2, RefreshCw, History, Trash2, Dices, X, Languages, Menu, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { translations, Language } from "@/locales"
import { NumberRoller } from "@/components/number-roller"
import { useLocalStorage } from "@/hooks/use-local-storage"

const updateHtmlLang = (lang: Language) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang
  }
}

export default function RandomDrawApp() {
  const [lang, setLang] = useLocalStorage<Language>("zendraw-lang", "zh")
  const t = translations[lang]
  const { theme, setTheme } = useTheme()
  const shouldReduceMotion = useReducedMotion()
  const mounted = React.useSyncExternalStore(() => () => {}, () => true, () => false)

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
  
  // Apply theme and font to body element globally - memoized
  React.useEffect(() => {
    const body = document.body;
    
    // Handle theme preset
    const themeClasses = Array.from(body.classList).filter(cls => cls.startsWith('theme-'))
    themeClasses.forEach(cls => body.classList.remove(cls))
    if (themePreset !== 'default') {
      body.classList.add(`theme-${themePreset}`)
    }

    // Handle font family
    body.classList.remove('font-sans', 'font-mono', 'font-serif')
    body.classList.add(`font-${fontFamily}`)
  }, [themePreset, fontFamily])

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

  // Auto-hide logic for idle - optimized
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
    window.addEventListener("mousemove", resetTimer, { passive: true })
    window.addEventListener("keydown", resetTimer, { passive: true })
    window.addEventListener("touchstart", resetTimer, { passive: true })

    return () => {
      clearTimeout(timer)
      window.removeEventListener("mousemove", resetTimer)
      window.removeEventListener("keydown", resetTimer)
      window.removeEventListener("touchstart", resetTimer)
    }
  }, [showUI, autoHide, isDrawing])

  // Format a number based on rules - memoized
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

  // Memoize animation settings
  const animationDuration = React.useMemo(() => ({
    durationMs: duration * 1000,
    interval: 50,
    steps: (duration * 1000) / 50
  }), [duration])

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

  const handleDraw = React.useCallback(async () => {
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

      if (currentStep >= animationDuration.steps) {
        if (animationIntervalRef.current) clearInterval(animationIntervalRef.current)
        animationIntervalRef.current = null
        performFinalDraw()
      }
    }, animationDuration.interval)
  }, [isDrawing, useCustomList, customList, allowDuplicates, count, min, max, t, formatNumber, performFinalDraw, animationDuration])

  const handleImportSubmit = React.useCallback(() => {
    const items = importText.split('\n').filter(i => i.trim() !== '')
    if (items.length > 0) {
      setCustomList(items)
      setUseCustomList(true)
    }
    setImportDialogOpen(false)
    setImportText("")
  }, [importText, setCustomList, setUseCustomList])

  const clearHistory = React.useCallback(() => {
    setHistory([])
  }, [setHistory])

  // Memoize static values
  const versionTag = React.useMemo(() => (
    <span className="text-[10px] text-muted-foreground font-mono">v2.7.0</span>
  ), [])

  return (
    <div id="app-root" className="h-screen w-screen overflow-hidden bg-background text-foreground relative flex select-none">
      {/* App Header */}
      <motion.div 
        id="app-header" 
        className="absolute top-4 left-4 z-50 flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <motion.div 
          className="bg-primary p-2 rounded-xl shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Dices className="h-6 w-6 text-primary-foreground" />
        </motion.div>
        <div>
          <h1 className="text-lg font-bold tracking-tight leading-none">{t.title}</h1>
          {versionTag}
        </div>
      </motion.div>

      {/* Floating Controls */}
      <motion.div 
        id="floating-controls" 
        className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-background/80 backdrop-blur-md p-1.5 rounded-2xl border shadow-lg"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setLang(l => l === 'en' ? 'zh' : 'en')}
          title={t.switchLang}
          className="rounded-xl hover:bg-primary/10 transition-colors"
        >
          <Languages className="h-5 w-5" />
        </Button>
        <Button 
          variant={showUI ? "secondary" : "ghost"}
          size="icon" 
          onClick={() => { const next = !showUI; setShowUI(next); if (next) setHasOpenedOnce(true); }}
          title={t.toggleUI}
          className={cn(
            "rounded-xl transition-all duration-300",
            !showUI && !hasOpenedOnce && "animate-pulse ring-2 ring-primary/50"
          )}
        >
          <motion.div
            initial={false}
            animate={{ rotate: showUI ? 0 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {showUI ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </motion.div>
        </Button>
      </motion.div>

      {/* Expand Hint Icon */}
      <AnimatePresence>
        {!showUI && (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-50 lg:flex hidden items-center"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => { setShowUI(true); setHasOpenedOnce(true); }}
              className="h-12 w-6 rounded-l-xl bg-background/80 backdrop-blur-md border-y border-l shadow-lg hover:bg-primary/10 transition-all group"
              title={t.clickToExpand}
            >
              <motion.div
                whileHover={{ x: -2 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors rotate-180" />
              </motion.div>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {showUI && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            onClick={() => setShowUI(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Settings Panel (Sidebar) */}
      <motion.div 
        id="sidebar-panel" 
        className={cn(
          "absolute inset-y-0 right-0 z-40 w-full sm:w-[420px] bg-background/98 backdrop-blur-xl border-l shadow-2xl flex flex-col",
          showUI ? "translate-x-0" : "translate-x-full"
        )}
        initial={false}
        animate={{ x: showUI ? 0 : '100%' }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          mass: 0.8
        }}
      >
        <motion.div 
          id="sidebar-header" 
          className="p-6 flex items-center gap-3 border-b bg-gradient-to-r from-primary/5 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div 
            className="bg-primary/10 p-2 rounded-xl"
            whileHover={{ scale: 1.05 }}
          >
            <Settings2 className="h-6 w-6 text-primary" />
          </motion.div>
          <h2 className="text-2xl font-bold tracking-tight">{t.settings}</h2>
        </motion.div>

        <div id="sidebar-content" className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50 rounded-lg p-1">
              <TabsTrigger value="settings" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Settings2 className="h-4 w-4 mr-2" />
                {t.settings}
              </TabsTrigger>
              <TabsTrigger value="history" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <History className="h-4 w-4 mr-2" />
                {t.history}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="settings" className="space-y-6 focus-visible:outline-none mt-6">
              {/* Range & Count Section */}
              <motion.div 
                id="settings-range" 
                className="space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{t.rangeCount}</h3>
                  <p className="text-sm text-muted-foreground">{t.rangeDesc}</p>
                </div>
                
                {!useCustomList && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min" className="text-sm font-medium">{t.minVal}</Label>
                      <Input 
                        id="min" 
                        type="number" 
                        value={min} 
                        onChange={(e) => setMin(Number(e.target.value))} 
                        className="focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max" className="text-sm font-medium">{t.maxVal}</Label>
                      <Input 
                        id="max" 
                        type="number" 
                        value={max} 
                        onChange={(e) => setMax(Number(e.target.value))} 
                        className="focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="count" className="text-sm font-medium">{t.drawCount}</Label>
                  <Input 
                    id="count" 
                    type="number" 
                    min={1} 
                    value={count} 
                    onChange={(e) => setCount(Number(e.target.value))} 
                    className="focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-sm font-medium">{t.drawDuration}</Label>
                  <Input 
                    id="duration" 
                    type="number" 
                    min={1} 
                    max={30} 
                    value={duration} 
                    onChange={(e) => setDuration(Number(e.target.value))} 
                    className="focus:ring-2 focus:ring-primary/20"
                  />
                  <p className="text-xs text-muted-foreground leading-relaxed">{t.drawDurationDesc}</p>
                </div>

                <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <Label htmlFor="duplicates" className="cursor-pointer text-sm font-medium">{t.allowDup}</Label>
                  <Switch id="duplicates" checked={allowDuplicates} onCheckedChange={setAllowDuplicates} />
                </div>

                <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-hide" className="cursor-pointer text-sm font-medium">{t.autoHide}</Label>
                    <p className="text-xs text-muted-foreground leading-relaxed">{t.autoHideDesc}</p>
                  </div>
                  <Switch id="auto-hide" checked={autoHide} onCheckedChange={setAutoHide} />
                </div>
              </motion.div>

              {/* Appearance Section */}
              <motion.div 
                className="space-y-4 pt-4 border-t"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="space-y-3">
                  <Label htmlFor="theme-mode" className="text-sm font-medium">{t.themeMode}</Label>
                  {mounted ? (
                    <Select value={theme} onValueChange={(value) => setTheme(value ?? "system")}>
                      <SelectTrigger id="theme-mode" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">{t.themeLight}</SelectItem>
                        <SelectItem value="dark">{t.themeDark}</SelectItem>
                        <SelectItem value="system">{t.themeSystem}</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Select value="system" onValueChange={() => {}}>
                      <SelectTrigger id="theme-mode" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">{t.themeLight}</SelectItem>
                        <SelectItem value="dark">{t.themeDark}</SelectItem>
                        <SelectItem value="system">{t.themeSystem}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="theme-preset" className="text-sm font-medium">{t.themePreset}</Label>
                  {mounted ? (
                    <Select value={themePreset} onValueChange={(value) => setThemePreset(value ?? "default")}>
                      <SelectTrigger id="theme-preset" className="w-full">
                        <SelectValue />
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
                  ) : (
                    <Select value="default" onValueChange={() => {}}>
                      <SelectTrigger id="theme-preset" className="w-full">
                        <SelectValue />
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
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="font-family" className="text-sm font-medium">{t.fontFamily}</Label>
                  {mounted ? (
                    <Select value={fontFamily} onValueChange={(value) => setFontFamily(value ?? "sans")}>
                      <SelectTrigger id="font-family" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sans">{t.fontSans}</SelectItem>
                        <SelectItem value="mono">{t.fontMono}</SelectItem>
                        <SelectItem value="serif">{t.fontSerif}</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Select value="sans" onValueChange={() => {}}>
                      <SelectTrigger id="font-family" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sans">{t.fontSans}</SelectItem>
                        <SelectItem value="mono">{t.fontMono}</SelectItem>
                        <SelectItem value="serif">{t.fontSerif}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </motion.div>

              {/* Custom List Section */}
              <motion.div 
                className="space-y-4 pt-4 border-t"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="space-y-0.5">
                    <Label htmlFor="use-custom-list" className="cursor-pointer text-sm font-medium">{t.useCustomList}</Label>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {customList.length > 0 ? `${customList.length} items loaded` : "No items loaded"}
                    </p>
                  </div>
                  <Switch id="use-custom-list" checked={useCustomList} onCheckedChange={setUseCustomList} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setImportText(customList.join('\n'))
                      setImportDialogOpen(true)
                    }}
                    className="hover:bg-primary/5 hover:border-primary/30 transition-all"
                  >
                    {t.listImport}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const data = history.map(h => h.results.join(', ')).join('\n')
                      const blob = new Blob([data], { type: 'text/plain' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = 'draw-results.txt'
                      a.click()
                    }}
                    className="hover:bg-primary/5 hover:border-primary/30 transition-all"
                  >
                    {t.export}
                  </Button>
                </div>
              </motion.div>

              {/* Display Rules Section */}
              {!useCustomList && (
                <motion.div 
                  id="settings-display" 
                  className="space-y-4 pt-4 border-t"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{t.displayRules}</h3>
                    <p className="text-sm text-muted-foreground">{t.displayDesc}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="digits" className="text-sm font-medium">{t.minDigits}</Label>
                    <Input 
                      id="digits" 
                      type="number" 
                      min={0} 
                      value={digits} 
                      onChange={(e) => setDigits(Number(e.target.value))} 
                      className="focus:ring-2 focus:ring-primary/20"
                    />
                    <p className="text-xs text-muted-foreground leading-relaxed">{t.minDigitsDesc}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prefix" className="text-sm font-medium">{t.prefix}</Label>
                      <Input 
                        id="prefix" 
                        value={prefix} 
                        onChange={(e) => setPrefix(e.target.value)} 
                        className="focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="suffix" className="text-sm font-medium">{t.suffix}</Label>
                      <Input 
                        id="suffix" 
                        value={suffix} 
                        onChange={(e) => setSuffix(e.target.value)} 
                        className="focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </TabsContent>
            
            <TabsContent value="history" className="focus-visible:outline-none mt-6">
              <div id="history-header" className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{t.drawHistory}</h3>
                  <p className="text-sm text-muted-foreground">{t.historyDesc}</p>
                </div>
                {history.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={clearHistory} 
                    title={t.clearHistory}
                    className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div id="history-list" className="space-y-3">
                {history.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center text-muted-foreground text-sm border-2 border-dashed rounded-xl bg-muted/20"
                  >
                    {t.noHistory}
                  </motion.div>
                ) : (
                  <motion.div 
                    className="space-y-3"
                    initial="hidden"
                    animate="show"
                    variants={{
                      show: { transition: { staggerChildren: 0.05 } }
                    }}
                  >
                    {history.map((record, index) => (
                      <motion.div 
                        key={record.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/20"
                      >
                        <div className="text-xs text-muted-foreground mb-3 font-medium">
                          {new Date(record.timestamp).toLocaleString()}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {record.results.map((res, idx) => (
                            <motion.span 
                              key={idx}
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: idx * 0.05 }}
                              className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-background shadow-sm text-sm font-semibold border border-border/50"
                            >
                              {res}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>

      {/* Custom List Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl">{t.listImport}</DialogTitle>
            <DialogDescription>{t.listImportDesc}</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Textarea
              placeholder={t.listImportDesc}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="min-h-[200px] resize-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setImportDialogOpen(false)}
              className="flex-1"
            >
              {lang === 'zh' ? '取消' : 'Cancel'}
            </Button>
            <Button 
              onClick={handleImportSubmit}
              className="flex-1"
            >
              {lang === 'zh' ? '导入' : 'Import'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog */}
      <Dialog open={alertOpen} onOpenChange={setAlertOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {lang === 'zh' ? '提示' : 'Notice'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm leading-relaxed">{alertMessage}</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setAlertOpen(false)} className="w-full">
              {lang === 'zh' ? '确定' : 'OK'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Display Area */}
      <motion.div 
        id="main-display" 
        className={cn(
          "flex-1 flex flex-col items-center justify-center relative",
          showUI ? "lg:mr-[420px]" : "mr-0"
        )}
        onClick={() => {
          if (showUI) setShowUI(false)
        }}
        transition={{ duration: 0.5 }}
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:40px_40px] [mask-image:radial-gradient(white,transparent_80%)] pointer-events-none opacity-10 dark:opacity-5" />
        
        {/* Results Container */}
        <motion.div 
          id="results-container" 
          className="z-10 flex-1 flex flex-col items-center justify-center w-full p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {currentResults.length === 0 ? (
            <motion.div 
              className="text-center space-y-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                animate={shouldReduceMotion ? {} : { 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Dices className="h-40 w-40 mx-auto text-muted-foreground/30" />
              </motion.div>
              <p className="text-3xl text-muted-foreground font-medium tracking-wide">{t.ready}</p>
            </motion.div>
          ) : (
            <div className="flex flex-wrap justify-center content-center gap-6 sm:gap-10 w-full h-full">
              <AnimatePresence mode="popLayout">
                {currentResults.map((result, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.5, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -50 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 25,
                      mass: 0.8
                    }}
                    className="flex items-center justify-center"
                  >
                    <div className="bg-background/90 text-foreground shadow-2xl rounded-[2rem] px-10 py-8 sm:px-16 sm:py-12 text-center border border-border/30 backdrop-blur-xl min-w-[220px] sm:min-w-[280px]">
                      <NumberRoller 
                        value={result} 
                        isDrawing={isDrawing} 
                        className="text-7xl sm:text-9xl md:text-[12vw] font-black tracking-tighter tabular-nums leading-none"
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Action Button */}
        <motion.div 
          id="action-container" 
          className="z-20 pb-12 w-full max-w-2xl px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            whileHover={isDrawing ? {} : { scale: 1.02 }}
            whileTap={isDrawing ? {} : { scale: 0.98 }}
          >
            <Button 
              id="draw-button"
              size="lg" 
              className="w-full h-20 sm:h-24 text-2xl sm:text-4xl font-black rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-primary/20"
              onClick={handleDraw}
              disabled={isDrawing}
            >
              {isDrawing ? (
                <motion.div
                  className="flex items-center gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="h-8 w-8 sm:h-10 sm:w-10" />
                  </motion.div>
                  <span>{t.drawing}</span>
                </motion.div>
              ) : (
                <motion.div
                  className="flex items-center gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Dices className="h-8 w-8 sm:h-10 sm:w-10" />
                  <span>{t.startDraw}</span>
                </motion.div>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
