import { Link } from 'expo-router';
import { Bell, Calendar, Dumbbell, LocationEdit as Edit, Circle as HelpCircle, Instagram, LogOut, MapPin, Settings, Shield, Star } from 'lucide-react-native';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';

export default function ProfileScreen() {
  const { user: userProfile, updateUser } = useUser();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const [editingKey, setEditingKey] =
  useState<null | 'workoutFrequency' | 'athleteType' | 'level' | 'instagramHandle'>(null);

  const ProfileSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  type ProfileItemProps =
  | {
      icon: React.ReactNode;
      title: string;
      value: string;
      fieldKey?: 'workoutFrequency' | 'athleteType' | 'level' | 'instagramHandle';
      onPress?: () => void;
      showSwitch?: false;
    }
  | {
      icon: React.ReactNode;
      title: string;
      showSwitch: true;
      switchValue: boolean;
      onSwitchChange: (v: boolean) => void;
    };

    function BufferedInput({
      initial,
      onDone,
    }: {
      initial: string;
      onDone: (final: string) => void;
    }) {
      const [text, setText] = useState(initial);
    
    return (
      <TextInput
        value={text}
        onChangeText={setText} // local state
        autoFocus
        style={styles.inlineInput}
        onEndEditing={() => onDone(text.trim())}
        returnKeyType="done"
      />
    );
  }

  const ProfileItem = (props: ProfileItemProps) => {
    if (props.showSwitch) {
      const { icon, title, switchValue, onSwitchChange } = props;
      return (
        <View style={styles.profileItem}>
          <View style={styles.profileItemLeft}>
            {icon}
            <Text style={styles.profileItemTitle}>{title}</Text>
          </View>
  
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: '#E5E7EB', true: '#8B5CF6' }}
            thumbColor="#FFFFFF"
          />
        </View>
      );
    } 

  // function save() {
  //   if (fieldKey && draft.trim() && draft !== value) {
  //     updateUser({ ...userProfile, [fieldKey]: draft.trim() });
  //   }
  //   setEditingKey(null);
  // }

  const { icon, title, value, fieldKey, onPress } = props;
  const isEditing = editingKey === fieldKey;
  if (isEditing) {
    return (
      <View style={styles.profileItem}>
        <View style={styles.profileItemLeft}>
          {icon}
          <Text style={styles.profileItemTitle}>{title}</Text>
        </View>
  
        <BufferedInput
          initial={value}
          onDone={(final) => {
            // save only if changed
            if (fieldKey && final && final !== value) {
              updateUser({ ...userProfile, [fieldKey]: final });
            }
            setEditingKey(null);
          }}
        />
      </View>
    );
  }
   
  return (
    <TouchableOpacity
      style={styles.profileItem}
      onPress={() => {
        if (fieldKey) {
          setEditingKey(fieldKey);
        }
        props.onPress?.();
      }}
      activeOpacity={0.7}
    >
      <View style={styles.profileItemLeft}>
        {icon}
        <Text style={styles.profileItemTitle}>{title}</Text>
      </View>
  
      <Text style={styles.profileItemValue}>{value}</Text>
    </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}   // adjust if you have a fixed header
      >
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Profile Photo and Basic Info */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
          </View>
          
          <Text style={styles.name}>
            {[userProfile.name, userProfile.age && String(userProfile.age)]
              .filter(Boolean)
              .join(', ')}
          </Text>
          <Text style={styles.location}>
            <MapPin size={14} color="#6B7280" />  {userProfile.location}
          </Text>

          <Link href="/(profile)/edit" asChild>
            <TouchableOpacity style={styles.editButton}>
              <Edit size={16} color="#8B5CF6" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Workout Info */}
        <ProfileSection title="Workout Information">
          <ProfileItem
            icon={<Dumbbell size={20} color="#6B7280" />}
            title="Workout Frequency"
            value={userProfile.workoutFrequency}
            fieldKey='workoutFrequency'
          />
          <ProfileItem
            icon={<Star size={20} color="#6B7280" />}
            title="Athlete Type"
            value={userProfile.athleteType}
            fieldKey='athleteType'
          />
          <ProfileItem
            icon={<Shield size={20} color="#6B7280" />}
            title="Experience Level"
            value={userProfile.level}
            fieldKey='level'
          />
          <ProfileItem
            icon={<Instagram size={20} color="#6B7280" />}
            title="Instagram"
            value={userProfile.instagramHandle}
            fieldKey='instagramHandle'
          />
        </ProfileSection>

        {/* Settings */}
        <ProfileSection title="Settings">
          <ProfileItem
            icon={<Bell size={20} color="#6B7280" />}
            title="Notifications"
            showSwitch
            switchValue={notificationsEnabled}
            onSwitchChange={setNotificationsEnabled}
          />
          <ProfileItem
            icon={<MapPin size={20} color="#6B7280" />}
            title="Location Services"
            showSwitch
            switchValue={locationEnabled}
            onSwitchChange={setLocationEnabled}
          />
          <ProfileItem
            icon={<Calendar size={20} color="#6B7280" />}
            title="Workout Schedule"
            value="Manage"
            onPress={() => {}}
          />
        </ProfileSection>

        {/* Support */}
        <ProfileSection title="Support">
          <ProfileItem
            icon={<HelpCircle size={20} color="#6B7280" />}
            title="Help & Support"
            value=""
            onPress={() => {}}
          />
          <ProfileItem
            icon={<Shield size={20} color="#6B7280" />}
            title="Privacy Policy"
            value=""
            onPress={() => {}}
          />
          <ProfileItem
            icon={<LogOut size={20} color="#EF4444" />}
            title="Sign Out"
            value=""
            onPress={() => {}}
          />
        </ProfileSection>

        {/* Professional Upgrade */}
        <View style={styles.upgradeContainer}>
          <Text style={styles.upgradeTitle}>Become a Professional</Text>
          <Text style={styles.upgradeSubtitle}>
            Offer paid training sessions and reach more clients
          </Text>
          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeButtonText}>Apply Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  settingsButton: {
    padding: 8,
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E5E7EB',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#8B5CF6',
    gap: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8B5CF6',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileItemTitle: {
    fontSize: 16,
    color: '#111827',
  },
  profileItemValue: {
    fontSize: 16,
    color: '#6B7280',
  },
  upgradeContainer: {
    margin: 24,
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  upgradeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  upgradeSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  upgradeButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  inlineInput: {
    fontSize: 16,
    color: '#6B7280'
  },
});