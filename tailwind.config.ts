import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        milford: {
          charcoal: '#303C42',
          orange: '#E47126',
          cream: '#F7F4EF',
          ink: '#1F2933',
          mist: '#E5E7EB'
        }
      },
      boxShadow: { soft: '0 18px 45px rgba(48,60,66,0.10)' }
    }
  },
  plugins: []
};
export default config;
