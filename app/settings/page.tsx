"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Settings, Save, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const [fontSize, setFontSize] = useState("14")
  const [tabSize, setTabSize] = useState("2")
  const [theme, setTheme] = useState("dark")
  const [wordWrap, setWordWrap] = useState(true)
  const [minimap, setMinimap] = useState(false)
  const [lineNumbers, setLineNumbers] = useState(true)
  const [autoSave, setAutoSave] = useState(true)
  const [formatOnSave, setFormatOnSave] = useState(true)
  const [livePreview, setLivePreview] = useState(true)
  const [defaultLanguage, setDefaultLanguage] = useState("javascript")

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="h-14 border-b flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <h1 className="font-semibold">Settings</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 container max-w-4xl py-8">
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="p-4 border rounded-md mt-4">
            <h2 className="text-xl font-semibold mb-6">Editor Settings</h2>

            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fontSize">Font Size</Label>
                  <Select value={fontSize} onValueChange={setFontSize}>
                    <SelectTrigger id="fontSize">
                      <SelectValue placeholder="Select font size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12px</SelectItem>
                      <SelectItem value="14">14px</SelectItem>
                      <SelectItem value="16">16px</SelectItem>
                      <SelectItem value="18">18px</SelectItem>
                      <SelectItem value="20">20px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tabSize">Tab Size</Label>
                  <Select value={tabSize} onValueChange={setTabSize}>
                    <SelectTrigger id="tabSize">
                      <SelectValue placeholder="Select tab size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 spaces</SelectItem>
                      <SelectItem value="4">4 spaces</SelectItem>
                      <SelectItem value="8">8 spaces</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="wordWrap" className="cursor-pointer">
                    Word Wrap
                  </Label>
                  <Switch id="wordWrap" checked={wordWrap} onCheckedChange={setWordWrap} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="minimap" className="cursor-pointer">
                    Show Minimap
                  </Label>
                  <Switch id="minimap" checked={minimap} onCheckedChange={setMinimap} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="lineNumbers" className="cursor-pointer">
                    Show Line Numbers
                  </Label>
                  <Switch id="lineNumbers" checked={lineNumbers} onCheckedChange={setLineNumbers} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="formatOnSave" className="cursor-pointer">
                    Format On Save
                  </Label>
                  <Switch id="formatOnSave" checked={formatOnSave} onCheckedChange={setFormatOnSave} />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="p-4 border rounded-md mt-4">
            <h2 className="text-xl font-semibold mb-6">Appearance Settings</h2>

            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Editor Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fontFamily">Font Family</Label>
                <Select defaultValue="monospace">
                  <SelectTrigger id="fontFamily">
                    <SelectValue placeholder="Select font family" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monospace">Monospace</SelectItem>
                    <SelectItem value="fira-code">Fira Code</SelectItem>
                    <SelectItem value="jetbrains-mono">JetBrains Mono</SelectItem>
                    <SelectItem value="source-code-pro">Source Code Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customCSS">Custom CSS</Label>
                <div className="relative">
                  <Input id="customCSS" placeholder="Enter custom CSS" className="h-20" />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="p-4 border rounded-md mt-4">
            <h2 className="text-xl font-semibold mb-6">Preferences</h2>

            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="defaultLanguage">Default Language</Label>
                <Select value={defaultLanguage} onValueChange={setDefaultLanguage}>
                  <SelectTrigger id="defaultLanguage">
                    <SelectValue placeholder="Select default language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoSave" className="cursor-pointer">
                    Auto Save
                  </Label>
                  <Switch id="autoSave" checked={autoSave} onCheckedChange={setAutoSave} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="livePreview" className="cursor-pointer">
                    Live Preview
                  </Label>
                  <Switch id="livePreview" checked={livePreview} onCheckedChange={setLivePreview} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keybindings">Keybindings</Label>
                <Select defaultValue="vscode">
                  <SelectTrigger id="keybindings">
                    <SelectValue placeholder="Select keybindings" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vscode">VS Code</SelectItem>
                    <SelectItem value="vim">Vim</SelectItem>
                    <SelectItem value="emacs">Emacs</SelectItem>
                    <SelectItem value="sublime">Sublime Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

