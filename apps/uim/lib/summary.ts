const native = "with SwiftUI and Jetpack Compose versions built from the same design tokens.";

const kinds: Record<string, string> = {
  "React Native Component": `an open-source mobile component from suiss/uim for React Native and Expo, ${native}`,
  Pattern: `an open-source mobile pattern from suiss/uim: components composed into a flow for React Native and Expo, ${native}`,
  Interaction: `an open-source mobile interaction from suiss/uim for React Native and Expo, ${native}`,
  Chart: `an open-source mobile chart from suiss/uim, drawn with react-native-svg for React Native and Expo, ${native}`,
  Block: `an open-source mobile screen from suiss/uim for React Native and Expo, ${native}`,
};

export function pageSummary(title: string, eyebrow: string | undefined) {
  const kind = eyebrow ? kinds[eyebrow] : undefined;
  return kind ? `${title} is ${kind} The @esuiss/uim CLI copies its source into your project, so you own the code.` : undefined;
}
