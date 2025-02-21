import React from "react";
import { Field } from "formik";
import {
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
} from "@chakra-ui/react";

interface TimeInputFieldProps {
  name: string;
  label: string;
}

const TimeInputField: React.FC<TimeInputFieldProps> = ({ name }) => {
  return (
    <Field name={name}>
      {({ field, form }: { field: any; form: any }) => {
        const hours = Math.floor((field.value || 0) / 60);
        const minutes = (field.value || 0) % 60;

        return (
          <HStack>
            <NumberInput
              value={String(hours).padStart(2, "0")}
              onChange={(valueString) => {
                const newHours = parseInt(valueString, 10) || 0;
                form.setFieldValue(name, newHours * 60 + minutes);
              }}
              min={0}
              w="full"
            >
              <NumberInputField textAlign="right" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontFamily="bold" fontSize="25">
              :
            </Text>
            <NumberInput
              value={String(minutes).padStart(2, "0")}
              onChange={(valueString) => {
                const newMinutes = parseInt(valueString, 10) || 0;
                form.setFieldValue(name, hours * 60 + newMinutes);
              }}
              min={0}
              max={59}
              w="full"
            >
              <NumberInputField textAlign="left" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </HStack>
        );
      }}
    </Field>
  );
};

export default TimeInputField;
