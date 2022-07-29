import { Button, FormControl, FormLabel, Input, ModalBody, ModalFooter, Text, useToast, VStack } from "@chakra-ui/react";
import { useModal } from "@hooks/useModal";
import { useCreateProjectMutation } from "apollo/generated/types";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { route } from '@helper/routes';
import { useProject } from "@hooks/useProject";


const AddProjectModal: FC = () => {
    const [projectTitle, setProjectTitle] = useState<string>('');
    const toast = useToast();
    const router = useRouter();
    const { setModalData } = useModal();
    const [createPojectMutation] = useCreateProjectMutation();
    const {refetch} = useProject();

    const createProject = (projectName: string) => {
        createPojectMutation({
            variables: { name: projectName },
            onError: (error) => {
                toast({
                    status: "error",
                    title: "Error",
                    description: `Project '${projectName}' could not be created. ${error.message}`,
                })
                console.error(error);
            },
            onCompleted: async (data) => {
                if (!data.project) {
                    // @Todo handle error on model base
                    toast({
                        status: "error",
                        title: "Error",
                        description: `Project '${projectName}' could not be created.`,
                    });
                } else if (data?.project?.uuid) {
                    toast({
                        title: 'Project created.',
                        description: `Project '${projectName}' was successfully created.`,
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                    });
                    await refetch();
                    router.push(route.projectPongs(data.project.uuid));
                    setModalData(null);
                }
            },
        });
    };

    return (
        <>
            <ModalBody>
                <VStack spacing={8} alignItems="flex-start">
                    <Text>
                        Create projects for an overview of your pongs. There is no limit for
                        the projects you can create.
                    </Text>
                    <FormControl>
                        <FormLabel>What is the name of the project?</FormLabel>
                        <Input
                            value={projectTitle}
                            onChange={(e) => setProjectTitle(e.currentTarget.value)}
                            size="lg"
                            placeholder="My new fancy project"
                            variant="filled"
                            type="text"
                        />
                    </FormControl>
                </VStack>
            </ModalBody>
            <ModalFooter>
                <Button
                    colorScheme="green"
                    mr={3}
                    onClick={() => createProject(projectTitle)}
                >
                    Create project
                </Button>
            </ModalFooter>
        </>
    );
}

export { AddProjectModal };