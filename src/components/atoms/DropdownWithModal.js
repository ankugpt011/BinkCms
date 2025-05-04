import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View, FlatList, StyleSheet, TextInput } from 'react-native';
import ModalLib from 'react-native-modal';
import VectorIcon from '../../assets/vectorIcons';
import FontStyle from '../../assets/theme/FontStyle';

const DropdownWithModal = ({ label, options = [], onSelect }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [searchText, setSearchText] = useState('');

  const handleSelect = (item) => {
    setSelected(item);
    onSelect?.(item.value); // send just the value to parent
    setIsVisible(false);
    setSearchText('');
  };

  const filteredOptions = options.filter((item) =>
    item.label.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <TouchableOpacity
        style={styles.dropdownContainer}
        onPress={() => setIsVisible(true)}
      >
        <Text style={styles.labelText}>
          {selected ? selected.label : label}
        </Text>
        {selected && (
          <TouchableOpacity onPress={() => setSelected(null)}>
            <VectorIcon
              material-icon
              name="close"
              size={20}
              color="#999"
              style={{ marginRight: 8 }}
            />
          </TouchableOpacity>
        )}
        <VectorIcon
          material-icon
          name="arrow-drop-down"
          size={24}
          color="#333"
        />
      </TouchableOpacity>

      <ModalLib
        isVisible={isVisible}
        onBackdropPress={() => setIsVisible(false)}
        style={styles.modalStyle}
      >
        <View style={styles.modalContent}>
          <Text style={[FontStyle.headingSmall, { marginBottom: 10 }]}>{label}</Text>

          {/* Search Input */}
          <TextInput
            placeholder="Search..."
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
          />

          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item.value.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => handleSelect(item)}
              >
                <Text style={FontStyle.labelMedium}>{item.label}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={{ padding: 12, textAlign: 'center', color: '#999' }}>
                No results found.
              </Text>
            }
          />
        </View>
      </ModalLib>
    </>
  );
};

export default DropdownWithModal;

const styles = StyleSheet.create({
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  labelText: {
    flex: 1,
    color: '#333',
    fontSize: 16,
  },
  modalStyle: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '70%',
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
    color: '#333',
  },
});
