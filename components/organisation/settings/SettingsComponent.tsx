import OrgSettings from "./OrgSettings";

export default async function SettingsComponent() {
  const orgDetails = {
    organisation_name: "My Organisation",
    description: "This is a sample organisation description.",
    ai_enabled: false,
  };

  return <OrgSettings initialData={orgDetails} />;
}
