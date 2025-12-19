const BOARDS_LIST_URL =
  'https://raw.githubusercontent.com/devchallenges-io/curriculum/refs/heads/main/4-frontend-libaries/challenges/group_1/data/task-manager/list.json';


export async function fetchBoardsList() {
  const res = await fetch(BOARDS_LIST_URL);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch boards list: ${res.status} ${res.statusText} ${text}`);
  }
  return res.json();
}


export async function fetchBoardData(boardLink) {
  if (!boardLink) throw new Error('fetchBoardData: boardLink is required');
  const res = await fetch(boardLink);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch board data: ${res.status} ${res.statusText} ${text}`);
  }
  return res.json();
}
