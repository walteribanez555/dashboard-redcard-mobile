import { Injectable } from '@angular/core';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { environment } from '../../../environments/environment';
import { firstValueFrom, from, map, of } from 'rxjs';
import { UploadFileDto } from '../../domain/dtos/files/upload-file.dto';
import { FileRepository } from '../../domain/repositories/file.repository';

@Injectable({
  providedIn: 'root',
})
export class ApiFilesS3Service implements FileRepository {
  s3Client: S3Client | null = null;

  accessKeyId = environment.s3_key;
  secretAccessKey = environment.s3_secret;
  bucketS3 = environment.s3_bucket;

  constructor() {
    this.s3Client = new S3Client({
      region: 'us-east-1',
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
    });

    console.log('Instanciado correctamente');
  }

  private generateFileKey(
    file: File,
    filename: string,
    timestamp: number,
    pos : number
  ): string {


    return `${timestamp}${pos}`;
  }

  public static getFileKeyFromString(url: string) {
    const array = url.split('/');
    return array[array.length - 1];
  }

  private async uploadFile(file: File, keyname: string ,pos : number) {
    const timestamp = Date.now();
    const fileKey = this.generateFileKey(file, keyname, timestamp, pos);

    if (!this.s3Client) {
      throw 'S3 Client not initialized';
    }

    const command = new PutObjectCommand({
      Bucket: this.bucketS3,
      Key: fileKey,
      Body: file,
      // ACL : 'public-read',
    });

    return firstValueFrom(
      from(this.s3Client!.send(command)).pipe(
        map(() => `https://${this.bucketS3}.s3.amazonaws.com/${fileKey}`)
      )
    );
  }

  async upload(files: UploadFileDto[]): Promise<UploadFileDto[]> {
    try {
      console.log({files});

      const filesUploaded: UploadFileDto[] = await Promise.all(
        files.map(async (file, index) => {
          const url = await this.uploadFile(file.file, file.filename,index);
          const fileUploaded: UploadFileDto = {
            file: file.file,
            filename: url,
          };
          return fileUploaded;
        })
      );

      return filesUploaded.length > 0 ? filesUploaded : [];
    } catch (error) {
      throw new Error('Error uploading files');
    }
  }

  async delete(key: string): Promise<string> {
    if (!this.s3Client) {
      throw 'S3 Client not initialized';
    }

    const command = new DeleteObjectCommand({
      Bucket: this.bucketS3,
      Key: key,
    });

    return firstValueFrom(
      from(this.s3Client!.send(command)).pipe(
        map(() => {
          console.log("File Deleted");
          return 'File deleted';
        })
      )
    );
  }
}
