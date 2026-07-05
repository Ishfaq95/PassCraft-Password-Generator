import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AnimatedScreen } from '@/components/AnimatedScreen';
import { ScreenHeader } from '@/components/ScreenHeader';
import {
  PRIVACY_POLICY_EFFECTIVE_DATE,
  PRIVACY_POLICY_INTRO,
  PRIVACY_POLICY_SECTIONS,
} from '@/constants/privacyPolicy';
import type { SettingsStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';

export function PrivacyPolicyScreen() {
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<SettingsStackParamList>>();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        content: {
          padding: theme.spacing.lg,
          paddingBottom: theme.spacing['4xl'],
          gap: theme.spacing.xl,
        },
        hero: {
          gap: theme.spacing.sm,
        },
        title: {
          ...theme.typography.headlineMedium,
          color: theme.colors.text,
        },
        effectiveDate: {
          ...theme.typography.bodySmall,
          color: theme.colors.textSecondary,
        },
        intro: {
          ...theme.typography.bodyMedium,
          color: theme.colors.textSecondary,
          lineHeight: 24,
        },
        section: {
          gap: theme.spacing.sm,
        },
        sectionTitle: {
          ...theme.typography.titleMedium,
          color: theme.colors.text,
        },
        paragraph: {
          ...theme.typography.bodyMedium,
          color: theme.colors.textSecondary,
          lineHeight: 24,
        },
        bulletList: {
          gap: theme.spacing.sm,
          paddingLeft: theme.spacing.sm,
        },
        bulletRow: {
          flexDirection: 'row',
          gap: theme.spacing.sm,
        },
        bulletMarker: {
          ...theme.typography.bodyMedium,
          color: theme.colors.primary,
          lineHeight: 24,
        },
        bulletText: {
          flex: 1,
          ...theme.typography.bodyMedium,
          color: theme.colors.textSecondary,
          lineHeight: 24,
        },
      }),
    [theme],
  );

  return (
    <AnimatedScreen style={styles.container}>
      <ScreenHeader
        title="Privacy Policy"
        onBackPress={() => navigation.goBack()}
        showBorder={false}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.effectiveDate}>
            Effective Date: {PRIVACY_POLICY_EFFECTIVE_DATE}
          </Text>
          <Text style={styles.intro}>{PRIVACY_POLICY_INTRO}</Text>
        </View>

        {PRIVACY_POLICY_SECTIONS.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.paragraphs.map(paragraph => (
              <Text key={paragraph} style={styles.paragraph}>
                {paragraph}
              </Text>
            ))}
            {section.bullets ? (
              <View style={styles.bulletList}>
                {section.bullets.map(bullet => (
                  <View key={bullet} style={styles.bulletRow}>
                    <Text style={styles.bulletMarker}>{'\u2022'}</Text>
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ))}
      </ScrollView>
    </AnimatedScreen>
  );
}
