import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  const specPath = path.join(process.cwd(), 'public', 'openapi.json')
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf-8')) as Record<string, unknown>
  return NextResponse.json(spec)
}