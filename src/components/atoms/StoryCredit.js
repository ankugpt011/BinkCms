import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import FontStyle from '../../assets/theme/FontStyle';
import { debounce } from 'lodash';
import useApi from '../../apiServices/UseApi';
import { AuthorList } from '../../apiServices/apiHelper';

const StoryCredit = ({
  types = [],
  onChange = () => {},
  initialCredits = [],
}) => {
  const [credits, setCredits] = useState(initialCredits.length > 0 ? initialCredits : []);
  const [focusIndex, setFocusIndex] = useState(null);

  const { callApi } = useApi({ manual: true, method: 'GET' });

  // Generate a unique 10-digit ID for each credit
  const generateUniqueId = () => {
    return Math.floor(Math.random() * 9000000000) + 1000000000;
  };

  // Format the credits data into the required output structure
  const formatOutput = (credits) => {
    return credits.reduce((acc, credit) => {
      if (!credit.uniqueId) return acc;
      
      const uid = credit.uniqueId;
      return {
        ...acc,
        [`extra_author_data_${uid}`]: uid,
        // [`extra_uid_${uid}`]: null,
        // [`extra_author_type_${uid}`]: 'internal',
        [`label_${uid}`]: credit.type || '',
        [`authorId_${uid}`]: credit.user?.userId || null,
        // [`authorName_${uid}`]: credit.user 
        //   ? `${credit.user.name} (${credit.user.email || 'null'})` 
        //   : null,
      };
    }, {});
  };

  // Update both local state and parent component with formatted data
  const handleUpdate = (updatedCredits) => {
    setCredits(updatedCredits);
    const formattedData = formatOutput(updatedCredits);
    onChange(formattedData);
  };

  // Handle credit type change
  const handleTypeChange = (index, type) => {
    const updated = [...credits];
    updated[index].type = type;
    handleUpdate(updated);
  };

  // Handle user selection
  const handleUserSelect = (index, user) => {
    const updated = [...credits];
    updated[index].user = user;
    updated[index].input = `${user.name}`;
    handleUpdate(updated);
    setFocusIndex(null);
  };

  // Add a new credit with unique ID
  const addCredit = () => {
    const uniqueId = generateUniqueId();
    const updated = [...credits, { 
      type: '', 
      user: null, 
      input: '', 
      users: [], 
      uniqueId 
    }];
    setCredits(updated);
    setFocusIndex(updated.length - 1);
    handleUpdate(updated);
  };

  // Remove a credit
  const removeCredit = (index) => {
    const updated = credits.filter((_, i) => i !== index);
    handleUpdate(updated);
    setFocusIndex(null);
  };

  // Search users with debounce
  const searchUsers = debounce(async (index, text) => {
    const response = await callApi(null, AuthorList(text));
    if (response?.authors) {
      const updated = [...credits];
      updated[index].users = response.authors.map(user => ({
        label: `${user.name} (${user.email || 'null'})`,
        value: user.userId,
        raw: user,
      }));
      setCredits(updated);
    }
  }, 500);

  return (
    <View>
      {credits.length > 0 && (
        <View style={{ flexDirection: 'row', paddingTop: 10 }}>
          <Text style={[FontStyle.titleSmall, { flex: 1.4 }]}>Credit</Text>
          <Text style={[FontStyle.titleSmall, { flex: 2 }]}>Name</Text>
        </View>
      )}

      {credits.map((credit, index) => (
        <View key={`credit-${credit.uniqueId || index}`} style={styles.creditRow}>
          {/* Credit Type Dropdown */}
          <Dropdown
            style={styles.dropdown}
            data={types.map(type => ({ label: type, value: type }))}
            labelField="label"
            valueField="value"
            value={credit.type}
            onChange={(item) => handleTypeChange(index, item.value)}
            placeholder="Select Type"
            placeholderStyle={{ color: 'black', fontSize: 14 }}
            selectedTextStyle={{ color: 'black' }}
            itemTextStyle={{ color: 'black' }}
            maxHeight={150}
          />

          {/* User Selection Dropdown */}
          <Dropdown
            style={[styles.dropdown, { flex: 1 }]}
            data={credit.users}
            labelField="label"
            valueField="value"
            search
            value={credit.user?.userId || null}
            searchPlaceholder="Search name..."
            placeholderStyle={{ color: 'black', fontSize: 14 }}
            selectedTextStyle={{ color: 'black' }}
            itemTextStyle={{ color: 'black', fontSize: 14 }}
            inputSearchStyle={{ color: 'black' }}
            onChange={(item) => handleUserSelect(index, item.raw)}
            onChangeText={(text) => searchUsers(index, text)}
            onFocus={() => setFocusIndex(index)}
            onBlur={() => setFocusIndex(null)}
            isFocus={focusIndex === index}
            maxHeight={200}
          />

          {/* Remove Button */}
          <TouchableOpacity
            onPress={() => removeCredit(index)}
            style={styles.removeButton}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>×</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Add Credit Button */}
      <TouchableOpacity onPress={addCredit} style={styles.addButton}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>+ Add Credit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  creditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
    paddingTop: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
    minWidth: 120,
    color: 'black',
  },
  removeButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 6,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8
  },
});

export default StoryCredit;