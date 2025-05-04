import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Apptheme from '../../assets/theme/Apptheme';
import FontStyle from '../../assets/theme/FontStyle';
import VectorIcon from '../../assets/vectorIcons';
import {useNavigation} from '@react-navigation/native';
import DropdownWithModal from '../../components/atoms/DropdownWithModal';
import {useSelector} from 'react-redux';
import useApi from '../../apiServices/UseApi';
import {GetPromotedNewsUrl, FetchStoryApi} from '../../apiServices/apiHelper';
import Gap from '../../components/atoms/Gap';

const PromotedNews = () => {
  const navigation = useNavigation();
  const categoriesData = useSelector(
    state => state.metaData.categories.categories,
  );
  const userData = useSelector(state => state.login.userData);
  const sessionId = userData?.sessionId;

  const [categoryId, setCategoryId] = useState(null);
  const [newsSlots, setNewsSlots] = useState(Array(9).fill(null)); // 9 slots
  const [selectedFromAdditional, setSelectedFromAdditional] = useState([]);

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

  useEffect(() => {
    if (sessionId && categoryId) {
      const url = GetPromotedNewsUrl(sessionId, categoryId);
      fetchPromotedNews(null, url);
    }
  }, [categoryId, sessionId]);

  useEffect(() => {
    if (sessionId && categoryId) {
      const url = FetchStoryApi(
        0, 20, sessionId,
        undefined, undefined,
        undefined, undefined,
        categoryId
      );
      fetchAdditionalNews(null, url);
    }
  }, [categoryId]);

  useEffect(() => {
    // Fill 9 slots with promoted news and placeholders
    const filledSlots = Array(9).fill(null);
    promotedNews?.news?.forEach((item, index) => {
      if (index < 9) filledSlots[index] = item;
    });
    setNewsSlots(filledSlots);
  }, [promotedNews]);

  const handleSelectAdditionalNews = (index, item) => {
    const updatedSlots = [...newsSlots];
    updatedSlots[index] = item;
    setNewsSlots(updatedSlots);
    setSelectedFromAdditional(prev => [...prev, item.id]);
  };

  const RenderItem = ({item, index}) => {
    if (!item) {
      return (
        <TouchableOpacity
          style={[styles.rowContainer, {alignItems: 'center'}]}
          onPress={() => {}}>
          <Text style={{color: '#aaa'}}>Empty Slot #{index + 1}</Text>

          <FlatList
            data={additionalNews?.news?.filter(
              n => !selectedFromAdditional.includes(n.id),
            )}
            keyExtractor={item => item.id}
            horizontal
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => handleSelectAdditionalNews(index, item)}>
                <Text style={{fontSize: 12}}>{item.heading}</Text>
              </TouchableOpacity>
            )}
          />
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.rowContainer}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.priority}>Priority: {index + 1}</Text>
          <TouchableOpacity onPress={() => handleDelete(index)}>
            <VectorIcon
              material-community-icon
              name="delete"
              size={18}
              color="red"
            />
          </TouchableOpacity>
        </View>
        <Gap m2 />
        <TextInput
          style={styles.input}
          value={`${item?.newsId ?? ''} ${item.heading ?? ''}`}
          editable={false}
          multiline
        />
        <Text style={[FontStyle.headingSmall, {fontSize: 13}]}>
          Promotion Details:{' '}
          <Text style={FontStyle.title}>{item?.promotion ?? 'N/A'}</Text>
        </Text>
        <Text style={[FontStyle.headingSmall, {fontSize: 13}]}>
          News Created Date:{' '}
          <Text style={FontStyle.title}>{item?.date_news ?? 'N/A'}</Text>
        </Text>
        <Gap m2 />
        <TouchableOpacity style={styles.saveBtn} onPress={() => handleSave(item)}>
          <Text style={{color: 'white'}}>💾 Save</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleDelete = index => {
    const updatedSlots = [...newsSlots];
    updatedSlots[index] = null;
    setNewsSlots(updatedSlots);
  };

  const handleSave = item => {
    console.log('Saved:', item);
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
          PromotedNews
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
          />
        )}

        {promotedLoading || additionalLoading ? (
          <ActivityIndicator size="large" color={Apptheme.color.primary} />
        ) : (
          <FlatList
            data={newsSlots}
            keyExtractor={(item, index) => (item?.id ?? 'empty') + index}
            contentContainerStyle={{paddingBottom: 120}}
            renderItem={({item, index}) => (
              <RenderItem item={item} index={index} />
            )}
          />
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
  priority: {fontWeight: 'bold', marginBottom: 5, color: 'black'},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 6,
    borderRadius: 5,
    marginBottom: 5,
    color: 'black',
  },
  saveBtn: {
    backgroundColor: Apptheme.color.primary,
    padding: 6,
    borderRadius: 5,
    alignItems: 'center',
  },
  selectButton: {
    backgroundColor: '#eee',
    padding: 5,
    margin: 4,
    borderRadius: 4,
    borderColor: '#ccc',
    borderWidth: 1,
  },
});
