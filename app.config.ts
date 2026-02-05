import type { ConfigContext, ExpoConfig } from "expo/config";

const BUNDLE_IDENTIFIER = "com.lhagfoss.pinterestclone";
const PACKAGE_NAME = "com.lhagfoss.pinterestclone";
const APP_VERSION = "0.01.0";
const BUILD_NUMBER = "1";
const VERSION_CODE = 1;
const EXPO_EAS_OWNER = "lhagfoss";

export default ({ config }: ConfigContext): ExpoConfig => {
    return {
        ...config,
        name: "Pinterest Clone",
        slug: "pinterest-clone",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./src/assets/images/icon.png",
        userInterfaceStyle: "dark",
        scheme: "pinterest-clone",
        ios: {
            supportsTablet: true,
            bundleIdentifier: BUNDLE_IDENTIFIER,
            googleServicesFile: "./GoogleService-Info.plist",
            infoPlist: {
                UIBackgroundModes: ["fetch", "remote-notification"],
            },
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./src/assets/images/icon.png",
                backgroundColor: "#000000",
            },
            package: PACKAGE_NAME,
        },
        plugins: [
            "expo-router",
            "expo-font",
            [
                "expo-splash-screen",
                {
                    "backgroundColor": "#000000",
                    "image": "./src/assets/images/icon.png",
                    "imageWidth": 200
                }
            ],
            [
                "expo-image-picker",
                {
                    photosPermission:
                        "Allow Pinterest Clone to access your photos to create Pins.",
                },
            ],
            [
                "expo-build-properties",
                {
                    ios: {
                        useFrameworks: "static",
                        forceStaticLinking: [
                            "RNFBApp",
                            "RNFBAuth",
                            "RNFBFirestore",
                            "RNFBStorage",
                        ],
                    },
                },
            ],
            [
                "@react-native-google-signin/google-signin",
                {
                    iosUrlScheme:
                        "com.googleusercontent.apps.382654416986-e3hah3s6edh00smbedkhr5oph8f4mena",
                },
            ],
            "@react-native-firebase/app",
            "@react-native-firebase/auth",
            "@react-native-community/datetimepicker",
        ],
        experiments: {
            typedRoutes: true,
            reactCompiler: true,
        },
    };
};
