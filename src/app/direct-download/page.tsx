'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, FileArchive, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function DirectDownloadPage() {
  useEffect(() => {
    // Automatically start download after page load
    const timer = setTimeout(() => {
      window.location.href = '/api/download-direct'
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="container mx-auto max-w-2xl pt-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
            ← Retour à l'accueil
          </Link>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <Download className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Téléchargement automatique</CardTitle>
            <CardDescription>
              Votre projet commence à se télécharger automatiquement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="animate-bounce">
                  <FileArchive className="h-12 w-12 text-green-600" />
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-lg font-medium">Téléchargement en cours...</p>
                <p className="text-sm text-muted-foreground">
                  Si le téléchargement ne démarre pas automatiquement, cliquez sur le lien ci-dessous
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <a 
                  href="/api/download-direct" 
                  className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                  download
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Télécharger manuellement
                </a>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Informations sur le fichier :</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Nom : my-project-complete.tar.gz</li>
                <li>• Taille : ~370 MB</li>
                <li>• Format : Archive compressée (.tar.gz)</li>
                <li>• Contenu : Application Next.js complète</li>
              </ul>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              <p>Pour extraire l'archive après téléchargement :</p>
              <p className="font-mono mt-1">tar -xzf my-project-complete.tar.gz</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}