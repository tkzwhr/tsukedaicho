import { ServerConnectionContext } from '@/components/server-connection-provider/ServerConnectionProvider';
import React, { useContext, useState } from 'react';
import { Form, Button } from 'semantic-ui-react';

export default function ServerConnectionSetting(): JSX.Element {
  const srvConnCtx = useContext(ServerConnectionContext);
  const [endpoint, setEndpoint] = useState(srvConnCtx.endpoint ?? '');
  const [secret, setSecret] = useState(srvConnCtx.secret ?? '');

  function updateServerConnection() {
    srvConnCtx.setEndpoint(endpoint);
    srvConnCtx.setSecret(secret);
  }

  return (
    <Form>
      <Form.Input
        fluid
        inline={true}
        label="Endpoint"
        type="text"
        value={endpoint}
        onChange={(e, { value }) => setEndpoint(value)}
      />
      <Form.Input
        fluid
        inline={true}
        label="Secret"
        type="text"
        value={secret}
        onChange={(e, { value }) => setSecret(value)}
      />
      <Button
        primary={true}
        onClick={updateServerConnection}
        disabled={
          endpoint === srvConnCtx.endpoint && secret === srvConnCtx.secret
        }
      >
        設定
      </Button>
    </Form>
  );
}
