import { Clock, ListFilter as Filter, MapPin, MoveHorizontal as MoreHorizontal, Search, Star, Users, Zap } from 'lucide-react-native';
import { useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Ad {
  id: string;
  type: 'regular' | 'professional';
  name: string;
  image: string;
  location: string;
  workoutType: string;
  duration?: string;
  description: string;
  isProfessional: boolean;
  rating?: number;
  price?: string;
}

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfessionalOnly, setShowProfessionalOnly] = useState(false);

  const ads: Ad[] = [
    {
      id: '1',
      type: 'professional',
      name: 'Sarah Martinez',
      image: 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'FitLife Gym, Downtown',
      workoutType: 'Personal Training',
      description: 'Certified personal trainer specializing in strength training and weight loss',
      isProfessional: true,
      rating: 4.9,
      price: '$80/hour'
    },
    {
      id: '2',
      type: 'regular',
      name: 'Mike Chen',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'Central Park',
      workoutType: 'Running',
      duration: '45 mins',
      description: 'Looking for a running partner for morning jogs',
      isProfessional: false
    },
    {
      id: '3',
      type: 'professional',
      name: 'Jessica Torres',
      image: 'https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'Zen Studio, Midtown',
      workoutType: 'Yoga & Pilates',
      description: 'Certified yoga instructor offering private and group sessions',
      isProfessional: true,
      rating: 4.8,
      price: '$60/hour'
    },
    {
      id: '4',
      type: 'regular',
      name: 'Alex Johnson',
      image: 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: 'Iron Gym, East Side',
      workoutType: 'Weightlifting',
      duration: '60 mins',
      description: 'Need a spotter for heavy bench press sessions',
      isProfessional: false
    }
  ];

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ad.workoutType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = showProfessionalOnly ? ad.isProfessional : true;
    return matchesSearch && matchesType;
  });

  const renderAdCard = (ad: Ad) => (
    <TouchableOpacity key={ad.id} style={styles.adCard} activeOpacity={0.95}>
      <Image source={{ uri: ad.image }} style={styles.adImage} />
      
      {ad.isProfessional && (
        <View style={styles.professionalBadge}>
          <Zap size={12} color="#FFFFFF" />
          <Text style={styles.professionalText}>PRO</Text>
        </View>
      )}
      
      <View style={styles.adContent}>
        <View style={styles.adHeader}>
          <Text style={styles.adName}>{ad.name}</Text>
          <TouchableOpacity style={styles.moreButton}>
            <MoreHorizontal size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.adDetails}>
          <View style={styles.detailRow}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.detailText}>{ad.location}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Users size={14} color="#6B7280" />
            <Text style={styles.detailText}>{ad.workoutType}</Text>
          </View>
          
          {ad.duration && (
            <View style={styles.detailRow}>
              <Clock size={14} color="#6B7280" />
              <Text style={styles.detailText}>{ad.duration}</Text>
            </View>
          )}
          
          {ad.isProfessional && ad.rating && (
            <View style={styles.detailRow}>
              <Star size={14} color="#F59E0B" />
              <Text style={styles.detailText}>{ad.rating} • {ad.price}</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.adDescription}>{ad.description}</Text>
        
        <TouchableOpacity 
          style={[
            styles.connectButton,
            ad.isProfessional && styles.professionalButton
          ]}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.connectButtonText,
            ad.isProfessional && styles.professionalButtonText
          ]}>
            {ad.isProfessional ? 'Book Session' : 'Connect'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Spot</Text>
        <Text style={styles.subtitle}>Find your workout partner</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search workouts, trainers..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#8B5CF6" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            !showProfessionalOnly && styles.activeToggle
          ]}
          onPress={() => setShowProfessionalOnly(false)}
        >
          <Text style={[
            styles.toggleText,
            !showProfessionalOnly && styles.activeToggleText
          ]}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.toggleButton,
            showProfessionalOnly && styles.activeToggle
          ]}
          onPress={() => setShowProfessionalOnly(true)}
        >
          <Text style={[
            styles.toggleText,
            showProfessionalOnly && styles.activeToggleText
          ]}>
            Professional
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.adsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.adsContent}
      >
        {filteredAds.map(renderAdCard)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  toggleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeToggleText: {
    color: '#FFFFFF',
  },
  adsList: {
    flex: 1,
  },
  adsContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  adCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  adImage: {
    width: '100%',
    height: 200,
  },
  professionalBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#F97316',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  professionalText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  adContent: {
    padding: 16,
  },
  adHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  adName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  moreButton: {
    padding: 4,
  },
  adDetails: {
    gap: 6,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  adDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },
  connectButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  professionalButton: {
    backgroundColor: '#F97316',
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  professionalButtonText: {
    color: '#FFFFFF',
  },
});