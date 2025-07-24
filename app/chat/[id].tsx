import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useChatStore } from '../lib/chatStore';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const chat = useChatStore((s) => s.chats[id!]);
  const send = useChatStore((s) => s.send);
  const markRead = useChatStore((s) => s.markRead);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    if (id) markRead(id);
  }, [id, markRead]);

  if (!chat) return <SafeAreaView><Text>Chat not found</Text></SafeAreaView>;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><ArrowLeft size={24} color="#8B5CF6" /></TouchableOpacity>
        <Text style={styles.title}>{chat.name}</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
      {/* messages */}
      <FlatList
        data={chat.messages}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.sender === 'me' ? styles.mine : styles.theirs]}>
            <Text style={{ color: item.sender === 'me' ? '#fff' : '#111' }}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 16 }}
        
        // while chat is empty
        ListEmptyComponent={() => (
          <View>
            <Text style={styles.emptyTxt}>Send a message to start connecting!</Text>
          </View>
        )}
      />

      {/* input */}
      <View style={styles.inputBar}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Enter message"
          placeholderTextColor="grey"
          style={styles.input}
        />
        <TouchableOpacity
          onPress={() => { if (draft.trim()) { send(chat.id, draft.trim()); setDraft(''); } }}
          style={styles.sendBtn}
        >
          <Send size={25} color='#fff' />
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { 
    flexDirection:'row',
    alignItems:'center',
    gap:16,
    padding:16,
    borderBottomWidth:1,
    borderColor:'#E5E7EB' 
  },
  title:  { fontSize:18,fontWeight:'600' },
  bubble: { padding:10,borderRadius:12,marginVertical:4,maxWidth:'75%' },
  mine:   { backgroundColor:'#8B5CF6',alignSelf:'flex-end' },
  theirs: { backgroundColor:'#E5E7EB',alignSelf:'flex-start' },
  inputBar:{ flexDirection:'row',alignItems:'center',padding:12,borderTopWidth:1,borderColor:'#cecfd3' },
  input:  { flex:1,fontSize:16,padding:10,backgroundColor:'#F3F4F6',borderRadius:8 },
  sendBtn:{ 
    backgroundColor:'#8B5CF6',
    width:55,
    height:48,
    borderRadius:24,
    alignItems:'center',
    justifyContent:'center',
    marginLeft:8 
  },
  emptyTxt: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic'
  },
});
