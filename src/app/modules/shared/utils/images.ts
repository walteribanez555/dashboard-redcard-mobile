export async function getImageBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
          const base64data = reader.result as string;
          resolve(base64data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
  });
}


export async function fetchImageAsFile(url: string, fileName: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();

  // Convert the blob to a File object
  const file = new File([blob], fileName, { type: blob.type });

  return file;
}
