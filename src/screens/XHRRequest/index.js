import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import VectorIcon from '../../assets/vectorIcons';
import Apptheme from '../../assets/theme/Apptheme';
import FontStyle from '../../assets/theme/FontStyle';
import {useNavigation} from '@react-navigation/native';

const XHRRequest = () => {
    const [url, setUrl] = useState('');

  const handleSave = () => {
    console.log('Saved:', url);
  };
  const navigation = useNavigation();
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          padding: Apptheme.spacing.marginHorizontal,
          backgroundColor: Apptheme.color.primary,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <VectorIcon
            material-icon
            name="arrow-back-ios"
            color={Apptheme.color.background}
            size={18}
            style={{marginRight: 10}}
          />
        </TouchableOpacity>
        <Text
          style={[FontStyle.headingLarge, {color: Apptheme.color.background}]}>
          XHR Request
        </Text>
      </View>
      <ScrollView style={{padding: Apptheme.spacing.marginHorizontal}}>
        <View >
          <View style={styles.card}>
            <Text style={styles.title}>Enter Relative URL</Text>
            <TextInput
              placeholder="Enter relative URL without domain name"
              placeholderTextColor={Apptheme.color.black}
              multiline
              value={url}
              onChangeText={(e)=>setUrl(e)}
              style={styles.input}
            />
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              {/* <Icon name="save" color="white" size={20} /> */}
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default XHRRequest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3f74dd', // blue background
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3f74dd',
    borderBottomWidth: 2,
    borderBottomColor: '#3f74dd',
    marginBottom: 12,
  },
  input: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    textAlignVertical: 'top',
    fontSize: 16,
    color:Apptheme.color.black
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3f74dd',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'flex-end',
    borderRadius: 8,
    marginTop: 16,
  },
  saveText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
});
