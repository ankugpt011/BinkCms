import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import FontStyle from '../../assets/theme/FontStyle';

const CommonTags = ({data = [], onSelect, placeholder = 'Select tags',initialTags}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState(null);

  console.log('CommonTagsCommonTags',initialTags)
  console.log('dataCommonTags',data)

  useEffect(() => {
    if (initialTags?.length > 0 && data.length > 0) {
      const matchedTags = data.filter(tag => initialTags.includes(tag.name));
      console.log('matchedTags',matchedTags)
      setSelectedItems(matchedTags);
      // onSelect(matchedTags);
    }
  }, [initialTags, data]);
  

  const handleSelect = value => {
    const selectedTag = data.find(tag => tag.id === value);
    if (
      selectedTag &&
      !selectedItems.find(item => item.id === selectedTag.id)
    ) {
      const updated = [...selectedItems, selectedTag];
      setSelectedItems(updated);
      onSelect(updated);
    }
    setDropdownValue(null); // Reset dropdown
    setIsDropdownOpen(false); // Close dropdown
  };

  const removeItem = id => {
    const updated = selectedItems.filter(item => item.id !== id);
    setSelectedItems(updated);
    onSelect(updated);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.selectedContainer}>
        {selectedItems.map(item => (
          <View key={item.id} style={styles.tag}>
            <Text style={styles.tagText}>{item.name}</Text>
            <TouchableOpacity onPress={() => removeItem(item.id)}>
              <Text style={styles.remove}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Dropdown
        style={styles.dropdown}
        data={data}
        labelField="name"
        valueField="id"
        value={dropdownValue || 'select Tags'}
        search
        searchPlaceholder="Search tags..."
        placeholder="Search tags..."
        placeholderStyle={{color: 'black',}} // optional placeholder color
        searchPlaceholderTextColor="black"
        textStyle={{color: 'black'}} 
        itemTextStyle={{color: 'black'}} // <-- list items text color
        inputSearchStyle={{ color: 'black' }} 
        onChange={item => handleSelect(item.id)}
        maxHeight={200}
      />
    </View>
  );
};

export default CommonTags;

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 100,
    marginBottom: 16,
  },
  openDropdownText: {
    fontSize: 14,
    color: '#007BFF',
    paddingVertical: 8,
  },
  selectedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    marginRight: 6,
    color: '#000',
  },
  remove: {
    fontSize: 16,
    color: 'red',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#fff',
    color: 'black',
  },
});
