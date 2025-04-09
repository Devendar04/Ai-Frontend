import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { StepsList } from "./StepsList";
import { CodeSection } from "./CodeSection";
import { resFile} from "./builderData";
import { Menu } from "lucide-react";

export function BuilderView() {
  const location = useLocation();
  const [files] = useState(resFile);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState("code");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFileExplorerOpen, setIsFileExplorerOpen] = useState(true);
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);

  const handleFileSelect = (file) => {
    if (file.type === "file") {
      setSelectedFile(file);
      setActiveTab("code");
    }
  };
  const handleCodeChange = (newContent) => {
    if (!selectedFile) return;

    // Update the file content in the files state
    setFiles((prevFiles) => {
      const updateFileContent = (items) => {
        return items.map((item) => {
          if (item.type === "folder" && item.children) {
            return {
              ...item,
              children: updateFileContent(item.children),
            };
          }
          if (item.name === selectedFile.name && item.type === "file") {
            return {
              ...item,
              content: newContent,
            };
          }
          return item;
        });
      };

      return updateFileContent(prevFiles);
    });

    // Update the selected file content
    setSelectedFile({
      ...selectedFile,
      content: newContent,
    });
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
      {/* Mobile Chat Toggle */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="md:hidden fixed bottom-4 right-4 z-50 bg-blue-600 p-3 rounded-full shadow-lg"
      >
        <Menu className="h-6 w-6 text-white" />
      </button>

      {/* Chat Section - Hidden on mobile unless toggled */}
      <div
        className={`
        fixed md:relative w-full md:w-auto
        h-full z-40 transform transition-transform duration-300 ease-in-out
        ${isChatOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <StepsList />
      </div>

      {/* Overlay for mobile */}
      {isChatOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsChatOpen(false)}
        />
      )}

      <CodeSection
        files={files}
        selectedFile={selectedFile}
        activeTab={activeTab}
        onFileSelect={handleFileSelect}
        onTabChange={setActiveTab}
        isFileExplorerOpen={isFileExplorerOpen}
        setIsFileExplorerOpen={setIsFileExplorerOpen}
        onCodeChange={handleCodeChange}
      />
    </div>
  );
}
