import type { LoaderFunction } from "@remix-run/router";
import { json } from "@remix-run/router";
import { getUpload } from "~/upload/upload-model.server";
import invariant from "tiny-invariant";
import { notFound } from "@hapi/boom";

export const loader: LoaderFunction = async ({ params }) => {
  const { uploadId } = params;
  invariant(uploadId);

  const upload = await getUpload(uploadId);

  return upload ? json(upload) : notFound("Not found");
};
