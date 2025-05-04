import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Apptheme from '../../assets/theme/Apptheme';
import FontStyle from '../../assets/theme/FontStyle';
import VectorIcon from '../../assets/vectorIcons';
import {useNavigation} from '@react-navigation/native';
import DropdownWithModal from '../../components/atoms/DropdownWithModal';
import {useSelector} from 'react-redux';
import useApi from '../../apiServices/UseApi';
import { GetPromotedNewsUrl } from '../../apiServices/apiHelper';

const PromotedNews = () => {
  const navigation = useNavigation();
  const categoriesData = useSelector(
    state => state.metaData.categories.categories,
  );
  
  const userData = useSelector(state => state.login.userData);
  const sessionId = userData?.sessionId
  const [categoryId, setCategoryId] = useState(null);

  const {
    data: promotedNews,
    loading,
    error,
    callApi: fetchPromotedNews,
  } = useApi({
    method: 'GET',
    manual: true, // don't auto fetch
  });

  // Fetch when categoryId changes
  useEffect(() => {
    if (sessionId && categoryId) {
      const url = GetPromotedNewsUrl(sessionId, categoryId);
      fetchPromotedNews(null, url);
    }
  }, [categoryId, sessionId]);

  

  console.log('hello123456categoriesData', promotedNews);
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

        
      </View>
    </View>
  );
};

export default PromotedNews;

const styles = StyleSheet.create({});
