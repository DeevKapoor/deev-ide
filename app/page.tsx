import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Code, Terminal, FileCode, Settings, Github, Database } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <header className="container mx-auto py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Code className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Deev IDE</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="https://github.com/DeevKapoor" target="_blank">
                <Github className="h-5 w-5 mr-2" />
                GitHub
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Advanced Web-Based Development Environment</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A powerful IDE with live preview for web technologies, compiler support for system programming languages,
            and a SQL query editor.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="border-2 hover:border-primary transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="h-6 w-6 text-primary" />
                Web Development
              </CardTitle>
              <CardDescription>HTML, CSS, and JavaScript with live preview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-40 bg-card rounded-md border flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="flex justify-center mb-2">
                    <div className="px-2 py-1 bg-primary/10 text-primary rounded text-xs mr-1">HTML</div>
                    <div className="px-2 py-1 bg-primary/10 text-primary rounded text-xs mr-1">CSS</div>
                    <div className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">JS</div>
                  </div>
                  <p className="text-sm text-muted-foreground">Edit and preview web code in real-time</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/web">Launch Web IDE</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-2 hover:border-primary transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-6 w-6 text-primary" />
                Compiler IDE
              </CardTitle>
              <CardDescription>C, C++, Java, Python, and Go with terminal output</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-40 bg-card rounded-md border flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="flex justify-center mb-2">
                    <div className="px-2 py-1 bg-primary/10 text-primary rounded text-xs mr-1">C/C++</div>
                    <div className="px-2 py-1 bg-primary/10 text-primary rounded text-xs mr-1">Java</div>
                    <div className="px-2 py-1 bg-primary/10 text-primary rounded text-xs mr-1">Python</div>
                    <div className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">Go</div>
                  </div>
                  <p className="text-sm text-muted-foreground">Compile and run code with integrated terminal output</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/compiler">Launch Compiler IDE</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-2 hover:border-primary transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-6 w-6 text-primary" />
                Query Editor
              </CardTitle>
              <CardDescription>MySQL and PostgreSQL query editor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-40 bg-card rounded-md border flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="flex justify-center mb-2">
                    <div className="px-2 py-1 bg-primary/10 text-primary rounded text-xs mr-1">MySQL</div>
                    <div className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">PostgreSQL</div>
                  </div>
                  <p className="text-sm text-muted-foreground">Write and execute SQL queries with simulated results</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/query-editor">Launch Query Editor</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      <footer className="container mx-auto py-6 border-t mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Deev IDE. All rights reserved.</p>
          <p className="text-sm text-muted-foreground mt-2 md:mt-0">
            Coded and designed by{" "}
            <Link href="https://github.com/DeevKapoor" target="_blank" className="text-primary hover:underline">
              Deevanshu Kapoor
            </Link>
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Button variant="ghost" size="sm">
              About
            </Button>
            <Button variant="ghost" size="sm">
              Documentation
            </Button>
            <Button variant="ghost" size="sm">
              Privacy
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

