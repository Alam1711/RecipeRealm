import {
  Box,
  Flex,
  HStack,
  IconButton,
  Input,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FC, useCallback, useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

interface LabelsSectionProps {
  value: string[] | null;
  setValues: (labels: string[]) => void;
  isNameDisabled?: boolean;
}

export const InstructionsSection: FC<LabelsSectionProps> = ({
  value,
  setValues,
  isNameDisabled,
}) => {
  const [labels, setLabels] = useState<string[]>([""]);
  const errorTextColor = useColorModeValue("red.500", "red.300");

  const onChangeText = useCallback(
    (text: string, index: number) => {
      const newValue = [...labels];
      newValue[index] = text;

      if (index === labels.length - 1 && text.trim() !== "") {
        newValue.push("");
      }

      setLabels(newValue);

      const res = newValue.filter((label) => label.trim() !== "");
      setValues(res);
    },
    [labels, setValues]
  );

  const handleDeleteLabel = (index: number) => {
    const newValue = [...labels];
    newValue.splice(index, 1);
    setLabels(newValue);

    // Remove the last empty label before setting values
    const res = newValue.filter((label) => label.trim() !== "");
    setValues(res);
  };

  useEffect(() => {
    if (value) {
      setLabels([...value, ""]);
    }
  }, [value]);

  return (
    <Box>
      <HStack>
        <Box>
          {!isNameDisabled ? (
            <>
              <Text>Instructions</Text>
              <Text fontSize="xs" color="gray.500">
                {`Add Instructions to help make your dish!`}
              </Text>
            </>
          ) : null}
        </Box>
      </HStack>
      {labels.map((label, index) => (
        <Flex
          key={`label${index}`}
          gap={[2, 6]}
          w="100%"
          mt={[2, 6]}
          alignItems="center"
        >
          <Text w="8%">{`Step: ${index + 1}`}</Text>
          <Box w="85%">
            <Input
              id={`label${index}`}
              className="label"
              placeholder={`Step: ${index + 1}`}
              value={label}
              onChange={(element) => {
                onChangeText(element.target.value, index);
              }}
              isInvalid={label.trim() === "" && index !== labels.length - 1}
            />
            {label.trim() === "" && index !== labels.length - 1 && (
              <Text fontSize="sm" textColor={errorTextColor}>
                Add another step
              </Text>
            )}
          </Box>
          <Box w="10%">
            <IconButton
              variant="ghost"
              aria-label="Delete label"
              icon={<FaTrashAlt fontSize={20} />}
              color="grey.500"
              onClick={() => handleDeleteLabel(index)}
            />
          </Box>
        </Flex>
      ))}
    </Box>
  );
};
