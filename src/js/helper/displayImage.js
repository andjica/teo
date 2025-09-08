export const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    if (path.startsWith("storage")) {
      return `http://164.92.209.125:5174//${path}`;
    }
    return `http://164.92.209.125:5174/storage/${path}`;
  };