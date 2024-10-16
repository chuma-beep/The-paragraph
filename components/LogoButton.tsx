import ParagraphLogo from './ParagrapghLogo';

export default function LogoButton() {
  return (
    <>
        
        <div className="w-full max-w-md mr-2 ml-0">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-200 cursor-pointer hover:border-blue-400">
            <ParagraphLogo />
          </span>
        </div>
        <h1 className="text-xs sm:text-lg font-semibold text-blue-400 text-center">The Paragraph</h1>
              </div>
    </div>
      
      </>
  );
}
