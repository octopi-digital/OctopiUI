import React, { useState } from 'react';

const CodeViewer = ({ files }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Function to filter files based on the search query
  const filteredFiles = files.filter(file => {
    // Split the search query into words
    const queryWords = searchQuery.toLowerCase().trim().split(' ');
    // Check if any word matches the file path
    return queryWords.some(word => file.path.toLowerCase().includes(word));
  });

  // Function to copy code to clipboard
  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    alert('Code copied to clipboard!');
  };

  return (
    <div className="container mx-auto p-4">
      {/* Search Input */}
      
     <input  type="text"
        placeholder="Search Here..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input focus:border-2 focus:border-[#f79426] dark:text-white dark:bg-[#1f2937] fixed top-2 z-60 w-full rounded-md mb-10 max-w-xs" />
      {filteredFiles.map((file, index) => (
        <CodeCard key={index} file={file} onCopy={handleCopy} />
      ))}
    </div>
  );
};

// Card component for each file with Preview and Code tabs
const CodeCard = ({ file, onCopy }) => {
  const [activeTab, setActiveTab] = useState("preview");

  return (
    <div className="mb-8 p-4 border border-gray-300 rounded-lg dark:bg-[#1f2937]  bg-gray-50 shadow-md">
      {/* File name */}
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{file.path}</h2>

      {/* Tab controls */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab("preview")}
          className={`px-4 py-2 ${
            activeTab === "preview" ? "text-[#f79426] border-b-2 border-[#f79426]" : "text-gray-600 dark:text-white"
          }`}
        >
          Preview
        </button>
        <button
          onClick={() => setActiveTab("code")}
          className={`px-4 py-2 ${
            activeTab === "code" ? "text-[#f79426] border-b-2 border-[#f79426]" : "text-gray-600 dark:text-white"
          }`}
        >
          Code
        </button>
      </div>

      {/* Tab content */}
      {activeTab === "preview" ? (
        // Preview content
        <div
          className="p-4 border border-gray-200 rounded-lg bg-white dark:text-white dark:bg-black"
          dangerouslySetInnerHTML={{ __html: file.content }}
        ></div>
      ) : (
        // Code content
        <div className="relative">
          <pre className="overflow-auto bg-gray-900 text-white p-4 rounded-lg text-sm">
            <code>{file.content}</code>
          </pre>

          {/* Copy button */}
          <button
            onClick={() => onCopy(file.content)}
            className="absolute top-4 right-4 px-3 py-1 text-xs font-medium text-white bg-[#f79426] rounded hover:bg-[#f79426]"
          >
            Copy Code
          </button>
        </div>
      )}
    </div>
  );
};

export default CodeViewer;
