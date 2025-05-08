import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import useApi from '../../apiServices/UseApi';
import {PartnerUser} from '../../apiServices/apiHelper';

const PartnerUserDropdown = ({value, onChange}) => {
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedName,setSelectedName]=useState('')
  const {callApi} = useApi({manual: true});

  console.log(
    'RENDER - current selectedValue:',
    selectedValue,
    'initial value prop:',
    value,
  );


  useEffect(() => {
    // const userId = typeof value === 'object' ? value?.userId : value;
  
    // if (userId) {
    //   setSelectedValue(userId);
  
    //   const alreadyInList = users.some(user => user.value === userId);
  
    //   if (!alreadyInList) {
        fetchUserById(value);
    //   }
    // }
  }, [value]);

  const fetchUserById = async (userId) => {
    try {
        console.log('begforehitting APi',userId)
      const response = await callApi(null, PartnerUser(userId)); // Make sure this works with ID
      console.log('begforehitting APifetchUserById',response)

     setSelectedName(response[0]?.name)
    } catch (error) {
      console.error('Error fetching user by ID:', error);
    }
  };

  // Initialize with passed value
  useEffect(() => {
    console.log('INIT EFFECT - value prop changed:', value);
    if (value && value.userId) {
      console.log('Setting initial value:', value.userId);
      setSelectedValue(value.userId);

      if (!users.some(user => user.value === value.userId)) {
        console.log('Adding initial user to users list');
        setUsers(prev => [
          ...prev,
          {
            label: `${value.name} (${value.email || ''})`,
            value: value.userId,
            raw: value,
          },
        ]);
      }
    }
  }, [value]);

  // Debounce search
  useEffect(() => {
    console.log('SEARCH EFFECT - searchText changed:', searchText);
    const timer = setTimeout(() => {
      if (searchText.length > 2) {
        console.log('Triggering API search for:', searchText);
        fetchUsers(searchText);
      } else if (searchText.length === 0) {
        console.log('Clearing users list');
        setUsers([]);
      }
    }, 500);

    return () => {
      console.log('Clearing search timeout');
      clearTimeout(timer);
    };
  }, [searchText]);

  const fetchUsers = async search => {
    console.log('FETCHING USERS for search:', search);
    try {
      const response = await callApi(null, PartnerUser(search));
      console.log('API response:', response);
      if (response?.length > 0) {
        const formattedUsers = response.map(user => ({
          label: `${user.name} (${user.email})`,
          value: user.userId,
          raw: user,
        }));
        console.log('Setting users:', formattedUsers);
        setUsers(formattedUsers);
      } else {
        console.log('No users found');
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  console.log('selectedName',selectedName)

  const handleSelectUser = item => {
    console.log('USER SELECTED:', item);
    if (item) {
        // setSelectedName(item?.label)
      console.log('Setting selectedValue to:', item.value);
      setSelectedValue(item.value);
      console.log('Calling onChange with:', item.raw);
      onChange(item.raw);
    }
  };

  const handleBlur = () => {
    console.log('INPUT BLUR - current selectedValue:', selectedValue);
    setIsFocus(false);
  };

  const handleTextChange = text => {
    console.log('TEXT CHANGED:', text);
    setSearchText(text);
    // Don't reset selectedValue here – let the onChange handle selection
  };

  console.log('selectedValueselectedValue',selectedValue)

  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        itemTextStyle={{color: 'black', fontSize: 14}}
        data={users}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={selectedName ? selectedName : 'Select reviewer'}
        searchPlaceholder="Search..."
        value={selectedValue}
        onFocus={() => {
          console.log('INPUT FOCUSED');
          setIsFocus(true);
        }}
        onBlur={handleBlur}
        onChange={handleSelectUser}
        onChangeText={handleTextChange}
        renderItem={item => (
          <View style={styles.item}>
            <Text style={styles.textItem}>{item.label}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 0,
    margin: 0,

  },
  dropdown: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  placeholderStyle: {
    fontSize: 14,
    color: 'black',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: 'black',
    
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
    color: 'black',
    
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  item: {
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: 'lightgray',
  },
  textItem: {
    fontSize: 14,
    color: 'black',
  },
});

export default PartnerUserDropdown;
