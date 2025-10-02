export async function uploadToCloudinary(file) {


  const nombreCloud = "djaqmhimp"; // tu cloud name



  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "Koa_Macrame"); // tu preset
  data.append("cloud_name", nombreCloud);   // tu cloud name
  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${nombreCloud}/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );
    const result = await res.json();
    return result; // aquí viene secure_url, public_id, etc.
  } catch (error) {
    console.error("Error al subir a Cloudinary:", error);
    throw error;
  }
}