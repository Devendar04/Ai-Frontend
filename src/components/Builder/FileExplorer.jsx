import React, { useState } from 'react';
import { File, Folder, ChevronRight, ChevronDown } from 'lucide-react';

function FileNode({ item, level, onFileSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (item.type === 'folder') {
      setIsOpen(!isOpen);
    } else {
      onFileSelect(item);
    }
  };

  return (
    <div className="select-none">
      <div
        className="flex items-center space-x-1 text-gray-300 hover:text-blue-500 cursor-pointer p-1 rounded hover:bg-gray-800"
        style={{ paddingLeft: `${level * 12}px` }}
        onClick={handleClick}
      >
        {item.type === 'folder' && (
          <span className="w-4">
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </span>
        )}
        {item.type === 'folder' ? (
          <Folder className="h-4 w-4" />
        ) : (
          <File className="h-4 w-4" />
        )}
        <span className="text-sm">{item.name}</span>
      </div>
      {item.type === 'folder' && isOpen && item.children && (
        <div>
          {item.children.map((child, index) => (
            <FileNode
              key={`${child.name}-${index}`}
              item={child}
              level={level + 1}
              onFileSelect={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileExplorer({ files, onFileSelect }) {
  return (
    <div className="bg-gray-900 border-r border-gray-800 w-80 p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold text-white mb-4">Files</h3>
      <div>
        {files.map((file, index) => (
          <FileNode
            key={`${file.name}-${index}`}
            item={file}
            level={0}
            onFileSelect={onFileSelect}
          />
        ))}
      </div>
    </div>
  );
}