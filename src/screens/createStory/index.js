import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Apptheme from '../../assets/theme/Apptheme';
import FontStyle from '../../assets/theme/FontStyle';
import Gap from '../../components/atoms/Gap';
import MainContainer from '../../components/molecules/MainContainer';
import useApi from '../../apiServices/UseApi';
import {
  Create_Story_PageLayout,
  CreateStoryApi,
} from '../../apiServices/apiHelper';
import VectorIcon from '../../assets/vectorIcons';

import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import ScheduleModal from '../../components/atoms/ScheduleModal';
import {formatDateTime} from '../../components/utils';
import {useRoute} from '@react-navigation/native';

const CreateStory = () => {
  const scrollViewRef = useRef(null);
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const userData = useSelector(state => state.login.userData);
  console.log('userDatauserDatauserDatauserData',userData)
  const [isDirty, setIsDirty] = useState(false);
  const [data, setData] = useState();
  const [headerData, setHeaderData] = useState([]);
  const [netStatus, setNetStatus] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [invalidFields, setInvalidFields] = useState([]);
  const route = useRoute();
  const [initialized, setInitialized] = useState(false);
  const editValue = route.params?.data;
  console.log('editValue', editValue);

  const generateId = () => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };
  const [formValues, setFormValues] = useState({
    action: 'create_multipage',
    tempProcessId: generateId(),
    sessionId: userData?.sessionId,
    state: 'DRAFT',
  });

  const sectionOffsets = useRef({});
  const {callApi} = useApi({
    method: 'GET',
    url: '',
    manual: true,
  });
  const {callApi: postStoryApi} = useApi({
    method: 'POST',
    url: '',
    manual: true,
    cmsUrl: true,
  });

  useEffect(() => {
    console.log('abcdefghi12');

    const fetchData = async () => {
      try {
        console.log('abcdefghi12: inside fetchData');

        const net = await NetInfo.fetch();
        console.log('abcdefghi13', net);

        const isConnected = net.isConnected;
        console.log('isConnected', isConnected);
        // setNetStatus(isConnected)

        if (!isConnected) {
          const offlineData = await AsyncStorage.getItem('CreateStoryLayout');
          if (offlineData) {
            const parsed = JSON.parse(offlineData);
            setData(parsed);
            setHeaderData(transformHeader(parsed));
            initializeFormValues(parsed);
          }
          return;
        }

        const res = await callApi(null, Create_Story_PageLayout());
        if (res) {
          await AsyncStorage.setItem('CreateStoryLayout', JSON.stringify(res));
          setData(res);
          setHeaderData(transformHeader(res));
          initializeFormValues(res);
        }
      } catch (error) {
        console.error('Error in fetchData:', error);
      }
    };

    fetchData();
  }, []);

  const transformHeader = layout => {
    return Object.entries(layout).map(([key], index) => ({
      number: index + 1,
      heading: key,
      sectionKey: key,
    }));
  };

  useEffect(() => {
    if (isDirty) {
      const saveOfflineDraft = async () => {
        await AsyncStorage.setItem('offlineDraft', JSON.stringify(formValues));
      };

      saveOfflineDraft();
    }
  }, [formValues, isDirty]);

  const updateFormValue = (fieldKey, value) => {
    console.log('formUpdate123');
    setFormValues(prev => ({
      ...prev,
      [fieldKey]: value,
    }));
    setIsDirty(true);
    console.log('cahnged auto');
  };

  useEffect(() => {
    setFormValues(prev => ({
      ...prev,
      tempProcessId: generateId(),
    }));
  }, []);

  const validateMandatoryFields = (sections, formValues) => {
    const mandatoryFields = [];

    Object.values(sections).forEach(section => {
      section.forEach(item => {
        item.children.forEach(child => {
          if (child.is_mandatory && !formValues[child.element]) {
            mandatoryFields.push(child.element);
          }
        });
      });
    });

    setInvalidFields(mandatoryFields); // Track invalid fields
    return mandatoryFields;
  };

  const handleSubmit = async (newState = 'DRAFT', extraFields = {}) => {
    const missingFields = validateMandatoryFields(data, formValues);
    console.log('missingFields',missingFields)

    if (
      (newState == 'APPROVED' || newState == 'SCHEDULED') && missingFields.length > 0 ) {
      ToastAndroid.show(`Please fill mandatory fields`, ToastAndroid.LONG);
      return;
    }

    console.log('Form data:', formValues);
    const body = {
      ...formValues,
      ...extraFields,
      state: newState,
      ...(editValue && {uid: editValue.uid}),
    };

    const net = await NetInfo.fetch();

    if (!net.isConnected) {
      const pendingQueue =
        JSON.parse(await AsyncStorage.getItem('pendingSubmissions')) || [];
      pendingQueue.push(formValues);
      await AsyncStorage.setItem(
        'pendingSubmissions',
        JSON.stringify(pendingQueue),
      );
      ToastAndroid.show(
        'Saved locally. Will sync when online.',
        ToastAndroid.SHORT,
      );
      return;
    }

    try {
      const response = await postStoryApi(body, CreateStoryApi(false));
      if (response) {
        ToastAndroid.show(`story saved in ${newState}`, ToastAndroid.SHORT);
      }
      console.log('POST Response:', response);
    } catch (error) {
      console.error('POST Error:', error);
    }
  };

  const handleSchedule = selectedDate => {
    const formatted = formatDateTime(selectedDate);
    console.log('Scheduled for:', formatted);
    setModalVisible(false);
    handleSubmit('SCHEDULED', {schedule_time: formatted});
    // do something with date (e.g., store in form state)
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isDirty) {
        console.log('⏳ Auto-saving form...');
        try {
          const autoSaveResponse = await postStoryApi(
            formValues,
            CreateStoryApi(true),
          );
          console.log('✅ Auto-save response:', autoSaveResponse);
          setIsDirty(false); // Reset dirty flag
        } catch (error) {
          console.error('❌ Auto-save error:', error);
        }
      }
    }, 10000); // every 10 sec

    return () => clearInterval(interval); // cleanup on unmount
  }, [isDirty, formValues]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async state => {
      if (state.isConnected && userData?.sessionId) {
        console.log('state.isConnected', state.isConnected);
        setNetStatus(state.isConnected);
        const queue =
          JSON.parse(await AsyncStorage.getItem('pendingSubmissions')) || [];

        if (queue.length > 0) {
          ToastAndroid.show(
            'Online detected - syncing pending submissions...',
            ToastAndroid.SHORT,
          );
          console.log('📡 Online detected - syncing pending submissions...');

          for (const form of queue) {
            try {
              await postStoryApi(form, CreateStoryApi(true));
            } catch (err) {
              console.error('❌ Failed syncing a form:', err);
            }
          }

          await AsyncStorage.removeItem('pendingSubmissions');
          ToastAndroid.show(
            'Offline drafts synced successfully!',
            ToastAndroid.SHORT,
          );
        }
      }
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, [userData]);

  const initializeFormValues = layoutData => {
    if (initialized || !layoutData) return;

    const initialValues = {
      ...formValues,
      ...(editValue && {uid: editValue.uid}),
    };

    // Dynamically map all fields including media
    Object.values(layoutData).forEach(section => {
      section.forEach(group => {
        group.children.forEach(field => {
          if (editValue && editValue[field.element] !== undefined) {
            // Handle media fields specifically
            if (field.input_type === 'MEDIA') {
              initialValues[field.element] =
                editValue[field.element] ||
                editValue.mediaIds ||
                editValue.media_url ||
                null;
            } else {
              initialValues[field.element] = editValue[field.element];
            }
          }
        });
      });
    });

    setFormValues(initialValues);
    setInitialized(true);
  };

  const onSectionLayout = (event, sectionKey) => {
    sectionOffsets.current[sectionKey] = event.nativeEvent.layout.y;
  };

  const onScroll = event => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const offsetEntries = Object.entries(sectionOffsets.current);
    let currentActiveIndex = 0;

    for (let i = 0; i < offsetEntries.length; i++) {
      const [key, offsetY] = offsetEntries[i];
      const nextOffsetY = offsetEntries[i + 1]?.[1] ?? Infinity;

      if (scrollY >= offsetY - 100 && scrollY < nextOffsetY - 100) {
        currentActiveIndex = i;
        break;
      }
    }

    setActiveIndex(currentActiveIndex);
  };

  const scrollToSection = index => {
    const sectionKey = headerData[index].sectionKey;
    const y = sectionOffsets.current[sectionKey];
    if (y !== undefined) {
      scrollViewRef.current?.scrollTo({y, animated: true});
      setActiveIndex(index);
    }
  };

  const RenderHeader = ({item, index}) => {
    const isActive = index === activeIndex;
    return (
      <TouchableOpacity onPress={() => scrollToSection(index)}>
        <View style={styles.headerItemContainer}>
          <View
            style={[
              styles.headerCircle,
              {
                borderColor: isActive
                  ? Apptheme.color.primary
                  : Apptheme.color.boxOutline,
                backgroundColor: isActive
                  ? Apptheme.color.primary
                  : 'transparent',
              },
            ]}>
            <Text
              style={[
                FontStyle.headingSmall,
                {
                  color: isActive
                    ? Apptheme.color.background
                    : Apptheme.color.primary,
                },
              ]}>
              {item?.number}
            </Text>
          </View>
          <Gap m2 />
          <Text
            style={[
              FontStyle.titleSmall,
              styles.headerLabel,
              {
                color: isActive ? Apptheme.color.primary : Apptheme.color.text,
              },
            ]}>
            {item?.heading}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  console.log('netStatus', netStatus);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <View style={styles.container}>
        <StatusBar backgroundColor={Apptheme.color.primary} />
        <View style={styles.topBar}>
          <Text style={[FontStyle.headingLarge, styles.topBarTitle]}>
            Create Story {netStatus ? 'online' : 'offline'}
          </Text>
          <Gap m9 />
          <Gap m3 />
        </View>

        {data?
        <>
          <View style={styles.fixedHeader}>
            <FlatList
              ref={flatListRef}
              data={headerData}
              renderItem={({item, index}) => (
                <RenderHeader item={item} index={index} />
              )}
              horizontal
              ItemSeparatorComponent={<Gap row m8 />}
              contentContainerStyle={styles.headerListContent}
              showsHorizontalScrollIndicator={false}
            />
          </View>

          <ScrollView
            style={styles.contentScroll}
            ref={scrollViewRef}
            onScroll={onScroll}
            scrollEventThrottle={16}>
            {data
              ? Object.entries(data)?.map(([sectionKey, groupList]) => (
                  <View
                    key={sectionKey}
                    onLayout={event => onSectionLayout(event, sectionKey)}>
                    <MainContainer
                      sections={groupList}
                      heading={sectionKey}
                      formValues={formValues}
                      updateFormValue={updateFormValue}
                      invalidFields={invalidFields}
                    />
                  </View>
                ))
              : null}

            <Gap m8 />

            <View style={styles.footerActions}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  gap: 10,
                }}>
                <TouchableOpacity
                  onPress={() => handleSubmit('DRAFT')}
                  style={styles.actionButton}>
                  <VectorIcon
                    material-community-icon
                    name="content-save"
                    style={styles.icon}
                    size={16}
                  />
                  <Text style={FontStyle.labelLarge}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleSubmit('SUBMITTED')}
                  style={styles.actionButton}>
                  <VectorIcon
                    material-community-icon
                    name="send"
                    style={styles.icon}
                    size={16}
                  />
                  <Text style={FontStyle.labelLarge}>Submit for review</Text>
                </TouchableOpacity>
              </View>
              {userData?.can_publish_story?
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  gap: 10,
                }}>
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  style={styles.actionButton}>
                  <VectorIcon
                    material-community-icon
                    name="calendar-month"
                    style={styles.icon}
                    size={16}
                  />
                  <Text style={FontStyle.labelLarge}>Schedule for later</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleSubmit('APPROVED')}
                  style={[
                    styles.actionButton,
                    {backgroundColor: Apptheme.color.primary},
                  ]}>
                  <VectorIcon
                    material-community-icon
                    name="plus"
                    style={styles.icon}
                    size={20}
                    color="white"
                  />
                  <Text
                    style={[
                      FontStyle.labelLarge,
                      {color: Apptheme.color.background},
                    ]}>
                    Publish now
                  </Text>
                </TouchableOpacity>
              </View>:null}
            </View>
            <ScheduleModal
              isVisible={modalVisible}
              onClose={() => setModalVisible(false)}
              onConfirm={selectedDate => handleSchedule(selectedDate)}
            />

            <Gap m8 />
          </ScrollView>
        </> : <View style={{flex:1,alignItems:'center',justifyContent:'center'}}><ActivityIndicator size="small" color="#0000ff" /></View>}
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreateStory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    backgroundColor: Apptheme.color.primary,
    padding: Apptheme.spacing.marginHorizontal,
    paddingBottom: 20,
  },
  topBarTitle: {
    color: Apptheme.color.background,
  },
  fixedHeader: {
    position: 'absolute',
    height: 90,
    width: '95%',
    backgroundColor: '#ffffff',
    elevation: 2,
    top: 55,
    zIndex: 10,
    marginHorizontal: 10,
    borderRadius: 4,
  },
  headerListContent: {
    paddingLeft: 10,
  },
  contentScroll: {
    paddingTop: 30, // So content doesn't get hidden behind header
  },
  headerItemContainer: {
    alignItems: 'center',
    paddingTop: 10,
  },
  headerCircle: {
    height: 30,
    aspectRatio: 1,
    borderRadius: 360,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLabel: {
    width: 60,
    alignSelf: 'center',
    textAlign: 'center',
  },
  footerActions: {
    padding: Apptheme.spacing.marginHorizontal,
    backgroundColor: 'white',
    elevation: 10,
    gap: 10,
    paddingBottom: 30,
  },
  actionButton: {
    flexDirection: 'row',
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Apptheme.color.containerBackground,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 5,
  },
});

