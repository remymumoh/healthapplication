const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable package exports resolution to avoid TypeScript issues
config.resolver.unstable_enablePackageExports = false;

// Ensure proper module resolution
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Clean source extensions - ensure TypeScript files are handled properly
config.resolver.sourceExts = ['js', 'jsx', 'ts', 'tsx', 'json'];

// Clean asset extensions - remove any overlap with source extensions
config.resolver.assetExts = config.resolver.assetExts.filter(
    ext => !['js', 'jsx', 'ts', 'tsx', 'json'].includes(ext)
);

module.exports = config;