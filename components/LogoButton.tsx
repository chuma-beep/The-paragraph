import ParagraphLogo from './ParagrapghLogo';

export default function LogoButton() {
  return (
    <span
      className="w-12 h-12 mt-2 flex items-center justify-center rounded-full no-underline hover:bg-btn-background-hover border"
    >
      <ParagraphLogo />
    </span>
  );
}
