import React, { useState, useEffect } from 'react';
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
import Apptheme from '../../assets/theme/Apptheme';

const StoryCredit = ({
  types = [],
  onChange = () => {},
  initialCredits = [],
  story_credits,key
}) => {
  console.log('story_credits-story_credits',story_credits)
  // Initialize credits state with either initialCredits or parsed story_credits
  const generateUniqueId = () => {
    return Math.floor(Math.random() * 9000000000) + 1000000000;
  };

  const { callApi } = useApi({ manual: true, method: 'GET' });

  const [credits, setCredits] = useState(() => {
    // If we have initialCredits, use them
    if (initialCredits.length > 0) return initialCredits;
    
    // If we have story_credits, parse them into our format
    if (story_credits && story_credits.length > 0) {
      return story_credits.map(credit => ({
        type: credit.label,
        user: {
          userId: credit.authorId,
          name: credit.author_name,
          email: '' // You might need to adjust this if email is available
        },
        input: credit.author_name,
        users: [],
        uniqueId: generateUniqueId() // Generate a new ID for each credit
      }));
    }
    
    // Default empty array
    return [];
  });


  useEffect(() => {
    // This will re-run your initial state logic when key changes
    if (initialCredits.length > 0) {
      setCredits(initialCredits);
    } else if (story_credits && story_credits.length > 0) {
      setCredits(story_credits.map(credit => ({
        type: credit.label,
        user: {
          userId: credit.authorId,
          name: credit.author_name,
          email: ''
        },
        input: credit.author_name,
        users: [],
        uniqueId: generateUniqueId()
      })));
    } else {
      setCredits([]);
    }
  }, [key]);



  const [focusIndex, setFocusIndex] = useState(null);

  // Generate a unique 10-digit ID for each credit
 

  // Format the credits data into the required output structure
  const formatOutput = (credits) => {
    return credits.reduce((acc, credit) => {
      if (!credit.uniqueId) return acc;
      
      const uid = credit.uniqueId;
      
      // Initialize the output object with the array if it doesn't exist
      if (!acc.extra_author_data) {
        acc.extra_author_data = [];
      }
      
      // Add the UID to the array
      acc.extra_author_data.push(uid);
      
      // Keep all the existing individual fields
      return {
        ...acc,
        [`label_${uid}`]: credit.type || '',
        [`authorId_${uid}`]: credit.user?.userId || null,
        [`extra_author_type_${uid}`]: 'internal'
      };
    }, {});
  };

  // Call formatOutput and onChange when credits change
  useEffect(() => {
    const formattedData = formatOutput(credits);
    onChange(formattedData);
  }, [credits]);

  // Update local state
  const handleUpdate = (updatedCredits) => {
    setCredits(updatedCredits);
    // Note: We don't call onChange here because the useEffect will handle it
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
  };

  // Remove a credit
  const removeCredit = (index) => {
    const updated = credits.filter((_, i) => i !== index);
    setCredits(updated);
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

          {console.log('credit.user?.userId',credit.user?.userId,credit.user?.name)}
          <Dropdown
            style={[styles.dropdown, { flex: 1 }]}
            data={credit.users}
            labelField="label"
            valueField="value"
            search
            value={credit.user?.userId|| null}
            placeholder={credit.user ? credit.user.name : 'Select author...'}
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
    backgroundColor: Apptheme.color.primary,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8
  },
});

export default StoryCredit;