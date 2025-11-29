/**
 * Navigation utilities that work on both web and native
 * Uses react-router-dom on web and expo-router on native
 */

import { Platform } from 'react-native';

let Link, useNavigate, useLocation;

if (Platform.OS === 'web') {
  // Web: use react-router-dom
  try {
    const router = require('react-router-dom');
    Link = router.Link;
    useNavigate = router.useNavigate;
    useLocation = router.useLocation;
  } catch (e) {
    console.warn('react-router-dom not available');
  }
} else {
  // Native: use expo-router
  const expoRouter = require('expo-router');
  
  // Create Link wrapper
  Link = ({ to, children, ...props }) => {
    const LinkComponent = expoRouter.Link;
    return <LinkComponent href={to} {...props}>{children}</LinkComponent>;
  };
  
  // Create useNavigate wrapper
  useNavigate = () => {
    const router = expoRouter.useRouter();
    return (path) => router.push(path);
  };
  
  // Create useLocation wrapper
  useLocation = () => {
    const pathname = expoRouter.usePathname();
    return { pathname };
  };
}

export { Link, useNavigate, useLocation };
