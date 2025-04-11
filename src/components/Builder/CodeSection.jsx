import React, { useState, useEffect, useRef } from "react";
import { FileExplorer } from "./FileExplorer";
import { EditorTabs } from "./EditorTabs";
import { CodeEditor } from "./CodeEditor";
import { PreviewPane } from "./PreviewPane";
import { Terminal } from "./Terminal";
import { getFileLanguage } from "./utils";
import { WebContainerManager } from "./WebContainerManager";

export function CodeSection({
  files,
  selectedFile,
  activeTab,
  onFileSelect,
  onTabChange,
}) {
  const [previewUrl, setPreviewUrl] = useState("");
  const [webcontainerInstance, setWebcontainerInstance] = useState(null);
  const xtermRef = useRef(null); // 🖥️ Terminal instance

  useEffect(() => {
    console.log("🔗 Updated preview URL:", previewUrl);
  }, [previewUrl]);

  return (
    <div className="flex-1 flex flex-col bg-gray-950">
      <EditorTabs activeTab={activeTab} onTabChange={onTabChange} />

      {/* Ensure WebContainerManager gets the correct file structure */}
    

      <WebContainerManager
        files={files} // Pass only the children
        setPreviewUrl={setPreviewUrl}
        setWebcontainer={setWebcontainerInstance}
        xtermRef={xtermRef} // 📌 Pass terminal reference
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex overflow-hidden">
          {activeTab === "code" ? (
            <>
              {/* Ensure FileExplorer also gets the correct structure */}
              <FileExplorer files={files[0]?.children || []} onFileSelect={onFileSelect} />
              <div className="flex-1">
                {selectedFile ? (
                  <CodeEditor
                    content={selectedFile.content || ""}
                    language={getFileLanguage(selectedFile.name)}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Select a file to view its contents
                  </div>
                )}
              </div>
            </>
          ) : (
            
            <PreviewPane previewUrl={previewUrl} />            
          )}
        </div>

        {/* Terminal Section */}
        <div className="h-64 border-t border-gray-800 mb-10">
          <div className="bg-gray-900 p-2 border-b border-gray-800 ">
            <span className="text-sm text-gray-400">Terminal</span>
          </div>
          <Terminal xtermRef={xtermRef} /> {/* 📌 Pass terminal reference */}
        </div>
      </div>
    </div>
  );
}
