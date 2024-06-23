import { fileURLToPath } from 'url'
import path from 'path'

// Convert URL to path for __dirname equivalent
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: [path.join(__dirname, 'styles')],
}

export default nextConfig
