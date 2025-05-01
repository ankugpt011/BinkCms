import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import VectorIcon from '../../assets/vectorIcons';
import FontStyle from '../../assets/theme/FontStyle';



const Location = ({ value, onChange, categories = [],placeholder='-Select Location-' }) => {
  const [selectedCategory, setSelectedCategory] = useState(value || null);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');

//   useEffect(() => {
//     setSelectedCategory(value);
//   }, [value]);

  const filteredCategories = categories?.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.value.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (item) => {
    console.log('categoryxcvbnmnbv',item)
    setSelectedCategory(item);
    onChange?.(item?.locationId);
    setModalVisible(false);
  };

  console.log('selectedCategory?.name',selectedCategory)

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
        }}>
        <Text style={[FontStyle.title,{flex:1}]}>
          {selectedCategory?.name || placeholder}{' '}
          {selectedCategory?.value ? `[ ${selectedCategory?.value} ]` : ''}
        </Text>
        {selectedCategory && (
          <TouchableOpacity 
          style={{marginRight:5}}
          onPress={() => {
            setSelectedCategory(null);
            onChange?.(null);
            
          }}>
            <VectorIcon material-icon name="close" size={16} />
          </TouchableOpacity>
        )}
        <VectorIcon material-icon name="keyboard-arrow-down" size={22} />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={{
          justifyContent: 'flex-end',
          margin: 0,
        }}>
        <View
          style={{
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
            data={filteredCategories}
            keyExtractor={item => item.value}
            renderItem={({ item }) =>{ 
              console.log('filteredCategories',item)
              return(
              <TouchableOpacity
                style={{ paddingVertical: 12 }}
                onPress={() => handleSelect(item)}>
                <Text style={FontStyle.headingSmall}>{item.name}</Text>
                {/* <Text style={FontStyle.labelMedium}>[ {item.value} ]</Text> */}
              </TouchableOpacity>
            )}}
          />
        </View>
      </Modal>
    </View>
  );
};

export default Location;
