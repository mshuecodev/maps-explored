import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	/* config options here */
	basePath: process.env.NEXT_PUBLIC_BASE_PATH || "", // Use environment variable or default to ""
	assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || ""
}

export default nextConfig
