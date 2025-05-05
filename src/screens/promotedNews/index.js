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
import {GetPromotedNewsUrl, FetchStoryApi, UpdatePromotedNews} from '../../apiServices/apiHelper';
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
        undefined // tags
      );
      fetchAdditionalNews(null, url);
    }
  }, [categoryId, sessionId]);

  useEffect(() => {
    if (promotedNews?.news) {
      const updatedSlots = [...newsSlots];
      promotedNews.news.forEach((item, index) => {
        if (index < 9) {
          updatedSlots[index] = item;
          setSelectedNewsIds(prev => [...prev, item.newsId]);
        }
      });
      setNewsSlots(updatedSlots);
    }
  }, [promotedNews]);

  const updatePromotedNewsApi = async (newsIds) => {
    if (!categoryId || !newsIds.length) return;
    
    setUpdating(true);
    try {
      const url = UpdatePromotedNews(
        newsIds.join(','),
        categoryId,
        sessionId
      );
      
      const response = await updatePromotedNews(null, url);
      
      if (response) {
        // Refresh promoted news after successful update
        const promotedUrl = GetPromotedNewsUrl(sessionId, categoryId);
        await fetchPromotedNews(null, promotedUrl);
      } else {
        Alert.alert('Error', 'Failed to update promoted news');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update promoted news');
    } finally {
      setUpdating(false);
    }
  };

  const handleSelectNews = async (index, item) => {
    if (!item) return;
    
    const updatedSlots = [...newsSlots];
    const updatedSelectedIds = [...selectedNewsIds];
    
    // Remove previous selection if exists
    if (updatedSlots[index]) {
      const prevId = updatedSlots[index].newsId;
      updatedSelectedIds.splice(updatedSelectedIds.indexOf(prevId), 1);
    }
    
    // Add new selection
    updatedSlots[index] = item;
    updatedSelectedIds.push(item.newsId);
    
    setNewsSlots(updatedSlots);
    setSelectedNewsIds(updatedSelectedIds);
    setDropdownVisible(null);
    
    // Immediately update the promoted news with the new selection
    await updatePromotedNewsApi([item.newsId]);
  };

  const handleRemoveNews = async (index) => {
    const updatedSlots = [...newsSlots];
    const updatedSelectedIds = [...selectedNewsIds];
    
    if (updatedSlots[index]) {
      const prevId = updatedSlots[index].newsId;
      updatedSelectedIds.splice(updatedSelectedIds.indexOf(prevId), 1);
      
      // Update API to remove this news
      await updatePromotedNewsApi(updatedSelectedIds);
    }
    
    updatedSlots[index] = null;
    setNewsSlots(updatedSlots);
    setSelectedNewsIds(updatedSelectedIds);
  };

  const RenderItem = ({item, index}) => {
    return (
      <View style={styles.rowContainer}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.priority}>Priority: {index + 1}</Text>
          {item && (
            <TouchableOpacity 
              onPress={() => handleRemoveNews(index)}
              disabled={updating}
            >
              {updating ? (
                <ActivityIndicator size="small" color="red" />
              ) : (
                <VectorIcon
                  material-community-icon
                  name="delete"
                  size={18}
                  color="red"
                />
              )}
            </TouchableOpacity>
          )}
        </View>
        <Gap m2 />
        
        {item ? (
          <>
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
          </>
        ) : (
          <TouchableOpacity 
            style={styles.selectButton} 
            onPress={() => setDropdownVisible(index)}
            disabled={updating}
          >
            {updating ? (
              <ActivityIndicator size="small" color="#aaa" />
            ) : (
              <Text style={{color: '#aaa'}}>Select News</Text>
            )}
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
          <ActivityIndicator size="large" color={Apptheme.color.primary} />
        ) : (
          <>
            <FlatList
              data={newsSlots}
              keyExtractor={(item, index) => (item?.newsId || 'empty') + index}
              contentContainerStyle={{paddingBottom: 120}}
              renderItem={({item, index}) => (
                <RenderItem item={item} index={index} />
              )}
            />
            
            {/* News Selection Dropdown Modal */}
            <Modal
              transparent
              visible={dropdownVisible !== null}
              onRequestClose={() => setDropdownVisible(null)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.dropdownContainer}>
                  {updating ? (
                    <ActivityIndicator size="large" color={Apptheme.color.primary} />
                  ) : (
                    <FlatList
                      data={additionalNews?.news?.filter(
                        news => !selectedNewsIds.includes(news.newsId)
                      )}
                      keyExtractor={item => item.newsId}
                      renderItem={({item}) => (
                        <TouchableOpacity
                          style={styles.dropdownItem}
                          onPress={() => handleSelectNews(dropdownVisible, item)}
                        >
                          <Text style={FontStyle.label}>{item.newsId} - {item.heading}</Text>
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
    color: 'black'
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