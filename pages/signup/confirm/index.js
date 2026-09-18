import DefaultLayout from "interface/DefaultLayout";
import { Banner } from "@primer/react";

export default function ConfirmRegisterPage() {
  return (
    <DefaultLayout
      contentWidth="small"
      metadata={{
        title: "Activate your account",
      }}
    >
      <Banner
        title="Almost there!"
        variant="warning"
        description="Open the email we sent to you and click the account activation link."
      />
    </DefaultLayout>
  );
}
