import { useState } from "react";
import axios from "axios";

function CreatePost() {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !caption.trim()) {
      setMessage("Please select an image and enter a caption.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("image", image);
      formData.append("caption", caption);

      const response = await axios.post(
        "http://localhost:3000/create-post",
        formData
      );

      setMessage(
        response.data.message || "Post created successfully!"
      );

      setImage(null);
      setCaption("");
      e.target.reset();
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);

      setMessage(
        error.response?.data?.message ||
          "Failed to create post."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post">
      <h1>Create Post</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="image">Select Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0] || null)}
            required
          />
        </div>

        <div>
          <label htmlFor="caption">Caption</label>
          <input
            type="text"
            id="caption"
            name="caption"
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Submit Post"}
        </button>

        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default CreatePost;