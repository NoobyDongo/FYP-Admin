/** @type {import('next').NextConfig} */
const fs = require('fs')
const nextConfig = {
    env: {
        NEXT_PUBLIC_WS_PORT: '3001',
        NEXT_PUBLIC_SERVER_PORT: '3000',
        NEXT_PUBLIC_AUTH_PORT: '3002',
        NEXT_PUBLIC_HOSTNAME: 'localhost',
        NEXT_PUBLIC_IMAGE_UPLOAD_WS_START: 'startImageUpload',
        NEXT_PUBLIC_IMAGE_UPLOAD_WS_END: 'endImageUpload',
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: fs.readFileSync('./map.key', 'utf8'),
      },
}

const ANALYZE = process.env.ANALYZE === 'true'
var withBundleAnalyzer = null;
if(ANALYZE)
{
    withBundleAnalyzer = require('@next/bundle-analyzer')({
        enabled: true,
        ...nextConfig
    })
}
module.exports = ANALYZE ? withBundleAnalyzer(nextConfig) : nextConfig;
