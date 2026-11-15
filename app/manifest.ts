import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function manifest(): MetadataRoute.Manifest {
  return { name: "OrbitCare — Mission health review", short_name: "OrbitCare", description: "Personal changes. Explained. An offline-capable astronaut health research prototype.", start_url: "/", scope: "/", display: "standalone", background_color: "#F5F7F6", theme_color: "#122235", icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }, { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" }, { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" }] };
}
