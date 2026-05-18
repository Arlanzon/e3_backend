import { swaggerSpec } from '../src/lib/swagger'
import fs from 'fs'
import path from 'path'

const outputPath = path.join(process.cwd(), 'public', 'openapi.json')

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2))

console.log('✓ openapi.json generado en public/')