import ParagraphLogo from './ParagrapghLogo';

export default function LogoButton() {
  return (
    <>
    {/* <div className='w-full flex flex-row justify-center'>

    <span
      className="w-12 h-12 mt-2 flex items-center justify-center rounded-full no-underline hover:bg-btn-background-hover border"
      >
      <ParagraphLogo />
    </span>
      <h3>The Paragraph</h3>
        </div> */}
        
        <div className="w-full max-w-md mx-auto ">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-200 cursor-pointer hover:border-blue-400">
            <ParagraphLogo />
          </span>
        </div>
        <h1 className="text-sm  sm:text-lg font-semibold text-blue-400 text-center sm:text-left">The Paragraph</h1>
              </div>
    </div>
      
      </>
  );
}
