import {
  VStack,
  useBreakpointValue,
  Stack,
  Text,
  Flex,
} from "@chakra-ui/react";

import React from "react";

export interface PageHeaderProps {
  pageHeader?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ pageHeader }) => {
  return (
    <Flex w="full" h="100" backgroundColor="rgba(0, 128, 128, 0.9)">
      <VStack w="full" px={useBreakpointValue({ base: 4, md: 8 })}>
        <Text textAlign="center" fontSize="6xl" as="b" color="white">
          {pageHeader}
        </Text>
      </VStack>
    </Flex>
  );
};

export default PageHeader;
