import type { ActionArgs } from "@remix-run/server-runtime";
import {
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/server-runtime";
import type { LoaderFunction } from "@remix-run/router";
import { json } from "@remix-run/router";
import { saveFile } from "~/upload/s3-file-manager.server";
import { createUpload } from "~/upload/upload-model.server";

export const action = async ({ request }: ActionArgs) => {
  const uploadHandler = unstable_composeUploadHandlers(
    // our custom upload handler
    async ({ name, contentType, data, filename }) => {
      if (name !== "file") {
        return undefined;
      }
      const parts = filename ? filename.split(".") : [];
      const extension = parts.length > 1 ? parts.pop() : undefined;

      let fileData = new Uint8Array(0);
      for await (const part of data) {
        const mergedFileData = new Uint8Array(fileData.length + part.length);
        mergedFileData.set(fileData, 0);
        mergedFileData.set(part, fileData.length);
        fileData = mergedFileData;
      }
      const { id, key, staticUrl } = await saveFile(fileData, extension);
      const upload = await createUpload({
        id,
        key,
        filename: filename ?? id,
        contentType,
        staticUrl,
      });

      return upload.id;
    },
    // fallback to memory for everything else
    unstable_createMemoryUploadHandler(),
  );

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler,
  );

  const uploadId = formData.get("file");

  return json({ uploadId });
};

export const loader: LoaderFunction = () => {
  throw new Response("Method not supported", { status: 405 });
};
