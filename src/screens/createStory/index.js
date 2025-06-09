import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
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

import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import ScheduleModal from '../../components/atoms/ScheduleModal';
import {formatDateTime} from '../../components/utils';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {SyncPendingSubmissions} from '../../components/molecules/SyncPendingSubmissions';
import RouteName from '../../navigation/RouteName';
import { triggerStoryRefresh } from '../../redux/reducer/StoryUpdateSlice';

const CreateStory = () => {
  const scrollViewRef = useRef(null);
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const userData = useSelector(state => state.login.userData);
  const isFocused = useIsFocused();
  console.log('userDatauserDatauserDatauserData', userData);
  const [isConnected,setIsConnected]=useState(true)
  const [isDirty, setIsDirty] = useState(false);
  const [data, setData] = useState();
  const [headerData, setHeaderData] = useState([]);
  const [netStatus, setNetStatus] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [invalidFields, setInvalidFields] = useState([]);
  const [newStoryModal, setNewStoryModal] = useState(false);
  const [newsModal, setNewsModal] = useState(false);
  const [publishStatus, setPublishStatus] = useState('');
  const [idresponse, setIdResponse] = useState({});
  const dispatch = useDispatch()

  const route = useRoute();
  const [initialized, setInitialized] = useState(false);
  const navigation = useNavigation();
  const editValue = route.params?.data;
  console.log('editValue1', editValue);

  const generateId = existingId => {
    return (
      existingId ||
      Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
    );
  };
  const [formValues, setFormValues] = useState({
    action: 'create_multipage',
    tempProcessId: generateId(editValue?.tempProcessId),
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
        console.log('res12345678987654', res);
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

  console.log('formValuesformValuessdfvgbfvdcsx', formValues);

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

  const handleNewStory = () => {
    // Reset form values (keep sessionId and action)

    setFormValues({
      action: 'create_multipage',
      tempProcessId: generateId(),
      sessionId: userData?.sessionId,
      state: 'DRAFT',
    });

    // Clear edit data (if any)
    if (route.params?.data) {
      navigation.setParams({data: undefined}); // Optional: Remove edit data from route
    }

    // Reset UI states
    setIdResponse({});
    setActiveIndex(0);
    setInvalidFields([]);
    setIsDirty(false);
    setInitialized(false);

    // Scroll back to top
    scrollViewRef.current?.scrollTo({y: 0, animated: true});
    flatListRef.current?.scrollToIndex({index: 0, animated: true});
    setNewStoryModal(false);

    ToastAndroid.show('New story started!', ToastAndroid.SHORT);
  };

  const handleSubmit = async (newState = 'DRAFT', extraFields = {}) => {
    const missingFields = validateMandatoryFields(data, formValues);
    console.log('missingFields', missingFields);

    if (
      (newState == 'APPROVED' ||
        newState == 'SCHEDULED' ||
        newState == 'SUBMITTED') &&
      missingFields.length > 0
    ) {
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

    console.log('2345432body', body);

    if (!net.isConnected) {
      const pendingQueue =
        JSON.parse(await AsyncStorage.getItem('pendingSubmissions')) || [];
      // pendingQueue.push(body);

      const index = pendingQueue.findIndex(
        item => item.tempProcessId === body.tempProcessId,
      );

      if (index !== -1) {
        // If it exists, update the item
        pendingQueue[index] = body;
      } else {
        // If it doesn't exist, push it as new
        pendingQueue.push(body);
      }

      await AsyncStorage.setItem(
        'pendingSubmissions',
        JSON.stringify(pendingQueue),
      );
      console.log('pendingQueue', pendingQueue);
      ToastAndroid.show(
        'Saved locally. Will sync when online.',
        ToastAndroid.SHORT,
      );
      if (
        newState == 'APPROVED' ||
        newState == 'SCHEDULED' ||
        newState == 'SUBMITTED'
      ) {
        handleNewStory();
      }
      return;
    }

    try {
      const response = await postStoryApi(body, CreateStoryApi(false));
      if (response) {
        dispatch(
                  triggerStoryRefresh({
                    id:1,
                    action: 'refres',
                  }),
                );
        ToastAndroid.show(`story saved in ${newState}`, ToastAndroid.SHORT);
        navigation.navigate(RouteName.BOTTOM_TAB, {
          screen: RouteName.VIEW_STORY,
          params: {
            tab:newState
            // data: data,
          },
        });
        if (
          newState == 'APPROVED' ||
          newState == 'SCHEDULED' ||
          newState == 'SUBMITTED'
        ) {
          handleNewStory();
          setNewsModal(false);
        } else {
          setIdResponse(response);
        }
        
        scrollViewRef.current?.scrollTo({y: 0, animated: true});
        flatListRef.current?.scrollToIndex({index: 0, animated: true});
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

  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     console.log('isDirtyisDirty',isDirty)
  //     if (isDirty) {
  //       console.log('⏳ Auto-saving form...');
  //       try {
  //         const autoSaveResponse = await postStoryApi(
  //           formValues,
  //           CreateStoryApi(true),
  //         );
  //         console.log('✅ Auto-save response:', autoSaveResponse);
  //         setIsDirty(false); // Reset dirty flag
  //       } catch (error) {
  //         console.error('❌ Auto-save error:', error);
  //       }
  //     }
  //   }, 10000); // every 10 sec

  //   return () => clearInterval(interval); // cleanup on unmount
  // }, [isDirty, formValues]);

  useEffect(() => {
    if (!isFocused) return;
    const interval = setInterval(async () => {
      console.log('⏳ Auto-saving form...');
      try {
        const autoSaveResponse = await postStoryApi(
          formValues,
          CreateStoryApi(true),
        );
        console.log('✅ Auto-save response:', autoSaveResponse);
      } catch (error) {
        console.error('❌ Auto-save error:', error);
      }
    }, 5000); // every 5 seconds
  
    return () => clearInterval(interval); // cleanup on unmount
  }, [formValues,isFocused]); // Only re-run if formValues changes

  const offlineData = AsyncStorage.getItem('pendingSubmissions');
  console.log('offlineData', offlineData);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async state => {
      if (state.isConnected && userData?.sessionId) {
        console.log('state.isConnected', state.isConnected);
        setNetStatus(state.isConnected);
        if (state.isConnected) {
          SyncPendingSubmissions(postStoryApi);
        }
        const queue =
          JSON.parse(await AsyncStorage.getItem('pendingSubmissions')) || [];

        if (queue.length > 0) {
          ToastAndroid.show(
            'Online detected - syncing pending submissions...',
            ToastAndroid.SHORT,
          );
          console.log('📡 Online detected - syncing pending submissions...');

          for (const form of queue) {
            console.log('form234567898765432', form);
            try {
              await postStoryApi(form, CreateStoryApi(false));
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


  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const initializeFormValues = layoutData => {
    if (initialized || !layoutData) return;

    const initialValues = {
      ...formValues,
      tempProcessId: editValue?.tempProcessId || formValues.tempProcessId,
      ...(editValue && {uid: editValue.uid}),
    };

    // Dynamically map all fields including media
    Object.values(layoutData).forEach(section => {
      section.forEach(group => {
        group.children.forEach(field => {
          if (editValue && editValue[field.element] !== undefined) {
            // Handle media fields specifically
            // if (field.input_type === 'MEDIA') {
            //   initialValues[field.element] =
            //     editValue[field.element] ||
            //     editValue.mediaIds ||
            //     editValue.media_url ||
            //     null;
            // } else {
            initialValues[field.element] = editValue[field.element];
            // }
          }
        });
      });
    });
    console.log('initialValues', initialValues);

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
    <SafeAreaView style={{flex: 1,backgroundColor:Apptheme.color.primary}}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1,backgroundColor:Apptheme.color.containerBackground}}>
      <View style={styles.container}>
        {!isConnected && (
          <View
            style={{
              backgroundColor: Apptheme.color.containerBackground,
              paddingVertical: 6,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            <VectorIcon
              name="wifi-off"
              material-icon
              color={Apptheme.color.red}
              size={18}
            />
            <Gap row m3 />
            <Text style={FontStyle.labelMedium}>You are offline</Text>
          </View>
        )}
        <StatusBar backgroundColor={Apptheme.color.primary} />
        <View style={styles.topBar}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={[FontStyle.headingLarge, styles.topBarTitle]}>
              Create Story
              {idresponse?.storyId && (
                <Text
                  style={[
                    FontStyle.labelLarge,
                    {color: Apptheme.color.background},
                  ]}>
                  {' '}
                  - {idresponse?.storyId}
                </Text>
              )}
              {/* {netStatus ? 'online' : 'offline'} */}
            </Text>
            <TouchableOpacity
              // onPress={handleNewStory}
              onPress={() => setNewStoryModal(true)}
              style={{
                paddingVertical: 5,
                paddingHorizontal: 10,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                borderRadius: 4,
              }}>
              <Text
                style={[
                  FontStyle.headingSmall,
                  {color: 'black', fontSize: 12},
                ]}>
                + NEW
              </Text>
            </TouchableOpacity>
          </View>

          <Gap m9 />
          <Gap m3 />
        </View>

        {data ? (
          <>
            <View style={[styles.fixedHeader, {top: !netStatus ? 75 : 55}]}>
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
                        files={editValue?.files}
                        story_credits={editValue?.story_credits}
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
                  {isConnected && (
                    <TouchableOpacity
                      // onPress={() => handleSubmit('SUBMITTED')}
                      onPress={() => {
                        setPublishStatus('Submit');
                        setNewsModal(true);
                      }}
                      style={styles.actionButton}>
                      <VectorIcon
                        material-community-icon
                        name="send"
                        style={styles.icon}
                        size={16}
                      />
                      <Text style={FontStyle.labelLarge}>
                        Submit for review
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                {isConnected && (
                  <>
                    {userData?.can_publish_story ? (
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
                          <Text style={FontStyle.labelLarge}>
                            Schedule for later
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => {
                            setPublishStatus('Publish');
                            setNewsModal(true);
                          }}
                          // onPress={() => handleSubmit('APPROVED')}
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
                      </View>
                    ) : null}
                  </>
                )}
              </View>
              <ScheduleModal
                isVisible={modalVisible}
                onClose={() => setModalVisible(false)}
                onConfirm={selectedDate => handleSchedule(selectedDate)}
              />

              <Gap m8 />
            </ScrollView>
          </>
        ) : (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size="small" color="#0000ff" />
          </View>
        )}
      </View>

      <Modal
        transparent={true}
        visible={newStoryModal}
        onRequestClose={() => setNewStoryModal(false)}
        animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>New Story</Text>
            <Text style={styles.modalText}>
              Exit current story & create new?
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setNewStoryModal(false)}
                // disabled={clearCacheLoading}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.confirmButton,
                  // clearCacheLoading && {opacity: 0.7},
                ]}
                onPress={() => handleNewStory()}
                // disabled={clearCacheLoading}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        visible={newsModal}
        onRequestClose={() => setNewsModal(false)}
        animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Are you sure</Text>
            <Text style={styles.modalText}>
              You want to {publishStatus} this story?
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setNewsModal(false)}
                // disabled={clearCacheLoading}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.confirmButton,
                  // clearCacheLoading && {opacity: 0.7},
                ]}
                onPress={() =>
                  handleSubmit(
                    publishStatus == 'Publish'
                      ? 'APPROVED'
                      : publishStatus == 'Submit'
                      ? 'SUBMITTED'
                      : '',
                  )
                }
                // disabled={clearCacheLoading}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
    </SafeAreaView>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Apptheme.color.primary,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    color: Apptheme.color.black,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  cancelButton: {
    backgroundColor: Apptheme.color.boxOutline,
  },
  confirmButton: {
    backgroundColor: Apptheme.color.primary,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
