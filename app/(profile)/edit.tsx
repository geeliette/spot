import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Camera } from 'lucide-react-native';
import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';

export default function EditProfileScreen() {
  const { user, updateUser } = useUser();
  const [draft, setDraft] = React.useState(user);
  const router = useRouter();

  const onSave = () => {
    updateUser(draft);
    router.back();
  };

  const changeAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, 
        quality: 0.8,
    });
    if (!res.canceled && res.assets?.[0]?.uri) {
        setDraft({ ...draft, avatar: res.assets[0].uri });
    }
  };

  const handle =
    (key: keyof typeof draft) =>
    (value: string) =>
      setDraft({ ...draft, [key]: value });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.avatarWrap}>
        <Image source={{ uri: draft.avatar }} style={styles.avatar} />
        <TouchableOpacity style={styles.cameraBtn} onPress={changeAvatar}>
          <Camera size={16} color="#FFF" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Edit Profile</Text>

      <ScrollView
        contentContainerStyle={styles.formContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Field label="Name" value={draft.name} onChange={handle('name')} />
        <Field
          label="Location"
          value={draft.location}
          onChange={handle('location')}
        />
        <Field
          label="Workout Frequency"
          value={draft.workoutFrequency}
          onChange={handle('workoutFrequency')}
        />
        <Field
          label="Athlete Type"
          value={draft.athleteType}
          onChange={handle('athleteType')}
        />
        <Field
          label="Experience Level"
          value={draft.level}
          onChange={handle('level')}
        />
        <Field
          label="Instagram"
          value={draft.instagramHandle}
          onChange={handle('instagramHandle')}
        />

        <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
          <Text style={styles.saveTxt}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const Field = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TextInput value={value} onChangeText={onChange} style={styles.input} />
  </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1 },

  avatarWrap: {
    alignSelf: 'center',
    marginBottom: 32,
  },

  avatar: { width: 120, height: 120, borderRadius: 60 },

  cameraBtn: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#8B5CF6',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },

  /* Header */
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    paddingHorizontal: 24,
    paddingTop: 25,
  },

  /* Scrollable form */
  formContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },

  field: { marginBottom: 20 },

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
