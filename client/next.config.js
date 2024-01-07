/** @type {import('next').NextConfig} */
const nextConfig = {}

const ANALYZE = process.env.ANALYZE === 'true'
var withBundleAnalyzer = null;
if(ANALYZE)
{
    withBundleAnalyzer = require('@next/bundle-analyzer')({
        enabled: true,
    })
}
module.exports = ANALYZE ? withBundleAnalyzer(nextConfig) : nextConfig;
