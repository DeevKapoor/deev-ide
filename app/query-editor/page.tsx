"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Save, Database, ChevronLeft, Copy, Scissors, Clipboard } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

const databaseTemplates = {
  mysql: `-- MySQL Example Query
SELECT 
    customers.customer_id,
    customers.first_name,
    customers.last_name,
    COUNT(orders.order_id) AS total_orders,
    SUM(order_items.quantity * products.price) AS total_spent
FROM 
    customers
LEFT JOIN 
    orders ON customers.customer_id = orders.customer_id
LEFT JOIN 
    order_items ON orders.order_id = order_items.order_id
LEFT JOIN 
    products ON order_items.product_id = products.product_id
GROUP BY 
    customers.customer_id
ORDER BY 
    total_spent DESC
LIMIT 10;
`,
  postgresql: `-- PostgreSQL Example Query
SELECT 
    customers.customer_id,
    customers.first_name,
    customers.last_name,
    COUNT(orders.order_id) AS total_orders,
    SUM(order_items.quantity * products.price) AS total_spent
FROM 
    customers
LEFT JOIN 
    orders ON customers.customer_id = orders.customer_id
LEFT JOIN 
    order_items ON orders.order_id = order_items.order_id
LEFT JOIN 
    products ON order_items.product_id = products.product_id
GROUP BY 
    customers.customer_id
ORDER BY 
    total_spent DESC
LIMIT 10;
`,
}

export default function QueryEditor() {
  const [database, setDatabase] = useState("mysql")
  const [query, setQuery] = useState(databaseTemplates.mysql)
  const [result, setResult] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [editorWidth, setEditorWidth] = useState(50) // percentage
  const [editorTheme, setEditorTheme] = useState("vs-dark")
  const [editorFontSize, setEditorFontSize] = useState("14")
  const resizeRef = useRef(null)
  const containerRef = useRef(null)
  const isDraggingRef = useRef(false)

  useEffect(() => {
    setQuery(databaseTemplates[database])
  }, [database])

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

      if (newWidth >= 30 && newWidth <= 70) {
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

  const handleRun = () => {
    setIsRunning(true)
    setResult("Executing query...\n")

    setTimeout(() => {
      const simulatedResult = `Query executed successfully.

Results:
+-------------+------------+-----------+--------------+-------------+
| customer_id | first_name | last_name | total_orders | total_spent |
+-------------+------------+-----------+--------------+-------------+
|     1001    |    John    |    Doe    |      5       |   1250.50   |
|     1002    |    Jane    |   Smith   |      3       |   980.75    |
|     1003    |   Michael  |  Johnson  |      7       |   1750.25   |
|     1004    |    Emily   |   Brown   |      2       |   450.00    |
|     1005    |   David    |   Wilson  |      4       |   875.50    |
+-------------+------------+-----------+--------------+-------------+

5 rows returned in 0.15 seconds`

      setResult(simulatedResult)
      setIsRunning(false)
    }, 1500)
  }

  const handleSave = () => {
    const fileName = `query.sql`
    const blob = new Blob([query], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(query)
  }

  const handleCut = () => {
    handleCopy()
    setQuery("")
  }

  const handlePaste = async () => {
    const pastedText = await navigator.clipboard.readText()
    setQuery((prev) => prev + pastedText)
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
            <Database className="h-5 w-5 text-primary" />
            <h1 className="font-semibold">Query Editor</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Select value={database} onValueChange={setDatabase}>
            <SelectTrigger className="w-[120px]">
              <SelectValue>{database === "mysql" ? "MySQL" : "PostgreSQL"}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mysql">MySQL</SelectItem>
              <SelectItem value="postgresql">PostgreSQL</SelectItem>
            </SelectContent>
          </Select>

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
          <Button size="sm" onClick={handleRun} disabled={isRunning}>
            <Play className="h-4 w-4 mr-2" />
            Run
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden" ref={containerRef}>
        <div style={{ width: `${editorWidth}%` }}>
          <div className="border-b p-2 bg-muted/40 flex items-center justify-between">
            <h3 className="text-sm font-medium">SQL Query</h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button variant="ghost" size="sm" onClick={handleCut}>
                <Scissors className="h-4 w-4 mr-2" />
                Cut
              </Button>
              <Button variant="ghost" size="sm" onClick={handlePaste}>
                <Clipboard className="h-4 w-4 mr-2" />
                Paste
              </Button>
            </div>
          </div>

          <div className="h-[calc(100%-40px)]">
            <MonacoEditor
              height="100%"
              language="sql"
              value={query}
              onChange={setQuery}
              theme={editorTheme}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: Number.parseInt(editorFontSize),
                wordWrap: "on",
              }}
            />
          </div>
        </div>

        <div className="resize-handle" ref={resizeRef}></div>

        <div className="flex-1 flex flex-col">
          <div className="border-b p-2 bg-muted/40 flex justify-between items-center">
            <h3 className="text-sm font-medium">Query Result</h3>
            <Button variant="ghost" size="sm" onClick={() => setResult("")}>
              Clear Result
            </Button>
          </div>
          <div className="flex-1 bg-black text-green-400 font-mono text-sm p-4 overflow-auto">
            <pre>{result || "Run your query to see results here..."}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}

