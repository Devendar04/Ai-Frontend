import React from "react";

export function PreviewPane({ previewUrl }) {
  
  return previewUrl ? (
    <iframe src={previewUrl} className="w-full h-full border-0" title="Website Preview" />
  ) : (
    <div className="flex items-center justify-center h-full text-gray-400">
      Starting preview...
    </div>
  );
}
 