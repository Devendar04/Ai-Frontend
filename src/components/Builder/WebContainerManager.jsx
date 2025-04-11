import { useEffect } from "react";
import { useWebContainer } from "../../hooks/useWebContainer.js";

export function WebContainerManager({ files, setPreviewUrl, xtermRef }) {
  const webcontainer = useWebContainer();

  const writeToTerminal = (message) => {
    console.log(message);
    if (xtermRef?.current) xtermRef.current.writeln(message);
  };

  useEffect(() => {
    if (!webcontainer) return;

    // Set up the server-ready event listener immediately
    webcontainer.on("server-ready", async (port, url) => {
      console.log("Server Ready Event Triggered", { port, url });

      if (!url) {
        writeToTerminal("❌ URL is empty! Trying manual retrieval...");
        const resolvedUrl = await webcontainer.getURL(port);
        writeToTerminal("🔍 Manually Retrieved URL: " + resolvedUrl);
        setPreviewUrl(resolvedUrl || `http://localhost:5173`);
      } else {
        setPreviewUrl(url);
      }
    });

    async function setupContainer() {
      try {
        writeToTerminal("🔄 Setting up WebContainer...");

        // Check if package.json exists
        const packageJsonFile = files.find(file => file.name === "package.json");

        if (!packageJsonFile) {
          writeToTerminal("⚠️ No package.json found! Creating one...");
          files.push(files[0].children[0]);
        }

        console.log("🗂 Final file structure:", files[0].children[0]);
          

        // 🛠️ Convert files array to WebContainer structure
        const createMountStructure = (files) => {
          if (!Array.isArray(files)) return {}; // Ensure input is an array

          return Object.fromEntries(
            files.map((file) => [
              file.name,
              file.type === "folder"
                ? { directory: createMountStructure(file.children || []) }
                : { file: { contents: file.content || "" } },
            ])
          );
        };

        // Log file structure before mounting
        const fileStructure = createMountStructure(files);
        console.log("🗂 Mounting file structure:", fileStructure);

        await webcontainer.mount(fileStructure);
        writeToTerminal("✅ Files mounted successfully!");

        // 📦 Install dependencies
        writeToTerminal("📦 Installing dependencies...");
        const installProcess = await webcontainer.spawn("npm", ["install"]);

        installProcess.output.pipeTo(
          new WritableStream({
            write: (chunk) => {
              writeToTerminal(chunk);
            },
          })
        );

        const installExitCode = await installProcess.exit;
        if (installExitCode !== 0) {
          writeToTerminal("🚨 npm install failed!");
          throw new Error("Dependency installation failed!");
        }

        writeToTerminal("✅ Dependencies installed!");

        // 🚀 Start the dev server
        writeToTerminal("🚀 Starting Vite Dev Server...");
        const startProcess = await webcontainer.spawn("npm", ["run", "dev"]);

        startProcess.output.pipeTo(
          new WritableStream({
            write: (chunk) => {
              writeToTerminal(chunk);

              // Improved URL detection
              const urlMatch = chunk.match(/(https?:\/\/[^\s]+)/);
              if (urlMatch && urlMatch[1]) {
                const detectedUrl = urlMatch[1].trim();
                writeToTerminal(`🔎 Detected URL in output: ${detectedUrl}`);
                setPreviewUrl(detectedUrl);
              }
            },
          })
        );

        writeToTerminal("✅ Vite server process started");

        // Fallback after 5 seconds if no URL is detected
        setTimeout(() => {
          setPreviewUrl((current) => {
            if (!current) {
              writeToTerminal("⚠️ No URL detected after timeout, using fallback");
              return "http://localhost:5173";
            }
            return current;
          });
        }, 5000);
      } catch (error) {
        writeToTerminal("❌ WebContainer setup failed: " + error);
        console.error("WebContainer setup error:", error);
      }
    }

    setupContainer();

    return () => {
      // Cleanup if needed
    };
  }, [files, webcontainer, setPreviewUrl, xtermRef]);

  return null;
}
