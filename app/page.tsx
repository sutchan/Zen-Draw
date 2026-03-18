// app/page.tsx v2.0.0
"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { Settings2, RefreshCw, History, Trash2, Dices, X, Languages, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { translations, Language } from "@/locales"
import { NumberRoller } from "@/components/number-roller"

export default function RandomDrawApp() {
  const [lang, setLang] = React.useState<Language>("zh")
  const t = translations[lang]

  // Settings state
  const [min, setMin] = React.useState<number>(1)
  const [max, setMax] = React.useState<number>(100)
  const [count, setCount] = React.useState<number>(1)
  const [allowDuplicates, setAllowDuplicates] = React.useState<boolean>(true)
  const [autoHide, setAutoHide] = React.useState<boolean>(true)
  
  // Display rules state
  const [digits, setDigits] = React.useState<number>(0) // 0 means no padding
  const [prefix, setPrefix] = React.useState<string>("")
  const [suffix, setSuffix] = React.useState<string>("")

  // App state
  const [isDrawing, setIsDrawing] = React.useState<boolean>(false)
  const [currentResults, setCurrentResults] = React.useState<string[]>([])
  const [history, setHistory] = React.useState<{ id: string; timestamp: Date; results: string[] }[]>([])
  const [showUI, setShowUI] = React.useState<boolean>(true)

  // Auto-hide logic for idle
  React.useEffect(() => {
    if (!showUI || !autoHide || isDrawing) return

    let timer: NodeJS.Timeout
    
    const startTimer = () => {
      timer = setTimeout(() => {
        setShowUI(false)
      }, 8000) // 8 seconds of inactivity
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

  const handleDraw = async () => {
    if (min > max) {
      alert(t.minMaxError)
      return
    }

    const range = max - min + 1
    if (!allowDuplicates && count > range) {
      alert(t.rangeError)
      return
    }

    setIsDrawing(true)
    
    // Auto hide UI when drawing starts
    if (autoHide) {
      setShowUI(false)
    }

    // Simulate drawing animation
    const duration = 1500 // 1.5 seconds
    const interval = 50 // Update every 50ms
    const steps = duration / interval

    let currentStep = 0
    
    const animationInterval = setInterval(() => {
      const tempResults = Array.from({ length: count }, () => {
        return formatNumber(Math.floor(Math.random() * range) + min)
      })
      setCurrentResults(tempResults)
      currentStep++

      if (currentStep >= steps) {
        clearInterval(animationInterval)
        
        // Final draw
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

        const formattedResults = finalResults.map(formatNumber)
        setCurrentResults(formattedResults)
        setHistory((prev) => [
          { id: Math.random().toString(36).substring(7), timestamp: new Date(), results: formattedResults },
          ...prev,
        ])
        setIsDrawing(false)
      }
    }, interval)
  }

  const clearHistory = () => {
    setHistory([])
  }

  return (
    <div id="app-root" className="h-screen w-screen overflow-hidden bg-background text-foreground relative flex">
      {/* Floating Controls */}
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
        <ThemeToggle className="rounded-xl" />
        <Button 
          variant={showUI ? "secondary" : "ghost"}
          size="icon" 
          onClick={() => setShowUI(s => !s)}
          title={t.toggleUI}
          className="rounded-xl"
        >
          {showUI ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Backdrop */}
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

      {/* Settings Panel (Sidebar) */}
      <div id="sidebar-panel" className={cn(
        "absolute inset-y-0 left-0 z-40 w-full sm:w-[400px] bg-background/95 backdrop-blur-xl border-r shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col",
        showUI ? "translate-x-0" : "-translate-x-full"
      )}>
        <div id="sidebar-header" className="p-6 flex items-center gap-3 border-b">
          <div className="bg-primary/10 p-2 rounded-xl">
            <Dices className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{t.title}</h1>
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
                
                <div className="space-y-2">
                  <Label htmlFor="count">{t.drawCount}</Label>
                  <Input id="count" type="number" min={1} value={count} onChange={(e) => setCount(Number(e.target.value))} />
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
              </div>

              <div className="w-full h-px bg-border" />

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
                        {record.timestamp.toLocaleTimeString()}
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

      {/* Main Display Area */}
      <div id="main-display" 
        className={cn(
          "flex-1 flex flex-col items-center justify-center relative transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          showUI ? "ml-0 lg:ml-[400px] opacity-20 lg:opacity-100 pointer-events-none lg:pointer-events-auto" : "ml-0"
        )}
        onClick={() => {
          if (showUI) setShowUI(false)
        }}
      >
        {/* Background decorative elements */}
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
