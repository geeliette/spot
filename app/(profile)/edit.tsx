import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useUser } from '../context/UserContext';

export default function EditProfileScreen() {
  const { user, updateUser } = useUser();
  const [draft, setDraft] = React.useState(user);
  const router = useRouter();

  const onSave = () => {
    updateUser(draft);      // could await API call here
    router.back();          // go back to Profile
  };

  const handle = (key: keyof typeof draft) => (value: string) =>
    setDraft({ ...draft, [key]: value });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Account Settings</Text>
      <Field label="Name"   value={draft.name}   onChange={handle('name')} />
      <Field label="Location" value={draft.location} onChange={handle('location')} />
      <Field label="Workout Frequency" value={draft.workoutFrequency} onChange={handle('workoutFrequency')} />
      <Field label="Athlete Type" value={draft.athleteType} onChange={handle('athleteType')} />
      <Field label="Experience Level" value={draft.level} onChange={handle('level')} />
      <Field label="Instagram" value={draft.instagramHandle} onChange={handle('instagramHandle')} />

      <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
        <Text style={styles.saveTxt}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const Field = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <View style={{ marginBottom: 20 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput value={value} onChangeText={onChange} style={styles.input} />
  </View>
);

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 25, fontWeight: 'bold' },
  label: { fontSize: 14, marginBottom: 4, color: '#6B7280' },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  saveBtn: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveTxt: { color: 'white', fontWeight: '600', fontSize: 16 },
});
