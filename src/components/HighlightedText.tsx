import { useMemo } from 'react';
import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';

import { getHighlightSegments } from '@/utils/passwordSearch';
import { useTheme } from '@/theme';

export type HighlightedTextProps = {
  text: string;
  query?: string;
  style?: StyleProp<TextStyle>;
  highlightStyle?: StyleProp<TextStyle>;
  numberOfLines?: number;
  selectable?: boolean;
};

export function HighlightedText({
  text,
  query = '',
  style,
  highlightStyle,
  numberOfLines,
  selectable = false,
}: HighlightedTextProps) {
  const { theme } = useTheme();

  const segments = useMemo(
    () => getHighlightSegments(text, query),
    [text, query],
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        highlight: {
          backgroundColor: theme.colors.primaryMuted,
          color: theme.colors.primary,
          borderRadius: theme.borderRadius.xs,
        },
      }),
    [theme],
  );

  return (
    <Text style={style} numberOfLines={numberOfLines} selectable={selectable}>
      {segments.map((segment, index) =>
        segment.highlighted ? (
          <Text
            key={`${segment.text}-${index}`}
            style={[style, styles.highlight, highlightStyle]}
          >
            {segment.text}
          </Text>
        ) : (
          <Text key={`${segment.text}-${index}`}>{segment.text}</Text>
        ),
      )}
    </Text>
  );
}
