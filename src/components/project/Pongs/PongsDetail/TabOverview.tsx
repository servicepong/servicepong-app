import { FC } from 'react';
import NextLink from 'next/link';
import {
  Badge,
  Box,
  Button,
  Code,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { usePongQuery } from 'apollo/generated/types';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';

import { Card } from '@uikit/components';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// const labels = [
//   'Monday',
//   'Tuesday',
//   'Wednesday',
//   'Thursday',
//   'Friday',
//   'Saturday',
//   'Sunday',
// ];

// const dataPings = {
//   labels,
//   datasets: [
//     {
//       label: 'Pings',
//       data: labels.map(() => faker.datatype.number({ min: 300, max: 305 })),
//       borderColor: 'rgb(255, 99, 132)',
//       backgroundColor: 'rgba(255, 99, 132, 0.5)',
//     },
//   ],
// };

// const dataNotifications = {
//   labels,
//   datasets: [
//     {
//       label: 'Notifications',
//       data: labels.map(() => faker.datatype.number({ min: 0, max: 7 })),
//       borderColor: 'rgb(255, 99, 132)',
//       backgroundColor: 'rgba(255, 99, 132, 0.5)',
//     },
//   ],
// };

// const options = {
//   responsive: true,

//   scales: {
//     y: {
//       min: 0,
//     },
//   },
//   plugins: {
//     legend: {
//       display: false,
//     },
//   },
// };

interface TabOverviewProps {
  projectId: string;
  pongId: string;
}

const TabOverview: FC<TabOverviewProps> = ({ projectId, pongId }) => {
  // apollo
  const { data } = usePongQuery({
    variables: { project: projectId, id: pongId },
  });

  return (
    <Stack spacing={8}>
      {data?.pong?.pongVariant === 'Heartbeat' ? (
        <Card>
          <Heading mb={2} as="h2" size="md">
            How to use this pong?
          </Heading>
          <Text mb={2}>
            Send a request to the following url to test the pong. No matter if
            GET, POST, … Just try it out.
          </Text>
          <Text as="strong">HTTP Request url:</Text>
          <br />
          <Code mt={2}>{data?.pong?.pingUrl}</Code>
          <Box mt={8}>
            <NextLink href={`${process.env.NEXT_PUBLIC_DOCS_URL}`} passHref>
              <Button as="a">Learn more</Button>
            </NextLink>
          </Box>
        </Card>
      ) : data?.pong?.pongVariant === 'SSL' ? (
        <OverviewVariantItem
          howToUse="servicepong checks your SSL certificate for the specified domain name."
          inputLabel="Hostname"
          inputValue="servicepong.io"
          inputPlaceholder="servicepong.io"
        />
      ) : data?.pong?.pongVariant === 'Icmp' ? (
        <OverviewVariantItem
          howToUse="servicepong pings your hostname or IP to verify its uptime."
          inputLabel="Hostname or IP"
          inputValue="servicepong.io"
          inputPlaceholder="servicepong.io"
        />
      ) : data?.pong?.pongVariant === 'HTTP' ? (
        <OverviewVariantItem
          howToUse="servicepong checks your http/s url for status code `2xx`."
          inputLabel="URL"
          inputValue="https://servicepong.io"
          inputPlaceholder="https://servicepong.io"
        />
      ) : (
        <Card>Invalid variant</Card>
      )}

      <Card>
        <Heading mb={2} as="h2" size="md">
          Status
        </Heading>
        {/* <StatusBadge status={} timeago={new Date()} /> */}
        <Badge colorScheme="green">All Good</Badge>
      </Card>

      {/* <Card>
        <Flex justifyContent="space-between">
          <Heading mb={2} as="h2" size="md">
            Pongs processed
          </Heading>
          <ButtonGroup>
            <Button>Day</Button>
            <Button variant="ghost">Month</Button>
            <Button variant="ghost">Year</Button>
          </ButtonGroup>
        </Flex>
        <Line options={options} data={dataPings} />
      </Card>

      <Card>
        <Flex justifyContent="space-between">
          <Heading mb={2} as="h2" size="md">
            Notification send
          </Heading>
          <ButtonGroup>
            <Button>Day</Button>
            <Button variant="ghost">Month</Button>
            <Button variant="ghost">Year</Button>
          </ButtonGroup>
        </Flex>
        <Line options={options} data={dataNotifications} />
      </Card> */}
    </Stack>
  );
};

export { TabOverview };

interface OverviewVariantItemProps {
  howToUse: string;
  inputLabel: string;
  inputValue: string;
  inputPlaceholder: string;
}

const OverviewVariantItem: FC<OverviewVariantItemProps> = ({
  howToUse,
  inputLabel,
  inputValue,
  inputPlaceholder,
}) => (
  <Card>
    <Heading mb={2} as="h2" size="md">
      How to use this pong?
    </Heading>
    <Text mb={2}>{howToUse}</Text>
    <br />
    <FormControl>
      <FormLabel>{inputLabel}</FormLabel>
      <Input
        value={inputValue}
        // onChange={(e) => setProjectTitle(e.currentTarget.value)}
        size="lg"
        placeholder={inputPlaceholder}
        variant="filled"
        type="text"
      />
      <Button
        size="lg"
        // onClick={() => updatePassword()}
        // disabled={!(newPassword && newConfirmPassword)}
      >
        Save
      </Button>
    </FormControl>
    <Box mt={8}>
      <NextLink href={`${process.env.NEXT_PUBLIC_DOCS_URL}`} passHref>
        <Button as="a">Learn more</Button>
      </NextLink>
    </Box>
  </Card>
);
