import React from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from 'react-share';
import { Copy, Check } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({
  url,
  title,
  description,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareProps = {
    url,
    title,
    ...(description && { summary: description }),
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <FacebookShareButton {...shareProps}>
        <div className="flex items-center gap-2 px-3 md:px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors duration-300">
          <FacebookIcon size={24} round />
          <span className="hidden md:inline text-sm text-slate-300">Facebook</span>
        </div>
      </FacebookShareButton>

      <TwitterShareButton {...shareProps}>
        <div className="flex items-center gap-2 px-3 md:px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors duration-300">
          <TwitterIcon size={24} round />
          <span className="hidden md:inline text-sm text-slate-300">Twitter</span>
        </div>
      </TwitterShareButton>

      <LinkedinShareButton {...shareProps}>
        <div className="flex items-center gap-2 px-3 md:px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors duration-300">
          <LinkedinIcon size={24} round />
          <span className="hidden md:inline text-sm text-slate-300">LinkedIn</span>
        </div>
      </LinkedinShareButton>

      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-3 md:px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors duration-300"
      >
        {copied ? (
          <>
            <Check className="w-5 h-5 text-green-400" />
            <span className="hidden md:inline text-sm text-green-400">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-5 h-5 text-slate-300" />
            <span className="hidden md:inline text-sm text-slate-300">Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
};

