'use client';

import Likes from "../components/LikeButton";
import { useOptimistic } from "react";

export default function Posts({ posts }: { posts: PostWithAuthor[] }) {
        const [optimisticPosts, addOptimisticPosts] = useOptimistic<
         PostWithAuthor[],
         PostWithAuthor
        >(posts, (currentOptimisticPosts, newPost) => {
                const newOptimisticPosts = [...currentOptimisticPosts];
                const index = newOptimisticPosts.findIndex(
                    (post)  => post.id === newPost.id
                    );

                    newOptimisticPosts[index] = newPost;
                    return newOptimisticPosts;
            });
        
        return optimisticPosts.map((post) => (
        <div key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <Likes post={post} addOptimisticPost={addOptimisticPosts}/>

</div>                          
    ))
};



