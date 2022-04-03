import ServerConnectionSetting from "@/components/server-connection-setting/ServerConnectionSetting";
import React from "react";
import { Header } from "semantic-ui-react";

export default function TopPage(): JSX.Element {
  return (
    <div>
      <Header as="h2">ツケ台帳 Admin</Header>
      <ServerConnectionSetting />
    </div>
  );
}
