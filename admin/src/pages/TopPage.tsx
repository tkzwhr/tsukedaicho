import ServerConnectionSetting from '@/components/presentational/ServerConnectionSetting';
import {
  ContextValues,
  ServerConnectionContext,
} from '@/providers/ServerConnectionProvider';
import { message } from 'antd';
import React, { useContext } from 'react';

export default function TopPage(): JSX.Element {
  const srvConnCtx = useContext(ServerConnectionContext);
  const [messageApi, contextHolder] = message.useMessage();

  const updateServerConnectionSetting = (values: ContextValues) => {
    if (values.endpoint === undefined || values.secret === undefined) return;

    srvConnCtx.setEndpoint(values.endpoint);
    srvConnCtx.setSecret(values.secret);

    messageApi.success('接続設定を更新しました。');
  };

  return (
    <>
      <ServerConnectionSetting
        contextValue={srvConnCtx}
        onUpdate={updateServerConnectionSetting}
      />
      {contextHolder}
    </>
  );
}
