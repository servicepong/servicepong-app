import { FC } from 'react';
import { useToast, VStack } from '@chakra-ui/react';
import {
  PongDocument,
  usePongQuery,
  useUpdatePongPeriodMutation,
} from 'apollo/generated/types';

import { ScheduleInput } from '@uikit/components';

interface TabScheduleProps {
  projectId: string;
  pongId: string;
}

const TabSchedule: FC<TabScheduleProps> = ({ projectId, pongId }) => {
  // hooks
  const toast = useToast();
  // apollo
  const { data } = usePongQuery({
    variables: { project: projectId, id: pongId },
  });
  const [updatePongPeriodMutation] = useUpdatePongPeriodMutation();

  // @TODO DRY
  const changePeriod = (seconds: string) => {
    updatePongPeriodMutation({
      variables: {
        project: projectId,
        uuid: pongId,
        period: seconds || data?.pong?.period || '0',
        gracePeriod: data?.pong?.gracePeriod || '0',
      },
      refetchQueries: [PongDocument],
      onError: (error) => console.error(error),
      onCompleted: (data) => {
        if (data.pong?.uuid) {
          toast({
            title: 'Pong updated.',
            description: 'Schedule was successfully updated.',
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
        }
      },
    });
  };

  // @TODO DRY
  const changeGracePeriod = (seconds: string) => {
    updatePongPeriodMutation({
      variables: {
        project: projectId,
        uuid: pongId,
        period: data?.pong?.period || '0',
        gracePeriod: seconds || data?.pong?.gracePeriod || '0',
      },
      refetchQueries: [PongDocument],
      onError: (error) => console.error(error),
      onCompleted: (data) => {
        if (data.pong?.uuid) {
          toast({
            title: 'Pong updated.',
            description: 'Schedule was successfully updated.',
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
        }
      },
    });
  };

  return (
    <form>
      <VStack spacing={8}>
        <ScheduleInput
          label="Period"
          options={[
            { value: 'minutes', label: 'Minutes' },
            { value: 'hours', label: 'Hours' },
            { value: 'days', label: 'Days' },
          ]}
          defaultNumber={
            (data?.pong?.period && parseInt(data?.pong?.period)) || 10 * 60
          }
          onChange={changePeriod}
          helpText="Set the time period after which the pong will be set as offline."
        />

        <ScheduleInput
          label="Grace time"
          options={[
            { value: 'minutes', label: 'Minutes' },
            { value: 'hours', label: 'Hours' },
            { value: 'days', label: 'Days' },
          ]}
          defaultNumber={
            (data?.pong?.gracePeriod && parseInt(data?.pong?.gracePeriod)) ||
            2 * 60
          }
          onChange={changeGracePeriod}
          helpText="Set the grace period when the notification should be sent after the pong is offline."
        />
      </VStack>
    </form>
  );
};

export { TabSchedule };
