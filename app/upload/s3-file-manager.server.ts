import type { PutObjectCommandInput } from "@aws-sdk/client-s3";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { v4 } from "uuid";
import type { Upload } from "~/upload/upload-model.server";

export type SpacesAcl = "public-read" | "private";

const s3Client = new S3Client({
  endpoint: "https://fra1.digitaloceanspaces.com",
  region: "us-east-1", // ignored by DO
  credentials: {
    accessKeyId: process.env.SPACES_KEY ?? "",
    secretAccessKey: process.env.SPACES_SECRET ?? "",
  },
});

export async function saveFile(
  contents: PutObjectCommandInput["Body"],
  extension: string | undefined,
  acl: SpacesAcl = "private"
): Promise<Pick<Upload, "id" | "key" | "staticUrl">> {
  const id = v4();
  const key = `${process.env.SPACES_FOLDER ?? "image-upload"}/${id}${
    extension ? `.${extension}` : ""
  }`;
  const bucketParams: PutObjectCommandInput = {
    Bucket: process.env.SPACES_BUCKET ?? "default",
    Key: key,
    Body: contents,
    ACL: acl,
  };

  await s3Client.send(new PutObjectCommand(bucketParams));
  const staticUrl =
    acl === "public-read"
      ? `${process.env.SPACES_ROOT}/${bucketParams.Key}`
      : undefined;

  return {
    id,
    key,
    staticUrl,
  };
}

export async function getFile(key: string) {
  const response = await s3Client.send(
    new GetObjectCommand({
      Bucket: process.env.SPACES_BUCKET ?? "default",
      Key: key,
    })
  );

  return response.Body;
}
