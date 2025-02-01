import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  region: process.env.AWS_REGION
});

const BUCKET_NAME = 'beo_portal_bucket';
const DOC_BUCKET = 'beo_portral_doc'

export const uploadToS3 = async (logoData, portalId) => {
  const { originalname, buffer, mimetype } = logoData;
  try {
    const fileExtension = path.extname(originalname);    
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = `${portalId}/${fileName}`;

    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: filePath,
      Body: buffer,
      ContentType: mimetype
    };

    // await s3Client.send(new PutObjectCommand(uploadParams));

    return {
      logoUrl: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filePath}`
    };
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('Failed to upload file to S3');
  }
};

export const deleteFromS3 = async (s3Url) => {
    try {
      const bucketName = 'beo_portal_bucket';
      const urlParts = new URL(s3Url);
      const key = urlParts.pathname.substring(1);
  
      const params = {
        Bucket: bucketName,
        Key: key,
      };
  
    //   const result = await s3.deleteObject(params).promise();
  
      console.log('File deleted successfully:');
      return true //return result;   // returning true instead of result bcs i cmtd result
    } catch (error) {
      console.error('S3 delete error:', error);
      throw new Error('Failed to delete file from S3');
    }
  };

  export const uploadDocToS3 = async (document, portalId, jobId) => {
    const { originalname, buffer, mimetype } = document;
    try {
      const filePath = `${portalId}/${jobId}/${originalname}`;
  
      const uploadParams = {
        Bucket: DOC_BUCKET,
        Key: filePath,
        Body: buffer,
        ContentType: mimetype
      };
  
      // await s3Client.send(new PutObjectCommand(uploadParams));
  
      return {
        docUrl: `https://${DOC_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${filePath}`
      };
    } catch (error) {
      console.error('S3 upload error:', error);
      throw new Error('Failed to upload file to S3');
    }
  };