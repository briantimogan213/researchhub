import { pathname } from '../imports';
export default function linkTo(path: string, query?: string) {
  const url = new URL(pathname(path), window.location.origin);
  if (query) {
    url.search = (new URLSearchParams(query)).toString()
  }
  window.location.href = url.toString();
}