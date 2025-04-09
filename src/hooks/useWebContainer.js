import { useEffect, useState } from "react";
import { WebContainer } from "@webcontainer/api";

let webcontainerInstance = null; // Singleton instance

export function useWebContainer() {
  const [webcontainer, setWebContainer] = useState(null);

  useEffect(() => {
    async function bootWebContainer() {
      if (!webcontainerInstance) {
        console.log("🚀 Booting WebContainer...");
        webcontainerInstance = await WebContainer.boot();
      }
      setWebContainer(webcontainerInstance);
    }

    bootWebContainer();

    return () => {
      console.log("🛑 Cleaning up WebContainer...");
    };
  }, []);

  return webcontainer;
}
