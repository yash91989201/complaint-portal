/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "avatars.dicebear.com",
      "updrzfqvjfhophnanpqv.nhost.run",
      "s.gravatar.com",
    ],
  },
};

module.exports = nextConfig;
