import React, { useEffect, useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '../../../components/ui/Button';

const PostShareModal = ({ isOpen, onClose, post, event }) => {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (isOpen && post && event) {
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/user/events/${event.id}?postId=${post.id}`;
      setShareUrl(url);
      setCopied(false);
    }
  }, [isOpen, post, event]);

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        textArea.style.opacity = '0';
        textArea.style.pointerEvents = 'none';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (!successful) {
          throw new Error('Copy command failed');
        }
      }

      setCopied(true);
      toast.success('Post link copied to clipboard!', {
        position: 'top-right',
        autoClose: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      const userConfirmed = window.confirm(`Copy this link manually:\n\n${shareUrl}\n\nClick OK to continue.`);
      if (userConfirmed) {
        toast.info('Please copy the link manually from the text field above.', { autoClose: 4000 });
      } else {
        toast.error('Failed to copy link. Please try again or copy manually.', { autoClose: 3000 });
      }
    }
  };

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.title || 'Event Post',
          text: (post?.content || '').slice(0, 140),
          url: shareUrl,
        });
      } catch (err) {
        if (err?.name !== 'AbortError') {
          console.error('Error sharing:', err);
          toast.error('Failed to share. Please try copying the link instead.');
        }
      }
    } else {
      handleCopyLink();
    }
  };

  if (!isOpen || !post || !event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Share2 className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Share Post</h2>
          </div>
          <Button onClick={onClose} variant="ghost" size="sm" className="p-2">
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </Button>
        </div>

        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{event.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 line-clamp-3">{post.content}</p>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Shareable Link</label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Click the input field to select all text, or use the copy button</p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  onClick={(e) => e.target.select()}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer select-all"
                />
                <Button onClick={handleCopyLink} variant={copied ? 'success' : 'primary'} size="md" icon={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} className="whitespace-nowrap">
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>

            {navigator.share && (
              <Button onClick={handleShareNative} variant="secondary" size="lg" icon={<Share2 className="h-5 w-5" />} className="w-full">
                Share via Device
              </Button>
            )}

            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Or share on:</p>
              <div className="flex space-x-2">
                <Button asChild variant="primary" size="sm" className="flex-1">
                  <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent((post.content || '').slice(0, 100))}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer">Twitter</a>
                </Button>
                <Button asChild variant="primary" size="sm" className="flex-1">
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer">Facebook</a>
                </Button>
                <Button asChild variant="primary" size="sm" className="flex-1">
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PostShareModal;
