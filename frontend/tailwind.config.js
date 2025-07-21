/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
        "./src/**/*.{js,jsx,ts,tsx}",

  ],
  theme: {
    extend: {
      animation:{
        'gradient':'gradient 8s ease infinite',
        'float': 'float 3s ease-in-out infinite',
        'pluse-slow':'pluse 3s ease-in-out infinite'
      },
      keyframes:{
        gradient:{
          '0%, 100%' :{
            'background-size': '200% 200%',
            'backfround-position':'left center'
          },
          '50%':{
            'background-size': '200% 200%',
            'backfround-position':'right center'
          },
        },
        float :{
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      colors:{
        primary:{
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        
        }
      }

    },
  },
  plugins: [],
}

