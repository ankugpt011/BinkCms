// components/DropdownWithModal.js
import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View, FlatList, StyleSheet } from 'react-native';


import ModalLib from 'react-native-modal';
import VectorIcon from '../../assets/vectorIcons';
import FontStyle from '../../assets/theme/FontStyle';

const DropdownWithModal = ({ label, options = [], onSelect }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleSelect = (item) => {
    setSelected(item);
    onSelect?.(item);
    setIsVisible(false);
  };
  console.log('options',options)

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
          <Text style={FontStyle.headingSmall}>{label}</Text>
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
                
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => handleSelect(item)}
              >
                {console.log('valueqwertg',item)}
                <Text style={FontStyle.labelMedium}>{item.label}</Text>
              </TouchableOpacity>
            )}
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
        maxHeight: '60%',
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
      },
      modalItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
      },
      modalItemText: {
        fontSize: 16,
      },
})