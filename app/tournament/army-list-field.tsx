import type { AdditionalField } from "~/tournament/additional-fields";
import { FileUpload } from "~/form/fileUpload";
import React, { useEffect, useState } from "react";
import type { Upload } from "~/upload/upload-model.server";
import { FiFileText, FiAlertCircle, FiDownload } from "react-icons/fi";

interface ArmyListFileUploadProps {
  name: string;
  uploadId: string;
  downloadUrl: string;
}

const ArmyListFileUpload = ({
  name,
  uploadId,
  downloadUrl,
}: ArmyListFileUploadProps) => {
  return (
    <FileUpload
      name={name}
      uploadId={uploadId}
      uploadUrl="/upload"
      downloadUrl={downloadUrl}
    />
  );
};

interface ArmyListProps {
  uploadId: string;
  eventSlug: string;
  attendeeSlug: string;
}

export const ArmyList = ({
  uploadId,
  eventSlug,
  attendeeSlug,
}: ArmyListProps) => {
  const [filename, setFilename] = useState<string | null>(null);
  useEffect(() => {
    if (!uploadId) {
      setFilename(null);
    } else {
      fetch(`/upload/${uploadId}`, { method: "GET" })
        .then((res) => res.json())
        .then((json: Upload) => setFilename(json.filename));
    }
  }, [uploadId]);

  return (
    <div className="uploaded-file">
      {uploadId ? <FiFileText size={"3em"} /> : <FiAlertCircle size={"3em"} />}
      <span className="file-name">{filename ?? "Loading..."}</span>
      <a
        href={`/event/${eventSlug}/profile/${attendeeSlug}/army-list`}
        download={filename}
        target={"_blank"}
        className="button primary"
        rel="noreferrer"
      >
        <FiDownload /> Download
      </a>
    </div>
  );
};

export const armyListField: AdditionalField = {
  input: (name, value, eventSlug, attendeeSlug) => (
    <ArmyListFileUpload
      name={name}
      uploadId={value}
      downloadUrl={`/event/${eventSlug}/profile/${attendeeSlug}/army-list`}
    />
  ),
  profile: (value, attendee) => (
    <ArmyList
      uploadId={value}
      eventSlug={attendee.eventSlug}
      attendeeSlug={attendee.slug}
    />
  ),
};
