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
    const setupContainer = async () => {
      try {
        writeToTerminal("🔄 Setting up WebContainer...");
        const createMountStructure = (files) => {
          if (!Array.isArray(files)) return {};
          return Object.fromEntries(
            files.map((file) => [
              file.name,
              file.type === "folder"
                ? { directory: createMountStructure(file.children || []) }
                : { file: { contents: file.content || "" } },
            ])
          );
        };

        const root = files[0]; // Assuming this is the root folder
        const mountStructure = createMountStructure(root.children || []);
        console.log("🗂 Mounting file structure:", mountStructure);

        await webcontainer.mount(mountStructure);
        writeToTerminal("✅ Files mounted successfully!");

       
        webcontainer.on("server-ready", (port, url) => {
          writeToTerminal(`🌐 Server Ready at ${url} (Port: ${port})`);
          if (!url) {
            writeToTerminal("❌ No URL provided!");
            return;
          }
          setPreviewUrl(url);
        });

        // Install dependencies
        writeToTerminal("📦 Installing dependencies...");
        const installProcess = await webcontainer.spawn("npm", ["install"]);
        installProcess.output.pipeTo(
          new WritableStream({ write: writeToTerminal })
        );

        const installExitCode = await installProcess.exit;
        if (installExitCode !== 0) {
          writeToTerminal("🚨 npm install failed!");
          throw new Error("Dependency installation failed!");


        }
        writeToTerminal("✅ Dependencies installed!");

        // Start Vite dev server 
        writeToTerminal("🚀 Starting Vite Dev Server...");
        const startProcess = await webcontainer.spawn("npm", ["run", "dev"]);
        startProcess.output.pipeTo(
          new WritableStream({ write: writeToTerminal })
        );
        const startExitCode = await startProcess.exit;
        if (startExitCode !== 0) {
          throw new Error("❌ Vite failed to start!");
        }

      } catch (error) {
        writeToTerminal(`❌ WebContainer setup failed: ${error.message}`);
        console.error(error);
      }
    };

    setupContainer();

    return () => {
      // Cleanup if needed
    };
  }, [files, webcontainer, setPreviewUrl, xtermRef]);

  return null;
}
