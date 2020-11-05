import { useContext, createContext } from 'react';

const themeMap = {
    dark: {
        fill: 'white'
    },
    light: {
        fill: 'black'
    }
}

export const Theme = createContext(themeMap.light);

export function getTheme(themeString){
    return themeMap[themeString || 'dark'];
}

export function useTheme() {
    const theme = useContext(Theme);
    return theme;
}