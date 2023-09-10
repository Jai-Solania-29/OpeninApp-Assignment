# OpeninApp-Assignment

## Transferring Files Across AWS S3 Buckets in Different AWS Accounts Using Scripting

In this project, we are going to transfer files across two Amazon S3 (Simple Storage Service) buckets present in different AWS accounts.

## Steps to follow:

1- Create a **Simple Storage Service(S3) bucket** in the **Source Account**.  
2- Add files in the **Source S3 bucket**.  
3- Create a **Simple Storage Service (S3)** bucket in the **Destination Account**.  
4- Create an **IAM role (Identity and Access Management)** in the **Source Account**.  
5- Attach the required **policy** to the **IAM role**.  
6- Attach the required **policy** to the **Destination bucket**.  
7- Create a **Lambda Function** in the **Source Account**.
8- Edit the **source code** of the **Lambda function**. (**Scripting**)  
9- **Deploy** and **Test** the **Script** written in the **Lambda function**.  
10- File Transfer Successful.

Let's see the implementation of these steps in detail.

Note: Use different browsers for Source and Destination Accounts.

## Create a Simple Storage Service bucket (S3) in the **Source Account**.

- Go to AWS Management Console in the source account.
- Search for S3 and open it.
- Click on the Create bucket button.
- Give your bucket a name, fill in other input fields, and click the Create bucket button at the bottom of the page.
<img width="1435" alt="Screenshot 2023-09-10 at 1 07 21 PM" src="https://github.com/Jai-Solania-29/OpeninApp-Assignment/assets/90816300/bf11c70d-11fd-4602-b0da-def594f8453c">

### Congratulations you have successfully created a S3 bucket in the source account 🎉

##  Add files in the Source S3 bucket

- Open the newly created bucket and click on the Upload button.
- Add files from your device.
- Click on the Upload button at the bottom of the page.
<img width="1070" alt="Screenshot 2023-09-10 at 1 13 26 PM" src="https://github.com/Jai-Solania-29/OpeninApp-Assignment/assets/90816300/c42ddd90-5d3b-4e67-943e-35032817385c">

### Congratulations You have successfully added files in the source bucket 🎉

## Create a Simple Storage Service (S3) bucket in the Destination Account

- Go to AWS Management Console in the destination account.
- Now follow the same steps that you followed while creating a S3 bucket in the source account.

![Screenshot 2023-09-10 at 1 18 08 PM](https://github.com/Jai-Solania-29/OpeninApp-Assignment/assets/90816300/3d1b8eea-01e6-476a-b83e-618c8a64dae6)

### Congratulations You have successfully created a S3 bucket in the destination account 🎉

## Create an IAM role (Identity and Access Management) in the Source Account

- Go to the AWS Management Console in the source account.
- Search for IAM and open it.
- In the IAM Dashboard go to Roles.
- Click on Create role.
- Select AWS service as the Trusted entity type, Lambda as the Use case from the drop-down, and then click Next.
- Don't select any permission for now.
- Give your role a Name and a description, and then click on the Create role button.
<img width="1426" alt="Screenshot 2023-09-10 at 1 48 03 PM" src="https://github.com/Jai-Solania-29/OpeninApp-Assignment/assets/90816300/49c1c570-8e4e-4498-aeda-125e62107c4d">

### Congratulations You have successfully created an IAM role in the Source Account 🎉

## Attach the required policy to the IAM role

- Click on the newly created IAM role.
- Go to the Permissions policies section and click on Add permissions > Create inline policy.
- Select JSON as the format, add the given code in the Policy Editor, and click Next.
- Give your policy a name and click on the Create policy button.

```
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Action": [
				"s3:GetObject",
				"s3:PutObject",
				"s3:PutObjectAcl"
			],
			"Resource": [
				"arn:aws:s3:::s3-destination-new/*",
				"arn:aws:s3:::s3-source-new/*"
			]
		}
	]
}
```
- Also please replace `arn:aws:s3:::s3-destination-new` and `arn:aws:s3:::s3-source-new` with the actual ARN of your Source and Destination S3 bucket.

### Congratulations You have successfully attached the policy to the IAM role 🎉

## Attach the required policy to the Destination bucket

- Click on the newly created S3 bucket and go to the permissions tab.
- Scroll down and click on the **Edit button** in the **Bucket policy section**.
- Add the given policy and click on Save changes.

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::514539915435:role/S3TransferRole"
            },
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:PutObjectAcl"
            ],
            "Resource": "arn:aws:s3:::s3-destination-new/*"
        }
    ]
}
```
- Also please replace `arn:aws:iam::514539915435:role/S3TransferRole` with the actual ARN of your IAM role, and `arn:aws:s3:::s3-destination-new` with the actual ARN of your destination bucket.

### Congratulations You have successfully attached the policy to the Destination bucket 🎉

## Create a Lambda Function in the Source Account

- Go to the AWS Management Console of the Source Account.
- Search for Lambda and open it.
- Click on the Create function.
- Now select Author from scratch.
- Give your Function a name.
- Select the Runtime as Node.js 14x
- Architecture as x86_64
- Click on Change default execution role > Use an existing role.
- Now select the recently created IAM role from the dropdown.
- Click on the Create function.
<img width="1259" alt="Screenshot 2023-09-10 at 2 16 02 PM" src="https://github.com/Jai-Solania-29/OpeninApp-Assignment/assets/90816300/3b1c0715-2a95-45a0-bb38-ca88263dcc39">

### Congratulations You have successfully created a Lambda Function in the Source Account 🎉

## Edit the source code of the Lambda function. (Scripting)

- Click on the newly created Lambda function and go to the Code tab.
- Now add the given code in the index.js file tab.

```
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
```
- Also please replace `ap-south-1` with the region that you are using.
- Replace `s3-source-new` and `s3-destination-new` with the name of your Source and Destination bucket.
- Replace the value of sourceKey and destinationKey with the name of the files you have added in the Source bucket for Transfer.

### Congratulations You have successfully added the required source code in the Lambda function 🎉

## Deploy and Test the Script written in the Lambda function

- In the previous step we added a script in the Lambda function, Now we need to test it.
- First, click on Deploy and then click on Test.
- A Pop-up window will open.
- Select Create new event as Test event action.
- Give your event a name.
- Keep the Event sharing settings Private.
- Click on the Save button at the bottom of the page.
- Now go to the Test tab present on the right side of the Code tab.
- Click on Test.
- Now go to the Destination bucket and hit refresh.
- You will see the newly added files there.
![Screenshot 2023-09-10 at 2 37 58 PM](https://github.com/Jai-Solania-29/OpeninApp-Assignment/assets/90816300/12a3fb25-c09f-4054-a6f8-33afdeef9600)

## Congratulations You have successfully Transfered the Files Across AWS S3 Buckets in Different AWS Accounts Using Scripting 🎉

