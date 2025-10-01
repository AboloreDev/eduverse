// t3-storage-test.ts - Test your T3 Storage credentials
import {
  S3Client,
  ListBucketsCommand,
  HeadBucketCommand,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const testT3StorageCredentials = async () => {
  console.log("Testing T3 Storage credentials...\n");

  const s3Client = new S3Client({
    region: "auto",
    endpoint: "https://t3.storage.dev",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: false,
  });

  console.log("Configuration:");
  console.log("Endpoint: https://t3.storage.dev");
  console.log("Bucket Name:", process.env.AWS_BUCKET_NAME);
  console.log(
    "Access Key ID:",
    process.env.AWS_ACCESS_KEY_ID
      ? "Set (length: " + process.env.AWS_ACCESS_KEY_ID.length + ")"
      : "Not set"
  );
  console.log(
    "Secret Key:",
    process.env.AWS_SECRET_ACCESS_KEY
      ? "Set (length: " + process.env.AWS_SECRET_ACCESS_KEY.length + ")"
      : "Not set"
  );
  console.log("");

  try {
    // Test 1: List buckets to verify credentials
    console.log("1. Testing credentials by listing buckets...");
    const listResult = await s3Client.send(new ListBucketsCommand({}));
    console.log("✅ Credentials are valid");

    const bucketNames = listResult.Buckets?.map((b) => b.Name) || [];
    console.log("Available buckets:", bucketNames);

    // Check if target bucket exists
    const targetBucket = process.env.AWS_BUCKET_NAME;
    const bucketExists = bucketNames.includes(targetBucket);
    console.log(
      `Target bucket "${targetBucket}" exists: ${bucketExists ? "✅" : "❌"}`
    );

    if (!bucketExists) {
      console.log("\n❌ PROBLEM: Your bucket does not exist!");
      console.log("Solutions:");
      console.log("1. Create the bucket in your T3 Storage dashboard");
      console.log(
        "2. Or update BUCKET_NAME in .env to match an existing bucket"
      );
      return;
    }

    // Test 2: Check bucket access
    console.log("\n2. Testing bucket access...");
    await s3Client.send(
      new HeadBucketCommand({
        Bucket: targetBucket!,
      })
    );
    console.log("✅ Bucket access confirmed");

    console.log(
      "\n🎉 All tests passed! Your T3 Storage configuration should work."
    );
    console.log("\nIf you still get 403 errors, the issue might be:");
    console.log("- Bucket policy restrictions (check T3 Storage dashboard)");
    console.log("- API key permissions (try regenerating your API keys)");
  } catch (error: any) {
    console.error("\n❌ Test failed:", error.message);
    console.log("Error name:", error.name);

    if (error.name === "InvalidAccessKeyId") {
      console.log("\n🔧 FIX: Your AWS_ACCESS_KEY_ID is incorrect");
      console.log(
        "- Check your T3 Storage dashboard for the correct access key"
      );
      console.log("- Make sure there are no extra spaces or characters");
    } else if (error.name === "SignatureDoesNotMatch") {
      console.log("\n🔧 FIX: Your AWS_SECRET_ACCESS_KEY is incorrect");
      console.log(
        "- Check your T3 Storage dashboard for the correct secret key"
      );
      console.log("- Make sure there are no extra spaces or characters");
    } else if (error.name === "AccessDenied") {
      console.log("\n🔧 POTENTIAL FIXES:");
      console.log("- Your API key might not have the right permissions");
      console.log("- Try regenerating your API keys in T3 Storage dashboard");
      console.log("- Check bucket policies and permissions");
    } else if (error.name === "NoSuchBucket") {
      console.log("\n🔧 FIX: Create the bucket in your T3 Storage dashboard");
    } else {
      console.log("\n🔧 Check your T3 Storage dashboard and verify:");
      console.log("- Your account is active");
      console.log("- API keys are valid and not expired");
      console.log("- Billing is up to date");
    }
  }
};

testT3StorageCredentials();

// Run with: npx ts-node t3-storage-test.ts
