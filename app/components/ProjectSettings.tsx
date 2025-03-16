import React from 'react';
import { View, Text, Switch, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface SettingItem {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (value: boolean) => void;
}

const SettingRow: React.FC<SettingItem> = ({ title, description, enabled, onToggle }) => (
  <View style={styles.settingRow}>
    <View style={styles.settingInfo}>
      <Text style={styles.settingTitle}>{title}</Text>
      <Text style={styles.settingDescription}>{description}</Text>
    </View>
    <Switch value={enabled} onValueChange={onToggle} />
  </View>
);

const ProjectSettings: React.FC = () => {
  const [settings, setSettings] = React.useState([
    {
      title: 'التقاط الفيديو ومعالجة الصور',
      description: 'تفعيل وظيفة معالجة OpenCV للتقاط الفيديو في الوقت الفعلي من الكاميرا أو تحميل الصور. يشمل ذلك تحليل الألوان، وتتبع الكائنات، وتحليل الحركة.',
      enabled: true,
    },
    {
      title: 'اكتشاف العناصر وتصنيفها',
      description: 'استخدام خوارزميات HAAR Cascade و YOLO لاكتشاف وتصنيف العناصر بشكل آلي. يمكن تخصيص هذه الخاصية لتحديد أنواع معينة من الكائنات أو الأشكال.',
      enabled: false,
    },
    // Add more settings as needed
  ]);

  const toggleSetting = (index: number) => {
    const newSettings = [...settings];
    newSettings[index].enabled = !newSettings[index].enabled;
    setSettings(newSettings);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>منظم الوقوف الذكي</Text>
      {settings.map((setting, index) => (
        <SettingRow
          key={index}
          title={setting.title}
          description={setting.description}
          enabled={setting.enabled}
          onToggle={() => toggleSetting(index)}
        />
      ))}
      <TouchableOpacity style={styles.helpButton}>
        <Text style={styles.helpButtonText}>احصل على مساعدة</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'right',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'right',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  helpButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  helpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProjectSettings;