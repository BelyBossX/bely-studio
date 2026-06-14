import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({

  plugins: [

    react(),

    VitePWA({

  registerType: "autoUpdate",

  devOptions: {
    enabled: false
  },

      manifest: {

        name: "Bely AI Studio",

        short_name: "Bely AI",

        description:
          "Haitian AI Voice Generator",

        theme_color: "#020f35",

        background_color: "#020f35",

        display: "standalone",

        start_url: "/",

        icons: [
  {
    src: "logo-192.png",
    sizes: "192x192",
    type: "image/png"
  },
  {
    src: "logo-512.png",
    sizes: "512x512",
    type: "image/png"
  }
]

      }

    })

  ]

});