// import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View, Button, Alert } from 'react-native'
// import React, { useRef } from 'react'
// import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

// const CreateStory = () => {
//   const richText = useRef();

//   const handleConfirm = async () => {
//     const contentHtml = await richText.current?.getContentHtml();
//     console.log("Final HTML:", contentHtml);

//     Alert.alert("Content Stored As:", contentHtml.substring(0, 100) + '...'); // just showing part of it
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.container}
//     >
//       <ScrollView contentContainerStyle={styles.scroll}>
//         <RichEditor
//           ref={richText}
//           style={styles.rich}
//           placeholder="Start writing here..."
//           onChange={(text) => {
//             console.log("Rich Text (onChange):", text); // HTML string
//           }}
//         />

//         {/* Confirm Button */}
//         <View style={styles.confirmContainer}>
//           <Button title="Confirm" onPress={handleConfirm} />
//         </View>
//       </ScrollView>

//       <RichToolbar
//         editor={richText}
//         actions={[
//           actions.setBold,
//           actions.setItalic,
//           actions.setUnderline,
//           actions.heading1,
//           actions.heading2,
//           actions.insertBulletsList,
//           actions.insertOrderedList,
//           actions.insertImage,
//           'customInsertVideo',
//           actions.insertLink,
//           actions.setStrikethrough,
//           actions.setSubscript,
//           actions.setSuperscript,
//           actions.removeFormat,
//           actions.undo,
//           actions.redo,
//           actions.checkboxList,
//         ]}
//         iconMap={{
//           customInsertVideo: () => (
//             <Text style={{ fontWeight: 'bold', fontSize: 19, color: 'black' }}>vi🎥</Text>
//           ),
//         }}
//         onPress={(action) => {
//           if (action === 'customInsertVideo') {
//             console.log('Video button clicked');
//             const videoUrl = 'https://www.w3schools.com/html/mov_bbb.mp4';
//             richText.current?.insertVideo(videoUrl);
//           }
//         }}
//         onPressAddImage={() => {
//           const imageUrl = "https://images.unsplash.com/photo-1742943892627-f7e4ddf91224?w=900&auto=format&fit=crop&q=60";
//           richText.current?.insertImage(imageUrl);
//         }}
//         style={styles.richBar}
//       />
//     </KeyboardAvoidingView>
//   );
// };

// export default CreateStory;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   scroll: {
//     padding: 16,
//     paddingBottom: 80,
//   },
//   rich: {
//     borderColor: '#ccc',
//     borderWidth: 1,
//     minHeight: 300,
//     borderRadius: 10,
//     padding: 10,
//   },
//   richBar: {
//     backgroundColor: '#f5f5f5',
//     borderTopWidth: 1,
//     borderColor: '#ccc',
//   },
//   confirmContainer: {
//     marginTop: 20,
//   },
// });
