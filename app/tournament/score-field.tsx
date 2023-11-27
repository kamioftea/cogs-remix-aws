import type { AdditionalField } from "~/tournament/additional-fields";
import React from "react";

export const scoreField: AdditionalField = {
  input: (name, value) => (
    <input id={name} name={name} defaultValue={value || 0} type="number" />
  ),
  profile: (value) => <span className="lead">{value || 0}</span>,
};
