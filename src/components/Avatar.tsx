import { avatarUrl, initials } from '../lib/profile'

export default function Avatar({ name, path, size = 36 }: { name: string; path?: string | null; size?: number }) {
  const url = avatarUrl(path)
  return url
    ? <img className="avatar" src={url} alt="" width={size} height={size} style={{ width: size, height: size }} />
    : <span className="avatar initials" style={{ width: size, height: size, fontSize: size * 0.4 }} aria-hidden="true">{initials(name)}</span>
}
