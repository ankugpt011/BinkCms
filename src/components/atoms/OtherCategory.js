import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import VectorIcon from '../../assets/vectorIcons';
import FontStyle from '../../assets/theme/FontStyle';
import Apptheme from '../../assets/theme/Apptheme';

const OtherCategory = ({
  value = [], // Now expects array of catIds like [947, 245]
  onChange,
  data = [],
  placeholder = '-Select Category-',
  titleStyle,
  containerStyle,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [tempSelectedIds, setTempSelectedIds] = useState([]);

  // Convert between catIds and full category objects
  const getCategoryById = (catId) => data.find(cat => cat.catId === catId);
  const getSelectedCategories = () => value.map(getCategoryById).filter(Boolean);

  // Initialize temp selection when modal opens
  useEffect(() => {
    if (modalVisible) {
      setTempSelectedIds(value);
    }
  }, [modalVisible]);

  const toggleCategory = (catId) => {
    setTempSelectedIds(prev => 
      prev.includes(catId) 
        ? prev.filter(id => id !== catId) 
        : [...prev, catId]
    );
  };

  const isSelected = (catId) => tempSelectedIds.includes(catId);

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const confirmSelection = () => {
    onChange(tempSelectedIds); // Pass only the catIds
    setModalVisible(false);
  };

  const removeSelected = (catId) => {
    onChange(value.filter(id => id !== catId));
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 50,
          flexWrap: 'wrap',
          ...containerStyle,
        }}>
        <View style={{
          flex: 1,
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          {value.length === 0 ? (
            <Text style={FontStyle.title}>{placeholder}</Text>
          ) : (
            getSelectedCategories().map((category) => (
              <View
                key={category.catId}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  backgroundColor: '#f0f0f0',
                  borderRadius: 16,
                  marginRight: 6,
                  marginBottom: 6,
                }}>
                <Text style={{ color: 'black', fontSize: 14 }}>
                  {category.name}
                </Text>
                <TouchableOpacity
                  onPress={() => removeSelected(category.catId)}
                  style={{ marginLeft: 4 }}>
                  <VectorIcon material-icon name="close" size={14} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
        <VectorIcon material-icon name="keyboard-arrow-down" size={22} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPressOut={() => setModalVisible(false)}
          />
          <View style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 16,
            maxHeight: '70%',
          }}>
            <TextInput
              placeholder="Search..."
              value={search}
              onChangeText={setSearch}
              placeholderTextColor={'black'}
              style={{
                borderBottomWidth: 1,
                borderBottomColor: '#ccc',
                marginBottom: 12,
                padding: 8,
                fontSize: 16,
                color: 'black',
              }}
            />

            <FlatList
              data={filteredData}
              keyExtractor={item => item.catId.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ 
                    paddingVertical: 12, 
                    flexDirection: 'row', 
                    justifyContent: 'space-between' 
                  }}
                  onPress={() => toggleCategory(item.catId)}>
                  <Text style={FontStyle.labelMedium}>{item.name}</Text>
                  {isSelected(item.catId) && (
                    <VectorIcon material-icon name="check" size={22} color="#4CAF50" />
                  )}
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              onPress={confirmSelection}
              style={{
                marginTop: 16,
                backgroundColor: Apptheme.color.primary,
                padding: 12,
                borderRadius: 8,
              }}>
              <Text style={{ textAlign: 'center', color: 'white', fontSize: 16 }}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default OtherCategory;