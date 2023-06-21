import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';

export default function useNavigateEffect(callback) {
  let location = useLocation();

  useEffect(() => callback({location}), [callback, location]);
}
