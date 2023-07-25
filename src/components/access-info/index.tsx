import { Tooltip, IconButton, Box, Text } from '@chakra-ui/react';
import { InfoIcon } from 'icons/info-icon';
import { InfoIconOutline } from 'icons/info-icon-outline';
import { InfoTailIcon } from 'icons/info-tail-icon';
import { useAccessInfo } from 'lib/hooks/use-access-info-text';
import { useState } from 'react';

interface AccessInfoProps {
  entity: string;
}

export const AccessInfo = (props: AccessInfoProps) => {
  const text = useAccessInfo(props.entity);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Tooltip
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      placement="right"
      maxW="max-content"
      whiteSpace="nowrap"
      label={
        <>
          <InfoTailIcon
            color={'state.info.transparent'}
            left="-6px"
            width="6px"
            top={1.5}
            height="12px"
            position="absolute"
          />
          <Text color="base.content" fontSize="sm">
            {text}
          </Text>
        </>
      }
      bg="state.info.transparent"
      borderRadius="md"
    >
      <IconButton
        aria-label="Info"
        icon={isOpen ? <InfoIcon w="6" h="6" /> : <InfoIconOutline w="6" h="6" />}
        variant="unstyled"
        color={'state.info.main'}
        size="xs"
      />
    </Tooltip>
  );
};
