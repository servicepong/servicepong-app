import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import {
  useCustomerBillingPortalMutation,
  useCustomerQuery,
} from 'apollo/generated/types';

import { route } from '@helper/routes';
import { Card } from '@uikit/components';

const Plan = () => {
  // apollo
  const { data } = useCustomerQuery();
  const [customerBillingPortalMutation] = useCustomerBillingPortalMutation();

  const billingPortalUrl = () => {
    customerBillingPortalMutation({
      onError: (error) => console.error(error),
      onCompleted: (data) => {
        if (data.billingPortal?.url) {
          window.open(data.billingPortal.url, '_blank');
        }
      },
    });
  };

  return (
    <Card w="100%">
      <Heading mb={2} as="h3" size="md">
        Current plan
      </Heading>
      <Box mt={4}>
        <Flex gap={2} alignItems="center" my={5}>
          <Text as="strong">{data?.customer?.plan?.name} Plan</Text>
          <Text color="gray.500">
            {data?.customer?.cancelAt
              ? `canceled at ${new Date(
                  data?.customer?.cancelAt
                ).toDateString()}`
              : data?.customer?.currentPeriodEnd
              ? `renew on ${new Date(
                  data?.customer?.currentPeriodEnd
                ).toDateString()}`
              : null}
          </Text>
          <ButtonGroup ml="auto">
            {data?.customer?.plan && data.customer.plan.name === 'Hobby' ? (
              <Button colorScheme={'green'} as="a" href={route.pricing()}>
                Change plan
              </Button>
            ) : (
              <Button onClick={() => billingPortalUrl()} colorScheme="green">
                Change plan
              </Button>
            )}
            {data?.customer?.cancelAt ? (
              <Button onClick={() => billingPortalUrl()} colorScheme="yellow">
                Renew
              </Button>
            ) : data?.customer?.currentPeriodEnd ? (
              <Button onClick={() => billingPortalUrl()} colorScheme="red">
                Cancel
              </Button>
            ) : null}
          </ButtonGroup>
        </Flex>

        <Table>
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th isNumeric>Usage</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Members</Td>
              <Td isNumeric>
                {`${data?.customer?.usage?.usedMemberLimit} / ${data?.customer?.usage?.usageMemberLimit}`}
              </Td>
            </Tr>
            <Tr>
              <Td>Pongs</Td>
              <Td isNumeric>
                {`${data?.customer?.usage?.usedPongLimit} / ${data?.customer?.usage?.usagePongLimit}`}
              </Td>
            </Tr>
            <Tr>
              <Td>SMS</Td>
              <Td isNumeric>
                {`${data?.customer?.usage?.usedSmsLimit} / ${data?.customer?.usage?.usageSmsLimit}`}
              </Td>
            </Tr>
            <Tr>
              <Td>Call</Td>
              <Td isNumeric>
                {`${data?.customer?.usage?.usedPongLimit} / ${data?.customer?.usage?.usagePongLimit}`}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
};

export { Plan };
