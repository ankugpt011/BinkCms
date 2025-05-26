import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Keyboard, TouchableWithoutFeedback } from 'react-native';
import VectorIcon from '../../assets/vectorIcons';
import Apptheme from '../../assets/theme/Apptheme';

const SearchableDropdown = ({
  data = [],
  placeholder,
  onSelect,
  value,
  searchText: propSearchText, // Receive search text from parent
  onClear, 
}) => {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (propSearchText !== undefined) {
      setSearchText(propSearchText);
    }
  }, [propSearchText]);

  useEffect(() => {
    setFilteredData(data);
    if (value?.label) {
      setSearchText(value.label);
    }
  }, [data, value]);

  const handleSearch = (text) => {
    setSearchText(text);
    
    if (text.trim()) {
      const searchLower = text.toLowerCase().trim();
      const filtered = data.filter(item => 
        item.label.toLowerCase().includes(searchLower)
      );
      setFilteredData(filtered);
      setIsDropdownVisible(true);
    } else {
      setFilteredData(data);
      setIsDropdownVisible(false);
      if (value) {
        onSelect(null);
      }
    }
  };

  const handleSelect = (item) => {
    onSelect(item);
    setSearchText(item.label);
    setIsDropdownVisible(false);
    Keyboard.dismiss();
  };

  const handleFocus = () => {
    setIsDropdownVisible(true);
  };

  const handleClear = () => {
    setSearchText('');
    onSelect(null);
    if (onClear) onClear(); // Notify parent of clear
    setIsDropdownVisible(false);
  };

  return (
    <TouchableWithoutFeedback onPress={() => setIsDropdownVisible(false)}>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={() => {}}>
          <View>
            <View style={styles.inputContainer}>
              <VectorIcon
                material-icon
                name="search"
                size={18}
                color="#ffffff"
              />
              <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={'#ffffff'}
                value={searchText}
                onChangeText={handleSearch}
                onFocus={handleFocus}
                cursorColor={'#fff'}
              />
              {(searchText || value) && (
                <TouchableOpacity onPress={handleClear}>
                  <VectorIcon
                    material-icon
                    name="close"
                    color="#ffffff"
                    size={18}
                  />
                </TouchableOpacity>
              )}
            </View>

            {isDropdownVisible && (
              <View style={styles.dropdown}>
                {filteredData.length > 0 ? (
                  <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.value}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.item}
                        onPress={() => handleSelect(item)}
                      >
                        <Text style={styles.itemText}>{item.label}</Text>
                        <Text style={styles.subText}>ID: {item.value}</Text>
                      </TouchableOpacity>
                    )}
                    keyboardShouldPersistTaps="always"
                    style={{ maxHeight: 200 }}
                  />
                ) : searchText ? (
                  <View style={styles.noResults}>
                    <Text style={styles.noResultsText}>No results found</Text>
                  </View>
                ) : null}
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 8,
    zIndex: 10000,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: Apptheme.color.searchColor,
    borderRadius: 6,
    height: 36,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: '#ffffff',
    marginLeft: 10,
    padding: 0,
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    zIndex: 100001,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemText: {
    color: '#000',
    fontSize: 16,
  },
  subText: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  noResults: {
    padding: 12,
    alignItems: 'center',
  },
  noResultsText: {
    color: '#666',
  },
});

export default SearchableDropdown;