/** @type {import('tailwindcss').Config} */
import nativewind from "nativewind/preset";

export const content = [
  "./app/_layout.tsx",
  "./app/**/*.{js,jsx,ts,tsx}",
  "./components/**/*.{js,jsx,ts,tsx}",
];
export const presets = [nativewind.default || nativewind];
export const theme = {
  extend: {},
};
export const plugins = [];
