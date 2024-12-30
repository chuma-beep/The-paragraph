import Image from 'next/image';

export default function AnalyticsVideo() {
  return (
    <div className="">
      {/* <Image
        src="/thumbnail.jpg"
        alt="Video Placeholder"
        layout="fill"
        objectFit="cover"
        quality={80}
        priority
      /> */}
      <video
        autoPlay
        loop
        muted
        playsInline
        // className='h-auto object-cover rounded-lg shadow-slate-600 shadow-lg min-w-[50vw] min-h-[30vw] max-w-[500px] max-h-[500px]'
        className='h-auto object-cover rounded-lg shadow-slate-600 shadow-lg'

      >
        <source src="/Analyticsrecord1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
