import { FC, useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
} from '@chakra-ui/react';

import { formatFromSeconds } from '@helper/format';
import { Card } from '@uikit/components';

interface ScheduleInputProps {
  label?: string;
  options: { value: string; label: string }[];
  defaultNumber: number;
  onChange: (seconds: string) => void;
  helpText?: string;
}

const ScheduleInput: FC<ScheduleInputProps> = ({
  label,
  options,
  defaultNumber,
  onChange,
  helpText,
}) => {
  const [number, setNumber] = useState(0);
  const [unit, setUnit] = useState('');

  const convertToSeconds = () => {
    switch (unit) {
      case 'minutes':
        return number * 60;
      case 'hours':
        return number * 60 * 60;
      case 'days':
        return number * 60 * 60 * 24;
      default:
        // default 10 minutes
        return 10 * 60;
    }
  };

  const convertFromSeconds = () => {
    const [minutes, hours, days] = formatFromSeconds(defaultNumber, false);

    if (days !== 0) {
      setNumber(Number(days));
      return 'days';
    }

    if (hours !== 0) {
      setNumber(Number(hours));
      return 'hours';
    }

    setNumber(Number(minutes));
    return 'minutes';
  };

  useEffect(() => {
    setUnit(convertFromSeconds());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card w="100%">
      <FormControl mb={5}>
        {label && <FormLabel>{label}</FormLabel>}
        <HStack>
          <NumberInput
            value={number}
            allowMouseWheel
            onChange={(e) => setNumber(parseInt(e))}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Select
            value={unit}
            onChange={(e) => setUnit(e.currentTarget.value)}
          >
            {options.map((opt, index) => (
              <option key={`${opt.value}-${index}`} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </HStack>
        {helpText && <FormHelperText>{helpText}</FormHelperText>}
      </FormControl>
      <Button
        colorScheme="green"
        onClick={() => onChange(convertToSeconds().toString())}
      >
        Save
      </Button>
    </Card>
  );
};

export { ScheduleInput };
