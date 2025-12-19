import { useEffect, useState } from 'react';
import { fetchBoardsList } from '../api/boardsApi';
import { type UseBoardsListResult} from '../types'

export default function useBoardsList(): UseBoardsListResult {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    fetchBoardsList()
      .then((data) => {
        setBoards(data);
        setLoading(false);
      })
  }, []);

  return { boards, loading};
}
