'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, FileText, Database, Zap } from 'lucide-react'

export default function DownloadPage() {
  const [downloading, setDownloading] = useState<string | null>(null)

  const downloads = [
    {
      id: 'lite',
      name: 'Version Légère',
      description: 'Version optimisée pour un téléchargement rapide',
      size: '368 KB',
      icon: Zap,
      features: [
        'Code source complet',
        'Configuration MongoDB',
        'Scripts essentiels',
        'Documentation',
        'Exclusion node_modules'
      ],
      filename: 'my-project-mongodb-lite.tar.gz',
      color: 'bg-green-500'
    },
    {
      id: 'full',
      name: 'Version Complète',
      description: 'Version complète avec tous les fichiers de projet',
      size: '85 MB',
      icon: Database,
      features: [
        'Code source complet',
        'Configuration MongoDB',
        'Tous les scripts et outils',
        'Documentation complète',
        'Fichiers de configuration Docker',
        'Historique complet (excluant node_modules)'
      ],
      filename: 'my-project-mongodb.tar.gz',
      color: 'bg-blue-500'
    },
    {
      id: 'original',
      name: 'Version Originale (SQLite)',
      description: 'Version originale avec base de données SQLite',
      size: '353 MB',
      icon: FileText,
      features: [
        'Version originale du projet',
        'Base de données SQLite',
        'Configuration locale',
        'Pour comparaison ou migration manuelle'
      ],
      filename: 'my-project.tar.gz',
      color: 'bg-gray-500'
    }
  ]

  const handleDownload = async (filename: string, id: string) => {
    setDownloading(id)
    try {
      const response = await fetch(`/api/download-direct?filename=${filename}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        console.error('Download failed')
      }
    } catch (error) {
      console.error('Download error:', error)
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Télécharger le Projet MongoDB</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Choisissez la version qui correspond à vos besoins
          </p>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <Database className="w-4 h-4 mr-2" />
            MongoDB Atlas Intégré
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {downloads.map((download) => {
            const Icon = download.icon
            return (
              <Card key={download.id} className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${download.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="outline">{download.size}</Badge>
                  </div>
                  <CardTitle className="text-xl">{download.name}</CardTitle>
                  <CardDescription>{download.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="space-y-3 mb-6 flex-1">
                    <h4 className="font-semibold text-sm">Caractéristiques :</h4>
                    <ul className="space-y-2">
                      {download.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    onClick={() => handleDownload(download.filename, download.id)}
                    disabled={downloading === download.id}
                    className="w-full"
                  >
                    {downloading === download.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Téléchargement...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-12 bg-muted rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Instructions d'Installation</h3>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">1. Extraction et Installation</h4>
              <div className="bg-background rounded p-3 font-mono text-xs">
                tar -xzf my-project-mongodb-lite.tar.gz<br/>
                cd my-project<br/>
                npm install
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">2. Configuration MongoDB</h4>
              <p className="text-muted-foreground">
                Mettez à jour le fichier .env.local avec vos informations MongoDB Atlas
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">3. Initialisation</h4>
              <div className="bg-background rounded p-3 font-mono text-xs">
                npm run db:generate<br/>
                npm run db:push<br/>
                npm run db:seed
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">4. Démarrage</h4>
              <div className="bg-background rounded p-3 font-mono text-xs">
                npm run dev
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            Besoin d'aide ? Consultez le fichier <code className="bg-muted px-1 rounded">MONGODB_README.md</code> inclus dans le package
          </p>
        </div>
      </div>
    </div>
  )
}