// useGitHubRepo.js
import { useState, useEffect } from 'react';

const useGitHubRepo = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const owner = "octopi-digital";
  const repo = "raw-custom-components-wordpress-ghl";
  const token = import.meta.env.VITE_GITHUB_TOKEN; 
  console.log(token)
  useEffect(() => {
    const fetchRepoContents = async () => {
      try {
        // Fetch the list of files in the repository with authorization
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
        const fileDataArray = [];

        // Loop through each file in the repository
        for (const file of data.tree) {
          if (file.type === 'blob') {
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
              continue;
            }

            const fileData = await fileResponse.json();
            let content;

            // Check if the file is an image or text file
            if (file.path.match(/\.(jpg|jpeg|png|gif|bmp|svg)$/i)) {
              // Set content to null for images (we'll just use the download URL)
              content = null;
            } else {
              // Decode content for text-based files
              content = atob(fileData.content);
            }

            // Add file information to array
            fileDataArray.push({
              path: file.path,
              content,
              isImage: file.path.match(/\.(jpg|jpeg|png|gif|bmp|svg)$/i),
              downloadUrl: fileData.download_url,
            });
          }
        }

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
