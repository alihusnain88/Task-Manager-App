import { useEffect, useState } from 'react';
import { fetchBoardData } from '../api/boardsApi';
import {type UseBoardDataResult} from '../types'

export default function useBoardData(boardLink: string | null): UseBoardDataResult {
  const [boardData, setBoardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!boardLink) return; 

    setLoading(true);
    setError("");

    fetchBoardData(boardLink)
      .then((data) => {
        setBoardData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Error fetching board data');
        setLoading(false);
      });
  }, [boardLink]);

  return { boardData, loading, error };
}
