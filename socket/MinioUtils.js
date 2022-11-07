const {minioConfig} = require('./MinioConfig');
const createBucket =  async (bucketName) => {
    console.log(`Creating Bucket: ${bucketName} and ${bucketName}`);
    const bucketsList = await minioConfig.listBuckets();
    minioConfig.bucketExists(bucketName, function(err, exists) {
        if (!exists) {
            minioConfig.makeBucket(bucketName, 'ap-southeast-1', (err) => {
                if (err) {
                    console.log('minio error '+err);
                }
            });
        }
        if (err) {
            if (err.code == 'NoSuchBucket') {
                minioConfig.makeBucket(bucketName, 'ap-southeast-1', function(err2) {
                    if (err2) {
                        console.log("error on creating bucket", err2);
                    }
                });
            }
        }
    });
    console.log(`Listing all buckets...`);
    console.log(
        `Buckets List: ${bucketsList.map((bucket) => bucket.name).join(",\t")}`
    );
}
const minioUtils = {
    //upload img
    uploadImg: async (file,fileName,bucketName)=> {
        await createBucket(bucketName);
        let metaData = {
            'Content-Type': 'application/octet-stream'
        }
        // Using fPutObject API upload your file to the bucket photos.
        minioConfig.fPutObject(bucketName, fileName, file, metaData, function (err, etag) {
            if (err) return console.log(err)
            console.log('File uploaded successfully.')
        });
        const url = await minioConfig.presignedGetObject(bucketName, fileName);
        console.log("Get url successfully: ", url);
        return url;
    },
    //upload file
    uploadFile: async (file,bucketName,fileName) => {
        await createBucket(bucketName);
        const submitFileDataResult = await minioConfig
            .putObject(bucketName, fileName, file)
            .catch((e) => {
                console.log("Error while creating object from file data: ", e);
                throw e;
            });

        console.log("File data submitted successfully: ", submitFileDataResult);
        // thực hiện lấy url sau khi upload file
        const url = await minioConfig.presignedGetObject(bucketName, fileName);
        console.log("Get url successfully: ", url);
        return url;
    },
    getFileUrl: async (bucketName,fileName)=>{
        // thực hiện lấy url sau khi upload file
        let url = await minioConfig.presignedGetObject(bucketName, fileName, 60 * 60 * 24);
        console.log(url);
        return url;
    },
    deleteFile: async (bucketName,fileName)=>{
        try{
            await minioConfig.removeObject(bucketName,fileName);
        }catch (err){
            console.log(err);
        }

    }
}
module.exports = minioUtils;
