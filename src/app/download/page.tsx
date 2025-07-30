'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, FileArchive, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function DownloadPage() {
  const [isDownloading, setIsDownloading] = useState(false)
  const [fileSize, setFileSize] = useState<string>('')

  useEffect(() => {
    // Get file size
    fetch('/api/download/file-info')
      .then(res => res.json())
      .then(data => {
        if (data.size) {
          const sizeInMB = (data.size / (1024 * 1024)).toFixed(1)
          setFileSize(`${sizeInMB} MB`)
        }
      })
      .catch(() => setFileSize('53 MB'))
  }, [])

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const response = await fetch('/api/download')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'my-project.tar.gz'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="container mx-auto max-w-2xl pt-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Link>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <FileArchive className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Télécharger le projet</CardTitle>
            <CardDescription>
              Téléchargez l'archive complète de votre application Next.js
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Nom du fichier: <span className="font-mono font-medium">my-project.tar.gz</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Taille: <span className="font-medium">{fileSize || 'Calcul...'}</span>
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Contenu de l'archive:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Code source complet de l'application Next.js</li>
                <li>• Composants UI et pages</li>
                <li>• Fichiers de configuration</li>
                <li>• Schéma de base de données</li>
                <li>• Dépendances et package.json</li>
                <li>• Configuration Docker</li>
              </ul>
            </div>

            <Button 
              onClick={handleDownload} 
              disabled={isDownloading}
              className="w-full"
              size="lg"
            >
              {isDownloading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Téléchargement en cours...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger l'archive
                </>
              )}
            </Button>

            <div className="text-xs text-muted-foreground text-center">
              <p>Pour extraire l'archive après téléchargement:</p>
              <p className="font-mono mt-1">tar -xzf my-project.tar.gz</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}