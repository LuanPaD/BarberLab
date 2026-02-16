import nextPlugin from "eslint-config-next";

const config = [
    {
        ignores: [".next/**", "node_modules/**"],
    },
    ...nextPlugin,
    {
        rules: {
            "no-unused-vars": "error",
            "react-hooks/set-state-in-effect": "off",
        },
    }
];

export default config;