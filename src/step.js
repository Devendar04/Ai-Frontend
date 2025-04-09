
/*
 * Parse input XML and convert it into steps.
 * 
 * Example Input:
 * <SOENArtifact id="project-import" title="Project Files">
 *   <SOENAction type="file" filePath="eslint.config.js">
 *       import js from '@eslint/js';\nimport globals from 'globals';\n
 *   </SOENAction>
 *   <SOENAction type="shell">
 *       node index.js
 *   </SOENAction>
 * </SOENArtifact>
 * 
 * Example Output:
 * 
 *   {
    name: 'src',
    type: 'folder',
    children: [
      { 
        name: 'App.jsx',
        type: 'file',
        content: 'import React from "react";\n\nfunction App() {\n  return <div>Hello World</div>;\n}\n\nexport default App;'
      },
      { 
        name: 'main.jsx',
        type: 'file',
        content: 'import React from "react";\nimport ReactDOM from "react-dom/client";\nimport App from "./App";\n\nReactDOM.createRoot(document.getElementById("root")).render(<App />);'
      },
      {
        name: 'components',
        type: 'folder',
        children: [
          {
            name: 'Header.jsx',
            type: 'file',
            content: 'import React from "react";\n\nexport function Header() {\n  return <header>Header</header>;\n}'
          }
        ]
      }
    ]
  }
 
 */

// Define the StepType enum
export const StepType = {
    CreateFolder: 'CreateFolder',
    CreateFile: 'CreateFile',
    RunScript: 'RunScript'
  };
  
  // Define the Step structure
  export class Step {
    constructor(id, title, description, type, status, code = '', path = '') {
      this.id = id;
      this.title = title;
      this.description = description;
      this.type = type;
      this.status = status;
      this.code = code;
      this.path = path;
    }
  }
  
  export function parseXml(response) {
    const xmlMatch = response.match(/<SOENArtifact[^>]*>([\s\S]*?)<\/SOENArtifact>/);
  
    if (!xmlMatch) return [];

    const xmlContent = xmlMatch[1];
    let rootFolder = {
        name: "src", // Root folder is always 'src'
        type: "folder",
        children: []
    };

    // Regex to find SOENAction elements
    const actionRegex = /<SOENAction\s+type="([^"]*)"(?:\s+filePath="([^"]*)")?>([\s\S]*?)<\/SOENAction>/g;

    let match;
    while ((match = actionRegex.exec(xmlContent)) !== null) {
        const type = match[1];
        const filePath = match[2];
        const content = match[3].trim();

        if (type === 'file' && filePath) {
            addFileToStructure(rootFolder, filePath, content);
        }
    }

    return [rootFolder]; // Return as an array
}

// Helper function to create nested file structure
function addFileToStructure(root, filePath, content) {
    const parts = filePath.split('/'); // Split filePath into folders/files
    let currentFolder = root;

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        // If it's the last part, it's a file
        if (i === parts.length - 1) {
            currentFolder.children.push({
                name: part,
                type: "file",
                content: content
            });
        } else {
            // It's a folder, check if it exists, otherwise create it
            let existingFolder = currentFolder.children.find(child => child.type === "folder" && child.name === part);
            if (!existingFolder) {
                existingFolder = { name: part, type: "folder", children: [] };
                currentFolder.children.push(existingFolder);
            }
            currentFolder = existingFolder;
        }
    }
}


