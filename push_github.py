import base64
import json
import os
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError

REPO = "sanjays24b28/AttendanceDashboard"
BASE_DIR = Path(__file__).resolve().parent
EXCLUDE = {"node_modules", ".git", ".DS_Store", "push_github.py"}
API_BASE = "https://api.github.com"


def get_token():
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        return token.strip()
    raise SystemExit("Set GITHUB_TOKEN in your environment and rerun this script.")


def request(method, url, data=None, headers=None):
    if headers is None:
        headers = {}
    headers["Authorization"] = f"token {get_token()}"
    headers["User-Agent"] = "AttendanceDashboardUploader"
    if data is not None:
        data = json.dumps(data).encode("utf-8")
        headers["Content-Type"] = "application/json"
    req = Request(url, data=data, headers=headers, method=method)
    try:
        with urlopen(req) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except HTTPError as error:
        message = error.read().decode("utf-8")
        raise SystemExit(f"HTTP {error.code}: {message}")


def upload_file(path, repo_path):
    content = path.read_bytes()
    payload = {
        "message": f"Add {repo_path}",
        "content": base64.b64encode(content).decode("utf-8"),
        "branch": "main"
    }

    url = f"{API_BASE}/repos/{REPO}/contents/{repo_path}"
    try:
        existing = request("GET", url)
        payload["sha"] = existing["sha"]
    except SystemExit as e:
        if "HTTP 404" in str(e):
            pass
        else:
            raise

    return request("PUT", url, payload)


def main():
    files = []
    for path in sorted(BASE_DIR.rglob("*")):
        if path.is_dir():
            continue
        rel = path.relative_to(BASE_DIR)
        if any(part in EXCLUDE for part in rel.parts):
            continue
        files.append((path, str(rel).replace('\\', '/')))

    print(f"Preparing to upload {len(files)} files to {REPO} on branch main.")
    for path, repo_path in files:
        print(f"Uploading {repo_path}...")
        response = upload_file(path, repo_path)
        print(f"Uploaded {repo_path}: {response.get('commit', {}).get('sha', 'unknown')}\n")
    print("Done. Your files were uploaded to GitHub.")


if __name__ == "__main__":
    main()
