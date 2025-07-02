export const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    if (path.startsWith("storage")) {
      return `http://localhost:8000/${path}`;
    }
    return `http://localhost:8000/storage/${path}`;
  };