import { useEffect, useMemo, type ReactNode } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconButton } from './IconButton';
import { type AccessibilityProps } from './common';
import { useTheme } from '@/theme';

export type BottomSheetProps = AccessibilityProps & {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  snapHeight?: number | 'auto';
  showHandle?: boolean;
  style?: StyleProp<ViewStyle>;
};

const DISMISS_THRESHOLD = 80;

export function BottomSheet({
  visible,
  onClose,
  title,
  children,
  snapHeight = 'auto',
  showHandle = true,
  accessibilityLabel,
  testID,
  style,
}: BottomSheetProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const translateY = useSharedValue(windowHeight);
  const backdropOpacity = useSharedValue(0);

  const sheetMaxHeight =
    snapHeight === 'auto'
      ? windowHeight - insets.top - theme.spacing.md
      : Math.min(snapHeight, windowHeight - insets.top - theme.spacing.md);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, {
        duration: theme.animation.duration.normal,
      });
      backdropOpacity.value = withTiming(1, {
        duration: theme.animation.duration.normal,
      });
    } else {
      translateY.value = withTiming(windowHeight, {
        duration: theme.animation.duration.fast,
      });
      backdropOpacity.value = withTiming(0, {
        duration: theme.animation.duration.fast,
      });
    }
  }, [
    visible,
    windowHeight,
    translateY,
    backdropOpacity,
    theme.animation.duration,
  ]);

  const closeSheet = () => {
    onClose();
  };

  const pan = Gesture.Pan()
    .onUpdate(event => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd(event => {
      if (event.translationY > DISMISS_THRESHOLD) {
        translateY.value = withTiming(windowHeight, {
          duration: theme.animation.duration.fast,
        });
        runOnJS(closeSheet)();
      } else {
        translateY.value = withTiming(0, {
          duration: theme.animation.duration.fast,
        });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          justifyContent: 'flex-end',
        },
        backdrop: {
          ...StyleSheet.absoluteFill,
          backgroundColor: theme.colors.overlay,
        },
        sheet: {
          width: '100%',
          maxHeight: sheetMaxHeight,
          backgroundColor: theme.colors.surface,
          borderTopLeftRadius: theme.borderRadius['2xl'],
          borderTopRightRadius: theme.borderRadius['2xl'],
          paddingBottom: insets.bottom + theme.spacing.lg,
          ...theme.elevation.xl,
        },
        handleContainer: {
          alignItems: 'center',
          paddingVertical: theme.spacing.md,
        },
        handle: {
          width: 40,
          height: 4,
          borderRadius: theme.borderRadius.full,
          backgroundColor: theme.colors.borderStrong,
        },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: theme.spacing.md,
        },
        title: {
          ...theme.typography.titleLarge,
          color: theme.colors.text,
          flex: 1,
        },
        scroll: {
          flexGrow: 0,
        },
        scrollContent: {
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: theme.spacing.xs,
        },
      }),
    [theme, insets.bottom, insets.top, sheetMaxHeight],
  );

  return (
    <Modal
      testID={testID}
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      accessibilityViewIsModal
      statusBarTranslucent
    >
      <View
        style={styles.root}
        accessibilityLabel={accessibilityLabel ?? title ?? 'Bottom sheet'}
      >
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            accessibilityRole="button"
            accessibilityLabel="Close sheet"
            onPress={onClose}
          />
        </Animated.View>

        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.sheet, sheetStyle, style]}>
            {showHandle ? (
              <View style={styles.handleContainer}>
                <View style={styles.handle} />
              </View>
            ) : null}

            {title ? (
              <View style={styles.header}>
                <Text style={styles.title} accessibilityRole="header">
                  {title}
                </Text>
                <IconButton
                  icon="close"
                  variant="ghost"
                  accessibilityLabel="Close"
                  onPress={onClose}
                />
              </View>
            ) : null}

            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              bounces={false}
              nestedScrollEnabled
            >
              {children}
            </ScrollView>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}
