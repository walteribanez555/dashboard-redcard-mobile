import { Injectable } from '@angular/core';

import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  paginateListObjectsV2,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { environment } from '../../../../environments/environment';
import { from, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class S3Service {
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

    console.log("Instanciado correctamente");

  }

  createItem(file: File, fileName: string): Observable<string> {
    if (!this.s3Client) {
      return of();
    }

    const command = new PutObjectCommand({
      Bucket: this.bucketS3,
      Key: fileName,
      Body: file,
      // ACL : 'public-read',
    });

    return from(this.s3Client!.send(command)).pipe(
      map(() => `https://${this.bucketS3}.s3.amazonaws.com/${fileName}`)
    );
  }

  putObject(bucket: string, key: string, body: any) {
    if(!this.s3Client) {
      return of(null);
    }

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
    });


    return from(this.s3Client!.send(command)).pipe(
      map(() => `https://${this.bucketS3}.s3.amazonaws.com/${key}`)
    );

  }

  deleteObject( key: string) {
    if(!this.s3Client) {
      return of(null);
    }

    const command = new DeleteObjectCommand({
      Bucket: this.bucketS3,
      Key: key,
    });

    return from(this.s3Client!.send(command)).pipe(
      map(() => `https://${this.bucketS3}.s3.amazonaws.com/${key}`)
    );
  }

  getObject( key: string) {
    if(!this.s3Client) {
      return;
    }

    const command = new GetObjectCommand({
      Bucket: this.bucketS3,
      Key: key,

    });

    return this.s3Client!.send(command);
  }









}
