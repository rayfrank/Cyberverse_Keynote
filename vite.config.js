import { defineConfig } from "vite";

export default defineConfig(() => {
  const isGitHubPages = process.env.GITHUB_PAGES === "true" || process.env.GITHUB_ACTIONS === "true";
  return {
    base: isGitHubPages ? "/Cyberverse_Keynote/" : "/"
  };
});

