import Link from 'next/link'

export default function AuthButtons() {
  return (
    <div className="flex items-center space-x-reverse space-x-2">
      <Link
        href="/login"
        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-all duration-200 flex items-center space-x-reverse space-x-2"
      >
        <span>ورود</span>
      </Link>
      <Link
        href="/register"
        className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm transition-all duration-200 flex items-center space-x-reverse space-x-2"
      >
        <span>ثبت‌نام</span>
      </Link>
    </div>
  )
}
