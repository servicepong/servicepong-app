import { FC, useState } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  ModalBody,
  ModalFooter,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from '@chakra-ui/react';
import {
  MemberLevel,
  ProjectMembersDocument,
  ProjectQuery,
  useCreateProjectMemberMutation,
  useDeleteProjectMemberMutation,
  useProjectMembersQuery,
} from 'apollo/generated/types';

import { useConfirmModal } from '@hooks/useConfirmModal';
import { useModal } from '@hooks/useModal';
import { Card, EmptyMessage } from '@uikit/components';

interface MembersProps {
  projectId: string;
  project?: ProjectQuery;
}

const Members: FC<MembersProps> = ({ projectId, project }) => {
  // hooks
  const toast = useToast();
  const { setModalData } = useModal();
  const { setConfirmModalData } = useConfirmModal();
  // apollo
  const { data } = useProjectMembersQuery({
    variables: { project: projectId },
  });
  const [createProjectMemberMutation] = useCreateProjectMemberMutation();
  const [deleteProjectMemberMutation] = useDeleteProjectMemberMutation();

  if (!project) {
    return null;
  }

  const createProjectMember = (email: string, level: MemberLevel) => {
    createProjectMemberMutation({
      variables: { project: project.project?.uuid, email, level },
      refetchQueries: [ProjectMembersDocument],
      onError: (error) => console.error(error),
      onCompleted: (data) => {
        if (data.projectMember?.success) {
          toast({
            title: 'Member added.',
            description: `The member (${email}) was successfully added to ${project.project?.name}.`,
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
          setModalData(null);
        }
      },
    });
  };

  const deleteProjectMember = (member: number) => {
    deleteProjectMemberMutation({
      variables: {
        project: project.project?.uuid,
        member,
      },
      refetchQueries: [ProjectMembersDocument],
      onError: (error) => console.error(error),
      onCompleted: (data) => {
        if (data.projectMemberDelete?.success) {
          toast({
            title: 'Member deleted.',
            description: `The member was successfully removed from ${project.project?.name}.`,
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
        }
      },
    });
  };

  return (
    <Card w="100%">
      <VStack spacing={8} w="100%" alignItems="flex-start">
        <VStack w="100%">
          <Flex justifyContent="space-between" w="100%" alignItems="center">
            <Heading as="h3" size="md">
              Team Members
            </Heading>
            <Button
              size="sm"
              leftIcon={<AddIcon />}
              onClick={() =>
                setModalData({
                  title: 'Invite a new member',
                  content: (
                    <ModalContent
                      createProjectMember={(memberEmail, memberLevel) =>
                        createProjectMember(memberEmail, memberLevel)
                      }
                    />
                  ),
                })
              }
            >
              Invite member
            </Button>
          </Flex>
          <Text mb={2}>
            You can invite other colleagues or friends to the project so that
            they can also view and manage the pongs and integrations.
          </Text>
        </VStack>
      </VStack>

      {data?.members && data.members.length > 0 ? (
        <Box w={'100%'} overflowX={'auto'}>
          <Table mt={8}>
            <Thead>
              <Tr>
                <Th>E-Mail</Th>
                <Th>Role</Th>
                <Th>Inivited</Th>
                <Th></Th>
              </Tr>
            </Thead>

            <Tbody>
              {data.members.map((member) => (
                <Tr key={member.id}>
                  <Td>{member.user.email}</Td>
                  <Td>{member.level}</Td>
                  <Td>{new Date(member.createdDate).toDateString()}</Td>
                  <Td isNumeric>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => {
                        setConfirmModalData({
                          title: 'Are you sure?',
                          text: 'If you confirm, the member will be removed from the project.',
                          onConfirm: () => deleteProjectMember(member.id),
                        });
                      }}
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      ) : (
        <EmptyMessage msg="No members invited yet." />
      )}
    </Card>
  );
};

export { Members };

interface ModalContentProps {
  createProjectMember: (email: string, level: MemberLevel) => void;
}

const ModalContent: FC<ModalContentProps> = ({ createProjectMember }) => {
  const [memberEmail, setMemberEmail] = useState<string>('');
  const [memberLevel, setMemberLevel] = useState<MemberLevel>(
    MemberLevel.Regular
  );

  return (
    <>
      <ModalBody>
        <VStack spacing={8} alignItems="flex-start">
          <Text>Invite a member to your project.</Text>
          <Alert status="warning" rounded="xl">
            <AlertIcon />
            <AlertDescription>
              You can only invite users who already have a servicepong.io
              account.
            </AlertDescription>
          </Alert>
          <FormControl isRequired>
            <FormLabel>Member email</FormLabel>
            <Input
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.currentTarget.value)}
              size="lg"
              placeholder="me@example.com"
              variant="filled"
              type="email"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Member level</FormLabel>
            <Select
              defaultValue="Regular"
              onChange={(e) =>
                setMemberLevel(
                  MemberLevel[e.currentTarget.value as keyof typeof MemberLevel]
                )
              }
            >
              <option value="Regular">Regular</option>
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </Select>
          </FormControl>
        </VStack>
      </ModalBody>
      <ModalFooter>
        <Button
          colorScheme="green"
          mr={3}
          onClick={() => createProjectMember(memberEmail, memberLevel)}
        >
          Create token
        </Button>
      </ModalFooter>
    </>
  );
};
