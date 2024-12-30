import Image from 'next/image';

export default function AnalyticsVideo() {
  return (
    <div className="">
      <video
        autoPlay
        loop
        muted
        playsInline
        className='h-auto object-cover rounded-lg shadow-slate-600 shadow-lg'
      >
        <source src="/writevideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
