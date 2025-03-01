"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Terminal, Play, Save, FileCode, ChevronLeft, FolderOpen, Copy, Scissors, Clipboard } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

const languageTemplates = {
  python: `# Python Example
print("Hello, Deev IDE!")

def factorial(n):
    if n == 0 or n == 1:
        return 1
    else:
        return n * factorial(n - 1)

number = int(input("Enter a number to calculate its factorial: "))
result = factorial(number)
print(f"The factorial of {number} is {result}")
`,
  cpp: `#include <iostream>

int factorial(int n) {
    if (n == 0 || n == 1) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}

int main() {
    std::cout << "Hello, Deev IDE!" << std::endl;
    
    int number;
    std::cout << "Enter a number to calculate its factorial: ";
    std::cin >> number;
    
    int result = factorial(number);
    std::cout << "The factorial of " << number << " is " << result << std::endl;
    
    return 0;
}
`,
  java: `import java.util.Scanner;

public class Main {
    public static int factorial(int n) {
        if (n == 0 || n == 1) {
            return 1;
        } else {
            return n * factorial(n - 1);
        }
    }
    
    public static void main(String[] args) {
        System.out.println("Hello, Deev IDE!");
        
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter a number to calculate its factorial: ");
        int number = scanner.nextInt();
        
        int result = factorial(number);
        System.out.println("The factorial of " + number + " is " + result);
        
        scanner.close();
    }
}
`,
  go: `package main

import (
	"fmt"
)

func factorial(n int) int {
	if n == 0 || n == 1 {
		return 1
	}
	return n * factorial(n-1)
}

func main() {
	fmt.Println("Hello, Deev IDE!")

	var number int
	fmt.Print("Enter a number to calculate its factorial: ")
	fmt.Scan(&number)

	result := factorial(number)
	fmt.Printf("The factorial of %d is %d\n", number, result)
}
`,
  c: `#include <stdio.h>

int factorial(int n) {
    if (n == 0 || n == 1) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}

int main() {
    printf("Hello, Deev IDE!\n");
    
    int number;
    printf("Enter a number to calculate its factorial: ");
    scanf("%d", &number);
    
    int result = factorial(number);
    printf("The factorial of %d is %d\n", number, result);
    
    return 0;
}
`,
}

export default function CompilerIDE() {
  const [language, setLanguage] = useState("python")
  const [code, setCode] = useState(languageTemplates.python)
  const [output, setOutput] = useState("")
  const [input, setInput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [editorWidth, setEditorWidth] = useState(70) // percentage
  const [editorTheme, setEditorTheme] = useState("vs-dark")
  const [editorFontSize, setEditorFontSize] = useState("14")
  const resizeRef = useRef(null)
  const containerRef = useRef(null)
  const isDraggingRef = useRef(false)

  useEffect(() => {
    setCode(languageTemplates[language])
  }, [language])

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

      if (newWidth >= 30 && newWidth <= 90) {
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
    setOutput("Running code...\n")

    setTimeout(() => {
      let simulatedOutput = ""

      switch (language) {
        case "python":
          simulatedOutput = `Hello, Deev IDE!
Enter a number to calculate its factorial: ${input}
The factorial of ${input} is ${factorial(Number.parseInt(input))}`
          break
        case "cpp":
        case "java":
        case "go":
        case "c":
          simulatedOutput = `Hello, Deev IDE!
Enter a number to calculate its factorial: ${input}
The factorial of ${input} is ${factorial(Number.parseInt(input))}`
          break
        default:
          simulatedOutput = "Language not supported for execution."
      }

      setOutput(simulatedOutput)
      setIsRunning(false)
    }, 1500)
  }

  const factorial = (n) => {
    if (n === 0 || n === 1) return 1
    return n * factorial(n - 1)
  }

  const getLanguageLabel = () => {
    switch (language) {
      case "python":
        return "Python"
      case "cpp":
        return "C++"
      case "java":
        return "Java"
      case "go":
        return "Go"
      case "c":
        return "C"
      default:
        return "Select Language"
    }
  }

  const handleSave = () => {
    const fileName = `main.${language === "cpp" ? "cpp" : language}`
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
  }

  const handleCut = () => {
    handleCopy()
    setCode("")
  }

  const handlePaste = async () => {
    const pastedText = await navigator.clipboard.readText()
    setCode((prev) => prev + pastedText)
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
            <Terminal className="h-5 w-5 text-primary" />
            <h1 className="font-semibold">Compiler IDE</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[120px]">
              <SelectValue>{getLanguageLabel()}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="go">Go</SelectItem>
              <SelectItem value="c">C</SelectItem>
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
            <div className="flex items-center gap-2">
              <FileCode className="h-4 w-4" />
              <h3 className="text-sm font-medium">
                {language === "python"
                  ? "main.py"
                  : language === "cpp"
                    ? "main.cpp"
                    : language === "java"
                      ? "Main.java"
                      : language === "go"
                        ? "main.go"
                        : "main.c"}
              </h3>
            </div>
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
              <Button variant="ghost" size="sm">
                <FolderOpen className="h-4 w-4 mr-2" />
                Open File
              </Button>
            </div>
          </div>

          <div className="h-[calc(100%-40px)]">
            <MonacoEditor
              height="100%"
              language={language === "cpp" ? "cpp" : language}
              value={code}
              onChange={setCode}
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
            <h3 className="text-sm font-medium">Terminal Output</h3>
            <Button variant="ghost" size="sm" onClick={() => setOutput("")}>
              Clear Output
            </Button>
          </div>
          <div className="flex-1 flex flex-col">
            <div className="flex-1 bg-black text-green-400 font-mono text-sm p-4 overflow-auto">
              <pre>{output || "Run your code to see output here..."}</pre>
            </div>
            <div className="border-t p-2 bg-muted/40">
              <input
                type="text"
                className="w-full p-2 bg-muted/20 rounded"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter input for your program here..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

