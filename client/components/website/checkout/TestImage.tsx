import appConfig from '@/appConfig'
import Image from 'next/image'

export default function TestImage({ image }: { image: string }) {
  
  return (
    <Image
      src={
        image
          ? `${appConfig.apiUrl}/uploads/${image}`
          : "/pos_software.png"
      }
      width={100}
      height={100}
      // src="/pos_software.png"
      alt="Product"
      className="w-24 h-24 object-cover"
    />
  )
}
