/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		// REMOVE
		unoptimized: true,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'placehold.co',
				port: '',
				pathname: '/**',
			},
		],
	},
}

export default nextConfig
