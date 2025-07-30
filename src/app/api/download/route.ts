import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(request: NextRequest) {
  try {
    const filePath = join(process.cwd(), 'src', 'download', 'my-project.tar.gz')
    
    // Read the file
    const fileBuffer = await readFile(filePath)
    
    // Return the file as a downloadable response
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/gzip',
        'Content-Disposition': 'attachment; filename="my-project.tar.gz"',
        'Content-Length': fileBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('Error serving download file:', error)
    return NextResponse.json(
      { error: 'File not found or unable to serve' },
      { status: 404 }
    )
  }
}