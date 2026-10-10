
import { useEffect, useState } from "react";
import axios from "axios";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/posts"
        );

        console.log("Fetched posts:", response.data);

        setPosts(response.data.posts || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(
          err.response?.data?.message ||
          "Failed to fetch posts. Please check your backend."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <h2>Loading posts...</h2>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="feed-container">
      <h1>My Feed</h1>

      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
          <div className="post-card" key={post._id}>
            <p className="post-id">
              Post ID: {post._id}
            </p>

            <img
              src={post.image}
              alt={post.caption || "Post image"}
              className="post-image"
            />

            <p className="post-caption">
              {post.caption}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default Feed;
