/** @type {import('next').NextConfig} */
const nextConfig = {
        images: {
                domains: ['ccsxbqjentenabdsqtmn.supabase.co'],
                remotePatterns: [
                        {
                          protocol: 'https',
                          hostname: 'avatars.githubusercontent.com',
                          port: '',
                          pathname: '/**',
                        },
                ],
              },
};

module.exports = nextConfig;
