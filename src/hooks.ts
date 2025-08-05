import { useLocation } from 'wouter';

/**
 * A custom hook that provides a navigation function.
 * This function can be used to change the current route.
 */
export const useNavigate = () => useLocation()[1];
