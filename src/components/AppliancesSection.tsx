import {
  Box,
  Flex,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FC, useCallback, useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { CookingAppliance } from "./InterfaceTypes/types";

interface LabelsSectionProps {
  value: CookingAppliance[];
  setValues: (labels: CookingAppliance[]) => void;
  isNameDisabled?: boolean;
}

export const AppliancesSection: FC<LabelsSectionProps> = ({
  value,
  setValues,
  isNameDisabled,
}) => {
  const [labels, setLabels] = useState<CookingAppliance[]>([
    { key: "", quantity: 1 },
  ]);
  const errorTextColor = useColorModeValue("red.500", "red.300");

  const onChangeText = useCallback(
    (text: string, index: number, key: boolean) => {
      if (index === labels.length - 1 || labels.length === 1) {
        let newValue = undefined;
        if (key) {
          newValue = { key: text, quantity: labels[index].quantity };
        } else {
          newValue = {
            key: labels[index].key,
            quantity: parseInt(text, 10),
          };
        }
        labels.splice(labels.length - 1, 0, newValue);
      } else {
        let empty = text === "";
        if (key) {
          empty = labels[index].quantity === 0 && empty;
        } else {
          empty = labels[index].key === "" && empty;
        }
        if (empty) {
          labels.splice(index, 1);
        } else {
          let newValue = undefined;
          if (key) {
            newValue = { key: text, quantity: labels[index].quantity };
          } else {
            newValue = { key: labels[index].key, quantity: parseInt(text, 10) };
          }
          labels[index] = newValue;
        }
      }
      setLabels([...labels]);
      const res = [...labels];
      res.pop();
      setValues(res);
    },
    [labels, setValues]
  );

  const handleDeleteLabel = (index: number) => {
    if (index === labels.length - 1) {
      return;
    }
    labels.splice(index, 1);
    setLabels([...labels]);
    const popper = [...labels];
    popper.pop();
    setValues(popper);
  };

  useEffect(() => {
    let newValue: CookingAppliance[] = [];
    if (value) {
      newValue = [...value];
      newValue.push({ key: "", quantity: 1 });
      setLabels(newValue);
    }
  }, [value]);

  return (
    <Box>
      <HStack>
        <Box>
          {!isNameDisabled ? (
            <>
              <Text>Cooking Appliances</Text>
              <Text fontSize="xs" color="gray.500">
                {`Specify the cooking appliances and the quantity required for each appliance`}
              </Text>
            </>
          ) : null}
        </Box>
      </HStack>
      {labels.map((label, index) => (
        <Flex
          key={`label_key_value${index}`}
          gap={[2, 6]}
          w="100%"
          mt={[2, 2]}
          alignItems="center"
        >
          <Box w="45%">
            <FormLabel htmlFor={`value${index}`} color="gray.500" fontSize="sm">
              Appliance #{`${index}`}
            </FormLabel>
            <Input
              id={`key${index}`}
              className="key"
              placeholder="Enter an appliance"
              value={label.key}
              onChange={(element) => {
                onChangeText(element.target.value, index, true);
              }}
              isInvalid={label.key === "" && index !== labels.length - 1}
            />
            {label.key === "" && index !== labels.length - 1 && (
              <Text fontSize="sm" textColor={errorTextColor}>
                name is a required field
              </Text>
            )}
          </Box>
          <Box w="45%">
            <FormLabel htmlFor={`value${index}`} color="gray.500" fontSize="sm">
              Quantity
            </FormLabel>
            <Input
              id={`value${index}`}
              className="value"
              placeholder="Quantity"
              value={label.quantity || ""}
              onChange={(element) => {
                onChangeText(element.target.value, index, false);
              }}
              isInvalid={label.quantity === 0 && index !== labels.length - 1}
            />
            {label.quantity === 0 && index !== labels.length - 1 && (
              <Text fontSize="sm" textColor={errorTextColor}>
                value is a required field
              </Text>
            )}
          </Box>
          <Box w="10%" pt={6}>
            <IconButton
              variant="outline"
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
