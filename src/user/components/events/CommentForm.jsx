import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Textarea from '../../../components/ui/Textarea';

const CommentForm = ({ 
  eventId, 
  parentCommentId = null, 
  onAddComment, 
  loading = false, 
  error = null,
  placeholder = "Write a comment...",
  onCancel = null,
  initialValue = ""
}) => {
  const [content, setContent] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onAddComment(eventId, content.trim(), parentCommentId);
      setContent('');
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContent('');
    if (onCancel) {
      onCancel();
    }
  };

  const isSubmitDisabled = !content.trim() || loading || isSubmitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="min-h-[80px] resize-none pr-12"
          disabled={loading || isSubmitting}
        />
        <div className="absolute bottom-2 right-2 flex items-center gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={loading || isSubmitting}
              className="h-8 px-2"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitDisabled}
            className="h-8 px-2"
          >
            {loading || isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
    </form>
  );
};

export default CommentForm;



















