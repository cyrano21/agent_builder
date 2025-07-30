import { NextResponse } from 'next/server'
import { stat } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'src', 'download', 'my-project.tar.gz')
    const fileStats = await stat(filePath)
    
    return NextResponse.json({
      size: fileStats.size,
      filename: 'my-project.tar.gz',
      lastModified: fileStats.mtime,
    })
  } catch (error) {
    console.error('Error getting file info:', error)
    return NextResponse.json(
      { error: 'File not found' },
      { status: 404 }
    )
  }
}