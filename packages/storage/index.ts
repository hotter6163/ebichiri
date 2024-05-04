import { StorageClient } from "@supabase/storage-js";

export class Storage {
  private readonly storage: StorageClient;
  private readonly bucket = "public-bucket";

  constructor() {
    this.storage = new StorageClient("http://127.0.0.1:54321/storage/v1/s3", {
      apikey:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU",
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU`,
    });
  }

  async uploadImage(path: string, data: File | Blob) {
    const file = data instanceof File ? data : new File([data], "image.jpg");
    try {
      const fileExtension = file.name.split(".").pop();
      const filePath = `${path}/${Date.now()}.${fileExtension}`;
      const { error, data } = await this.storage
        .from(this.bucket)
        .upload(filePath, file);
      if (error) throw error;

      const {
        data: { publicUrl },
      } = this.storage.from(this.bucket).getPublicUrl(data.path);

      return {
        uri: publicUrl,
        message: "画像が正常にアップロードされました。",
      };
    } catch (error) {
      console.error("画像のアップロード中にエラーが発生しました。", error);
      return { uri: null, message: "画像のアップロードに失敗しました。" };
    }
  }
}
