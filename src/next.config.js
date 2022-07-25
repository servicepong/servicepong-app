/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',

  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL,
    NEXT_PUBLIC_CDN_URL: process.env.NEXT_PUBLIC_CDN_URL,
    NEXT_PUBLIC_DOCS_URL: process.env.NEXT_PUBLIC_DOCS_URL,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  },

  poweredByHeader: false,

  images: {
    domains: [
      'servicepong.io',
      'rocket.servicepong.io',
      'servicepong.xyz',
      'rocket.servicepong.xyz',
    ],
  },

  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
        },
      ],
    });

    return config;
  },

  sassLoader: {
    includePaths: [path.resolve(__dirname, './styles')],
  },

  sassOptions: {
    includePaths: [path.join(__dirname, './styles')],
  },
};

const SentryWebpackPluginOptions = {
  dryRun: process.env.NEXT_PUBLIC_APP_ENV !== 'production',
  silent: true,
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

module.exports = withSentryConfig(nextConfig, SentryWebpackPluginOptions);
