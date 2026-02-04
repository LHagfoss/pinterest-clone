import 'react-native-reanimated';
import type { ViewProps } from 'react-native';

declare module 'react-native-reanimated' {
  export interface AnimateProps<T> extends ViewProps {
    sharedTransitionTag?: string;
  }
}