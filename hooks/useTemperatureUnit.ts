import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type TemperatureUnit = 'F';

interface TemperatureState {
  unit: TemperatureUnit;
}

const useTemperatureStore = create<TemperatureState>()(
  persist(
    () => ({
      unit: 'F',
    }),
    {
      name: 'temperature-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export function useTemperatureUnit() {
  const unit = useTemperatureStore((state) => state.unit);

  // Since we're already in Fahrenheit, just return the value
  const convertTemperature = (value: number) => {
    return Math.round(value);
  };

  return {
    temperatureUnit: unit,
    convertTemperature,
  };
}