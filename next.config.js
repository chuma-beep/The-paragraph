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
              env:{
                SUPABASE_URL: process.env.SUPABASE_URL,
                SUPABASE_API_KEY: process.env.SUPABASE_API_KEY,
              }
};

module.exports = nextConfig;
