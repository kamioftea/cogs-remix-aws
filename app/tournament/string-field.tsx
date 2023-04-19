import type { AdditionalField } from "~/tournament/additional-fields";
import React from "react";

export const stringField: AdditionalField = {
  input: (name, value) => (
    <input id={name} name={name} defaultValue={value} type="text" />
  ),
  profile: (value) => <span>{value || ""}</span>,
};
