import { useState, useEffect } from 'react';

const useGitHubRepo = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const owner = "octopi-digital";
  const repo = "raw-custom-components-wordpress-ghl";
  const token = import.meta.env.VITE_GITHUB_TOKEN;

  useEffect(() => {
    const fetchRepoContents = async () => {
      try {
    
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`,
          {
            headers: {
              Authorization: `token ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error fetching repository data: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Filter to retrieve only text files (skipping images)
        const textFiles = data.tree.filter(file => 
          file.type === 'blob' && !file.path.match(/\.(jpg|jpeg|png|gif|bmp|svg)$/i)
        );

        // Fetch all text files in parallel
        const filePromises = textFiles.map(async (file) => {
          const fileResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`,
            {
              headers: {
                Authorization: `token ${token}`,
              },
            }
          );

          if (!fileResponse.ok) {
            console.error(`Error fetching file ${file.path}: ${fileResponse.statusText}`);
            return null; // Skip this file if there's an error
          }

          const fileData = await fileResponse.json();
          return {
            path: file.path,
            content: atob(fileData.content),
            downloadUrl: fileData.download_url,
          };
        });

        const fileDataArray = (await Promise.all(filePromises)).filter(Boolean); // Filter out any failed requests

        setFiles(fileDataArray);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepoContents();
  }, [owner, repo, token]);

  return { files, loading, error };
};

export default useGitHubRepo;


