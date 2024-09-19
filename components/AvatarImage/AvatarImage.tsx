import Image from 'next/image'

export default function AvatarPic({ url, size }: { url: string | null, size: number }) {
  return (
    <div className="avatar">
      {url ? (
        <Image
          src={url}
          alt="User Avatar"
          width={size}
          height={size}
          className="rounded-full"
        />
      ) : (
        <div
          style={{ width: size, height: size }}
          className="bg-gray-300 rounded-full flex items-center justify-center"
        >
          <span className="text-gray-500">No Image</span>
        </div>
      )}
    </div>
  )
}
