import Link from 'next/link';
import {
  Badge,
  Box,
  Button,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useInvoicesQuery } from 'apollo/generated/types';

import { Card, EmptyMessage } from '@uikit/components';

const Invoices = () => {
  const { data } = useInvoicesQuery();

  return (
    <Card w="100%">
      <Heading mb={2} as="h3" size="md">
        Invoices
      </Heading>
      <Box mt={4}>
        {data?.invoices && data.invoices.length > 0 ? (
          <Table>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Period</Th>
                <Th>Status</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.invoices.map((invoice) => (
                <Tr key={invoice?.id}>
                  <Td>{invoice?.number}</Td>
                  <Td>
                    {new Date(invoice?.periodStart).toDateString()} -{' '}
                    {new Date(invoice?.periodEnd).toDateString()}
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={
                        invoice?.status === 'paid' ? 'green' : 'orange'
                      }
                    >
                      {invoice?.status}
                    </Badge>
                  </Td>
                  <Td>
                    {invoice?.invoicePdf && (
                      <Link href={invoice.invoicePdf} passHref>
                        <Button as="a" size="sm">
                          Download
                        </Button>
                      </Link>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <EmptyMessage msg="There are no invoices yet." />
        )}
      </Box>
    </Card>
  );
};

export { Invoices };
