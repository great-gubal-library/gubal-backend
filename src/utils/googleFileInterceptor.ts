import * as Storage from '@google-cloud/storage';
import { BadRequestException } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Request } from 'express';
import * as fs from 'fs';
import { storageEngine as googleStorageEngine } from 'multer-google-storage';

const buckets = {
  private: process.env.GOOGLE_STORAGE_PRIVATE_BUCKET,
  public: process.env.GOOGLE_STORAGE_PUBLIC_BUCKET,
};

const getFilename = (name: string) => {
  const normalizedName = name
    .replace('Ö', 'O')
    .replace('o', 'o')
    .replace('Ä', 'A')
    .replace('ä', 'a')
    .replace(/[^a-zA-Z0-9_.-]/, '-');

  return `${Date.now()}_${normalizedName}`;
}

const getIdFilename = () => {
  const filename = 'bucket-key.json';
  if (!fs.existsSync(filename))
    fs.writeFileSync(filename, process.env.GOOGLE_STORAGE_BUCKET_KEY);
  return filename;
}

export const imageContentTypes = [
  'image/jpeg',
  'image/gif',
  'image/png'
]

const defaultMaxContentLength = 8;

const megabytes = (mb: number) => mb * 1000000;

export interface FileInterceptorOptionalOptions {
  maxContentLengthInMB?: number;
  allowedContentTypes?: string[];
}

const fileInterceptorOptions = (
  bucket: string,
  {
    maxContentLengthInMB = defaultMaxContentLength,
    allowedContentTypes
  }: FileInterceptorOptionalOptions
): MulterOptions => ({
  fileFilter(req: Request, file, callback) {
    const fileSize = parseInt(req.headers['content-length'], 10);
    if (fileSize > megabytes(maxContentLengthInMB))
      callback(new BadRequestException('File too large'), false);
    else if (allowedContentTypes !== undefined && !allowedContentTypes.includes(file.mimetype))
      callback(new BadRequestException('Invalid content type'), false);
    else
      callback(null, true)
  },
  storage: googleStorageEngine({
    projectId: process.env.GOOGLE_STORAGE_PROJECT_ID,
    keyFilename: getIdFilename(),
    bucket,
    filename: (req, file, cb) => {
      cb(null, getFilename(file.originalname));
    },
  }),
})

const GoogleFileInterceptor =
  (bucket: string) =>
    (fieldname: string, options: FileInterceptorOptionalOptions) =>
      FileInterceptor(fieldname, fileInterceptorOptions(bucket, options));

const GoogleFilesInterceptor =
  (bucket: string) =>
    (fieldname: string, maxCount: number, options: FileInterceptorOptionalOptions) =>
      FilesInterceptor(fieldname, maxCount, fileInterceptorOptions(bucket, options));

const GoogleDeleteObjectByFilename = (bucket: string) => (filename: string) =>
  new Promise((resolve, reject) => {
    try {
      const storage = googleStorageEngine({
        projectId: process.env.GOOGLE_STORAGE_PROJECT_ID,
        keyFilename: getIdFilename(),
        bucket,
      });

      storage._removeFile(null, { filename }, () => null);
      resolve();
    } catch (error) {
      reject(error);
    }
  });

export const GooglePublicFileInterceptor = GoogleFileInterceptor(buckets.public);
export const GooglePublicFilesInterceptor = GoogleFilesInterceptor(buckets.public);
export const GoogleDeletePublicObjectByFilename = GoogleDeleteObjectByFilename(buckets.public);

export const GooglePrivateFileInterceptor = GoogleFileInterceptor(buckets.private);
export const GooglePrivateFilesInterceptor = GoogleFilesInterceptor(buckets.private);
export const GoogleDeletePrivateObjectByFilename = GoogleDeleteObjectByFilename(buckets.private);

export const GoogleReadPrivateFile =
  async (filename: string): Promise<{ stream: fs.ReadStream, contentType: string }> => {
    const storage = new Storage({
      projectId: process.env.GOOGLE_STORAGE_PROJECT_ID,
      keyFilename: getIdFilename()
    });

    const bucket = storage.bucket(buckets.private);
    const file = bucket.file(filename);
    const metadata = await file.getMetadata();
    return {
      stream: file.createReadStream(),
      contentType: metadata[0].contentType,
    };
  }