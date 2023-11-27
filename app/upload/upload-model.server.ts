import arc from "@architect/functions";

export type Upload = {
  id: string;
  key: string;
  filename: string;
  contentType: string;
  staticUrl?: string;
};

function recordToUpload(record: any): Upload {
  return {
    id: record.id,
    key: record.key,
    filename: record.filename,
    contentType: record.contentType,
    staticUrl: record.staticUrl,
  };
}

export async function createUpload(upload: Upload): Promise<Upload> {
  const db = await arc.tables();

  const result = await db.upload.put({
    id: upload.id,
    key: upload.key,
    filename: upload.filename,
    contentType: upload.contentType,
    ...(upload.staticUrl ? { staticUrl: upload.staticUrl } : {}),
  });

  return recordToUpload(result);
}

export async function getUpload(id: string): Promise<Upload | null> {
  const db = await arc.tables();

  const result = await db.upload.get({ id });

  return result ? recordToUpload(result) : null;
}
