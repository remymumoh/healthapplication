module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            'babel-preset-expo',
            '@babel/preset-typescript'
        ],
        plugins: [
            // Remove react-native-reanimated/plugin as it's been moved to react-native-worklets
            // and is not needed for this project currently
        ],
    };
};