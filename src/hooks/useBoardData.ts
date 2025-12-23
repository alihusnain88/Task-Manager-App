import { useEffect, useState } from "react";
import { fetchBoardData } from "../api/boardsApi";
import { type Board, type UseBoardDataResult } from "../types";

export default function useBoardData(
  boardLink: string | null
): UseBoardDataResult {
  const [boardData, setBoardData] = useState<Board | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!boardLink) return;

    const link = boardLink; // Because boardLink was giving string | null typescript error
    async function loadBoard() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchBoardData(link);
        setBoardData(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error fetching board data");
        }
      } finally {
        setLoading(false);
      }
    }

    loadBoard();
  }, [boardLink]);

  return {
    boardData: boardData ? { tasks: boardData.tasks || [] } : null,
    loading,
    error,
  };
}
