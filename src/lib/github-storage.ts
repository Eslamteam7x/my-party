const GH_CONFIG_KEY = 'wedding_github_config';

export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  folder: string;
}

export function getGitHubConfig(): GitHubConfig | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(GH_CONFIG_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveGitHubConfig(config: GitHubConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GH_CONFIG_KEY, JSON.stringify(config));
}

export async function uploadToGitHub(
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  const config = getGitHubConfig();
  if (!config) throw new Error('GitHub config not found');

  const { token, owner, repo, branch, folder } = config;
  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const path = `${folder}/${fileName}`;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  onProgress?.(10);

  const reader = new FileReader();
  const content = await new Promise<string>((resolve, reject) => {
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  onProgress?.(40);

  const body = {
    message: `Upload ${file.name}`,
    content,
    branch,
  };

  const res = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github.v3+json',
    },
    body: JSON.stringify(body),
  });

  onProgress?.(80);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `GitHub API error: ${res.status}`);
  }

  const data = await res.json();
  const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;

  onProgress?.(100);
  return rawUrl;
}

export async function deleteFromGitHub(fileName: string): Promise<void> {
  const config = getGitHubConfig();
  if (!config) throw new Error('GitHub config not found');

  const { token, owner, repo, branch, folder } = config;
  const path = `${folder}/${fileName}`;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  const getRes = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!getRes.ok) return;

  const getData = await getRes.json();

  await fetch(apiUrl, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github.v3+json',
    },
    body: JSON.stringify({
      message: `Delete ${fileName}`,
      sha: getData.sha,
      branch,
    }),
  });
}

export async function listGitHubFiles(): Promise<{ name: string; url: string }[]> {
  const config = getGitHubConfig();
  if (!config) return [];

  const { token, owner, repo, branch, folder } = config;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${folder}?ref=${branch}`;

  const res = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!res.ok) return [];

  const data = await res.json();
  if (!Array.isArray(data)) return [];

  return data
    .filter((item: any) => item.type === 'file')
    .map((item: any) => ({
      name: item.name,
      url: item.download_url,
    }));
}
