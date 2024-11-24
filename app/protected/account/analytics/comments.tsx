import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserAvatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface CommentData {
  comment_id: string;
  comment_text: string;
  post_title: string;
  created_at: string;
  commenter_name: string;
  avatar_url: string;
  content: string;

}

const LatestComments = () => {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      const supabase = createClient();

      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) throw new Error("User not authenticated");

        const { data, error } = await supabase.rpc("get_latest_comments", { user_id: user.id });
        if (error) throw error;
        // console.log("Fetched comments:", data);



        setComments(data || []);
      } catch (err) {
        // console.error("Error fetching comments:", err);
        toast.error("Error fetching comment data");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  return (
    <div className="latest-comments">
      <ToastContainer />
      {loading ? (
        <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      ) : comments.length > 0 ? (
        <ul className="space-y-4">
          {comments.slice(0, 3).map((comment) => (
            <li
            key={`${comment.comment_id}-${comment.created_at}`} 
              className="p-1 border-none flex items-start space-x-4">
              {/* Avatar */}
              <UserAvatar>
                <AvatarImage src={comment.avatar_url} alt={comment.commenter_name} />
              </UserAvatar>
              {/* Comment Details */}
              <div>
                <h4 className="font-bold">{comment.post_title}</h4>
                <p>{comment.content}</p>
                <small className="w-full text-gray-400 items-end">
                  {comment.commenter_name} - {new Date(comment.created_at).toLocaleString()}
                </small>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments available.</p>
      )}
    </div>
  );
};

export default LatestComments;
