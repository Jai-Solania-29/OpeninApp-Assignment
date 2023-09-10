const AWS = require('aws-sdk');
AWS.config.update({
  region: 'ap-south-1'
})

const s3 = new AWS.S3();

exports.handler = async () => {
  const sourceBucket = 's3-source-new';
  const destinationBucket = 's3-destination-new';
  const filesToCopy = [
    { sourceKey: 'Jai.jpeg', destinationKey: 'Jai.jpeg' },
    { sourceKey: 'cover.jpeg', destinationKey: 'cover.jpeg' },
    { sourceKey: 'shiva.jpg', destinationKey: 'shiva.jpg' }
  ];

  try {
    for (const { sourceKey, destinationKey } of filesToCopy) {
      await s3.copyObject({
        CopySource: `${sourceBucket}/${sourceKey}`,
        Bucket: destinationBucket,
        Key: destinationKey,
        ACL: 'bucket-owner-full-control'
      }).promise();

      console.log(`Successfully copied ${sourceKey} from S3 to ${destinationKey}`);
    }

  } catch (error) {
    console.error('Error: ', error);
  }
}
