"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, FileCode, RefreshCw, ChevronLeft, Copy, Scissors, Clipboard } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

export default function WebIDE() {
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Deev IDE</title>
</head>
<body>
  <h1>Hello, Deev IDE!</h1>
  <p>This is a live preview of your HTML, CSS, and JavaScript code.</p>
  <button id="changeColor">Change Color</button>
</body>
</html>`)

  const [cssCode, setCssCode] = useState(`body {
  font-family: 'Arial', sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  line-height: 1.6;
}

h1 {
  color: #3b82f6;
  text-align: center;
}

button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  display: block;
  margin: 20px auto;
}

button:hover {
  background-color: #2563eb;
}`)

  const [jsCode, setJsCode] = useState(`document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('changeColor');
  
  button.addEventListener('click', () => {
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.querySelector('h1').style.color = randomColor;
  });
});`)

  const [previewCode, setPreviewCode] = useState("")
  const [activeTab, setActiveTab] = useState("html")
  const [editorWidth, setEditorWidth] = useState(50) // percentage
  const [editorTheme, setEditorTheme] = useState("vs-dark")
  const [editorFontSize, setEditorFontSize] = useState("14")
  const resizeRef = useRef(null)
  const containerRef = useRef(null)
  const isDraggingRef = useRef(false)

  useEffect(() => {
    const combinedCode = `
      <html>
        <head>
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode.replace(/<!DOCTYPE html>|<html>|<\/html>|<head>.*<\/head>|<body>|<\/body>/gs, "")}
          <script>${jsCode}</script>
        </body>
      </html>
    `
    setPreviewCode(combinedCode)
  }, [htmlCode, cssCode, jsCode])

  useEffect(() => {
    const handleMouseDown = () => {
      isDraggingRef.current = true
      document.body.style.cursor = "col-resize"
    }

    const handleMouseUp = () => {
      isDraggingRef.current = false
      document.body.style.cursor = ""
    }

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100

      if (newWidth >= 20 && newWidth <= 80) {
        setEditorWidth(newWidth)
      }
    }

    const resizeHandle = resizeRef.current
    if (resizeHandle) {
      resizeHandle.addEventListener("mousedown", handleMouseDown)
    }

    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mousemove", handleMouseMove)

    return () => {
      if (resizeHandle) {
        resizeHandle.removeEventListener("mousedown", handleMouseDown)
      }
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const handleSave = () => {
    const fileContent = activeTab === "html" ? htmlCode : activeTab === "css" ? cssCode : jsCode
    const fileName = `${activeTab}.${activeTab === "js" ? "js" : activeTab}`
    const blob = new Blob([fileContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleCopy = () => {
    const content = activeTab === "html" ? htmlCode : activeTab === "css" ? cssCode : jsCode
    navigator.clipboard.writeText(content)
  }

  const handleCut = () => {
    handleCopy()
    if (activeTab === "html") setHtmlCode("")
    else if (activeTab === "css") setCssCode("")
    else setJsCode("")
  }

  const handlePaste = async () => {
    const pastedText = await navigator.clipboard.readText()
    if (activeTab === "html") setHtmlCode((prev) => prev + pastedText)
    else if (activeTab === "css") setCssCode((prev) => prev + pastedText)
    else setJsCode((prev) => prev + pastedText)
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="h-14 border-b flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <FileCode className="h-5 w-5 text-primary" />
            <h1 className="font-semibold">Web IDE</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select value={editorTheme} onValueChange={setEditorTheme}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vs-dark">Dark</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="hc-black">High Contrast</SelectItem>
            </SelectContent>
          </Select>
          <Select value={editorFontSize} onValueChange={setEditorFontSize}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="Font Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12px</SelectItem>
              <SelectItem value="14">14px</SelectItem>
              <SelectItem value="16">16px</SelectItem>
              <SelectItem value="18">18px</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden" ref={containerRef}>
        <div className="flex flex-col" style={{ width: `${editorWidth}%` }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b p-1 bg-muted/40 flex justify-between items-center">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="css">CSS</TabsTrigger>
                <TabsTrigger value="js">JavaScript</TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleCut}>
                  <Scissors className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handlePaste}>
                  <Clipboard className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="html" className="h-full m-0 p-0">
                <MonacoEditor
                  height="100%"
                  language="html"
                  value={htmlCode}
                  onChange={setHtmlCode}
                  theme={editorTheme}
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: Number.parseInt(editorFontSize),
                    wordWrap: "on",
                  }}
                />
              </TabsContent>

              <TabsContent value="css" className="h-full m-0 p-0">
                <MonacoEditor
                  height="100%"
                  language="css"
                  value={cssCode}
                  onChange={setCssCode}
                  theme={editorTheme}
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: Number.parseInt(editorFontSize),
                    wordWrap: "on",
                  }}
                />
              </TabsContent>

              <TabsContent value="js" className="h-full m-0 p-0">
                <MonacoEditor
                  height="100%"
                  language="javascript"
                  value={jsCode}
                  onChange={setJsCode}
                  theme={editorTheme}
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: Number.parseInt(editorFontSize),
                    wordWrap: "on",
                  }}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="resize-handle" ref={resizeRef}></div>

        <div className="flex-1 flex flex-col">
          <div className="border-b p-2 bg-muted/40 flex items-center justify-between">
            <h3 className="text-sm font-medium">Live Preview</h3>
            <Button variant="ghost" size="sm" onClick={() => setPreviewCode(previewCode)}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
          <div className="flex-1 bg-white">
            <iframe
              srcDoc={previewCode}
              title="preview"
              className="w-full h-full border-none"
              sandbox="allow-scripts"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

