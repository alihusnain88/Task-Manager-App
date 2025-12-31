import { useEffect, useState } from "react";
import { fetchBoardsList } from "../api/boardsApi";
import { type Board, type UseBoardsListResult } from "../types";

export default function useBoardsList(): UseBoardsListResult {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBoards() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchBoardsList();
        setBoards(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown Error");
        }
      } finally {
        setLoading(false);
      }
    }

    loadBoards();
  }, []);

  return { boards, loading, error };
}
