import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Apptheme from '../../assets/theme/Apptheme';
import FontStyle from '../../assets/theme/FontStyle';
import VectorIcon from '../../assets/vectorIcons';
import {useNavigation} from '@react-navigation/native';
import DropdownWithModal from '../../components/atoms/DropdownWithModal';
import {useSelector} from 'react-redux';
import useApi from '../../apiServices/UseApi';
import {
  GetPromotedNewsUrl,
  FetchStoryApi,
  UpdatePromotedNews,
} from '../../apiServices/apiHelper';
import Gap from '../../components/atoms/Gap';

const PromotedNews = () => {
  const navigation = useNavigation();
  const categoriesData = useSelector(
    state => state.metaData.categories.categories,
  );
  const userData = useSelector(state => state.login.userData);
  const sessionId = userData?.sessionId;

  const [categoryId, setCategoryId] = useState(null);
  const [newsSlots, setNewsSlots] = useState(Array(9).fill(null));
  const [selectedNewsIds, setSelectedNewsIds] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [updating, setUpdating] = useState(false);

  const {
    data: promotedNews,
    loading: promotedLoading,
    callApi: fetchPromotedNews,
  } = useApi({method: 'GET', manual: true});

  console.log('promotedNewspromotedNews', promotedNews);

  const {
    data: additionalNews,
    loading: additionalLoading,
    callApi: fetchAdditionalNews,
  } = useApi({method: 'GET', manual: true});

  const {
    postData: updatePromotedNews,
    loading: updateLoading,
    error: updateError,
  } = useApi({method: 'POST', manual: true});

  useEffect(() => {
    if (sessionId && categoryId) {
      const url = GetPromotedNewsUrl(sessionId, categoryId);
      fetchPromotedNews(null, url);
    }
  }, [categoryId, sessionId]);

  useEffect(() => {
    if (sessionId && categoryId) {
      const url = FetchStoryApi(
        0, // startIndex
        20, // count
        sessionId,
        undefined, // newsIds
        undefined, // state
        undefined, // fromDate
        undefined, // toDate
        categoryId, // categoryIds
        undefined, // search
        undefined, // authorIds
        undefined, // tags
      );
      fetchAdditionalNews(null, url);
    }
  }, [categoryId, sessionId]);

  useEffect(() => {
    if (promotedNews?.news) {
      // Initialize all slots as null first
      const updatedSlots = Array(9).fill(null);
      const updatedSelectedIds = [];

      // Fill slots based on priority from API response
      promotedNews.news.forEach(item => {
        if (item.priority && item.priority >= 1 && item.priority <= 9) {
          updatedSlots[item.priority - 1] = item;
          updatedSelectedIds.push(item.newsId);
        }
      });

      setNewsSlots(updatedSlots);
      setSelectedNewsIds(updatedSelectedIds);
    }
  }, [promotedNews]);

  const updatePromotedNewsApi = async (
    newsId,
    priority,
    action = undefined,
  ) => {
    if (!categoryId || !newsId) return;

    setUpdating(true);
    try {
      const url = UpdatePromotedNews(
        newsId,
        categoryId,
        sessionId,
        action, // 'delete' or undefined
        priority,
      );

      const response = await updatePromotedNews(null, url);
      console.log('API Response:', response);

      if (response?.status === 'Success') {
        // Refresh promoted news after successful update
        const promotedUrl = GetPromotedNewsUrl(sessionId, categoryId);
        await fetchPromotedNews(null, promotedUrl);
      } else {
        Alert.alert(
          'Error',
          response?.message || 'Failed to update promoted news',
        );
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update promoted news');
    } finally {
      setUpdating(false);
    }
  };

  const handleSelectNews = async (index, item) => {
    if (!item) return;

    // Calculate priority (index + 1)
    const priority = index + 1;

    // Update the API first
    await updatePromotedNewsApi(item.newsId, priority);

    // The state will be updated automatically when the promotedNews refreshes
  };

  const handleRemoveNews = async index => {
    const item = newsSlots[index];
    if (!item) return;

    
    const priority = index + 1;

    
    await updatePromotedNewsApi(item.newsId, priority, 'delete');

    
  };

  const RenderItem = ({item, index}) => {
    const priority = index + 1;


    return (
      <View style={styles.rowContainer}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.priority}>Priority: {priority}</Text>
          {item ? (
            <TouchableOpacity
              onPress={() => handleRemoveNews(index)}
              disabled={updating}>
              <VectorIcon
                material-community-icon
                name="delete"
                size={18}
                color="red"
              />
            </TouchableOpacity>
          ) : null}
        </View>
        <Gap m2 />

        {item ? (
          <TouchableOpacity onPress={() => setDropdownVisible(priority)}>
            <TextInput
              style={styles.input}
              value={`${item.newsId} ${item.heading}`}
              editable={false}
              multiline
            />
            <Text style={[FontStyle.headingSmall, {fontSize: 13}]}>
              News Created Date:{' '}
              <Text style={FontStyle.title}>{item.date_news || 'N/A'}</Text>
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setDropdownVisible(priority)} 
            disabled={updating}>
            <Text style={{color: '#aaa'}}>Select News1</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          padding: Apptheme.spacing.marginHorizontal,
          backgroundColor: Apptheme.color.primary,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <VectorIcon
            material-icon
            name="arrow-back-ios"
            color={Apptheme.color.background}
            size={18}
            style={{marginRight: 10}}
          />
        </TouchableOpacity>
        <Text
          style={[FontStyle.headingLarge, {color: Apptheme.color.background}]}>
          Promoted News
        </Text>
      </View>

      <View style={{padding: Apptheme.spacing.marginHorizontal}}>
        {Array.isArray(categoriesData) && (
          <DropdownWithModal
            label="Select Category"
            options={categoriesData.map(cat => ({
              label: cat.name,
              value: cat.catId,
            }))}
            onSelect={val => setCategoryId(val)}
            disabled={updating}
          />
        )}

        {promotedLoading || additionalLoading ? (
          <>
          {console.log('loading1')}
          <ActivityIndicator size="large" color={Apptheme.color.primary} />
          </>
        ) : (
          <>
            {updating ? (
              <>
          {console.log('loading2')}

              <ActivityIndicator size="large" color={Apptheme.color.primary} />
              </>
            ) : (
              promotedNews?
              <FlatList
                data={newsSlots}
                keyExtractor={(item, index) =>
                  (item?.newsId || 'empty') + index
                }
                contentContainerStyle={{paddingBottom: 120}}
                renderItem={({item, index}) => (
                  <RenderItem item={item} index={index} />
                )}
              />: null
            )}

            {/* News Selection Dropdown Modal */}
            <Modal
              transparent
              visible={dropdownVisible !== null}
              onRequestClose={() => setDropdownVisible(null)}>
              <View style={styles.modalOverlay}>
                <View style={styles.dropdownContainer}>
                  <View style={{justifyContent:'space-between',alignItems:"center" ,flexDirection:'row'}}>
                    <Text style={FontStyle.headingSmall}>Select News</Text>
                    <TouchableOpacity onPress={()=>setDropdownVisible(null)}>
                    <VectorIcon material-icon name='close' size={20}/>
                    </TouchableOpacity>
                  </View>
                  {updating ? (
                    <ActivityIndicator
                      size="large"
                      color={Apptheme.color.primary}
                    />
                  ) : (
                    <FlatList
                      // data={additionalNews?.news?.filter(
                      //   news => !selectedNewsIds.includes(news.newsId),
                      // )}
                      data={additionalNews?.news}
                      keyExtractor={item => item.newsId}
                      renderItem={({item}) => (
                        <TouchableOpacity
                          style={styles.dropdownItem}
                          onPress={() => {
                            handleSelectNews(dropdownVisible - 1, item); 
                            setDropdownVisible(null);
                          }}>
                          <Text style={FontStyle.label}>
                            {item.newsId} - {item.heading}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  )}
                </View>
              </View>
            </Modal>
          </>
        )}
      </View>
    </View>
  );
};

export default PromotedNews;

const styles = StyleSheet.create({
  rowContainer: {
    borderWidth: 1,
    borderColor: Apptheme.color.boxOutline,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  priority: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 6,
    borderRadius: 5,
    marginBottom: 5,
    color: 'black',
  },
  selectButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    maxHeight: '60%',
    padding: 10,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
