import React from 'react';

import { useTranslation } from 'react-i18next';
import { FiSend } from 'react-icons/fi';

import { ackMessage } from '@app/core/slices/meshtasticSlice';
import { useAppDispatch, useAppSelector } from '@app/hooks/redux';
import { Input } from '@components/generic/form/Input';
import { connection } from '@core/connection';

import { Select } from '../generic/form/Select';
import { IconButton } from '../generic/IconButton';

export const MessageBar = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const ready = useAppSelector((state) => state.meshtastic.ready);
  const nodes = useAppSelector((state) => state.meshtastic.nodes);
  const users = useAppSelector((state) => state.meshtastic.users);
  const myNodeInfo = useAppSelector((state) => state.meshtastic.myNodeInfo);
  const [currentMessage, setCurrentMessage] = React.useState('');
  const [destinationNode, setDestinationNode] =
    React.useState<number>(0xffffffff);
  const sendMessage = (): void => {
    if (ready) {
      void connection.sendText(currentMessage, destinationNode, true, (id) => {
        dispatch(ackMessage(id));

        return Promise.resolve();
      });
      setCurrentMessage('');
    }
  };
  const { t } = useTranslation();
  return (
    <div className="flex w-full p-4 mx-auto space-x-2 text-gray-500 bg-gray-50 dark:bg-transparent dark:text-gray-400">
      <div className="flex w-full max-w-4xl mx-auto">
        <form
          className="flex w-full space-x-2"
          onSubmit={(e): void => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <Select
            onChange={(e): void => {
              setDestinationNode(parseInt(e.target.value));
            }}
            options={[
              {
                name: 'All',
                value: 0xffffffff,
              },
              ...nodes
                .filter((node) => node.num !== myNodeInfo.myNodeNum)
                .map((node) => {
                  const user = users.filter(
                    (user) => user.packet.from === node.num,
                  )[0]?.data;
                  return {
                    name: user ? user.shortName : node.num,
                    value: node.num,
                  };
                }),
            ]}
          />
          <Input
            type="text"
            minLength={2}
            placeholder={`${t('placeholder.message')}...`}
            disabled={!ready}
            value={currentMessage}
            onChange={(e): void => {
              setCurrentMessage(e.target.value);
            }}
          />
          <IconButton icon={<FiSend className="w-5 h-5" />} type="submit" />
        </form>
      </div>
    </div>
  );
};
