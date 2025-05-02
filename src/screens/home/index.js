import {ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, { useEffect, useState } from 'react';
import VectorIcon from '../../assets/vectorIcons';
import FontStyle from '../../assets/theme/FontStyle';
import Gap from '../../components/atoms/Gap';
import Apptheme from '../../assets/theme/Apptheme';
import SummaryReportCard from '../../components/molecules/SummaryReportCard';
import useApi from '../../apiServices/UseApi';
import { CategoryList, ConfigList, LocationList, TagsList } from '../../apiServices/apiHelper';
import { useDispatch, useSelector } from 'react-redux';
import { setCategories, setConfigs, setLocations, setTags } from '../../redux/reducer/MetaDataSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { SyncPendingSubmissions } from '../../components/molecules/SyncPendingSubmissions';

const Home = () => {

  const [selectedTime, setSelectedTime] = useState('1h');
  const dispatch = useDispatch();
  const userData = useSelector(state => state.login.userData);

  const {callApi: postStoryApi} = useApi({
    method: 'POST',
    url: '',
    manual: true,
    cmsUrl: true,
  });

  useEffect(() => {
    if (userData?.sessionId) {
      SyncPendingSubmissions(postStoryApi);
    }
  }, [userData]);

  const {loading, callApi} = useApi({
    method: 'GET',
    url: '',
    manual: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const net = await NetInfo.fetch();
        const isConnected = net.isConnected;
  
        if (!isConnected) {
          // Read from AsyncStorage if offline
          const [cat, loc, tags, config] = await Promise.all([
            AsyncStorage.getItem('OfflineCategories'),
            AsyncStorage.getItem('OfflineLocations'),
            AsyncStorage.getItem('OfflineTags'),
            AsyncStorage.getItem('OfflineConfigs'),
          ]);
  
          if (cat) dispatch(setCategories(JSON.parse(cat)));
          if (loc) dispatch(setLocations(JSON.parse(loc)));
          if (tags) dispatch(setTags(JSON.parse(tags)));
          if (config) dispatch(setConfigs(JSON.parse(config)));
          return;
        }
  
        // Online: fetch from API
        const [res, locationres, Tagsres, Configres] = await Promise.all([
          callApi(null, CategoryList()),
          callApi(null, LocationList()),
          callApi(null, TagsList()),
          callApi(null, ConfigList()),
        ]);
  
        if (res) {
          await AsyncStorage.setItem('OfflineCategories', JSON.stringify(res));
          dispatch(setCategories(res));
        }
  
        if (locationres) {
          await AsyncStorage.setItem('OfflineLocations', JSON.stringify(locationres));
          dispatch(setLocations(locationres));
        }
  
        if (Tagsres) {
          await AsyncStorage.setItem('OfflineTags', JSON.stringify(Tagsres));
          dispatch(setTags(Tagsres));
        }
  
        if (Configres) {
          await AsyncStorage.setItem('OfflineConfigs', JSON.stringify(Configres));
          dispatch(setConfigs(Configres));
        }
  
      } catch (error) {
        console.error('Error fetching data with offline fallback:', error);
      }
    };
  
    fetchData();
  }, [dispatch]);
  

  return (
    <>
      <StatusBar backgroundColor={Apptheme.color.primary} />
      <View
        style={{
          backgroundColor: Apptheme.color.primary,
          padding: Apptheme.spacing.marginHorizontal,
        }}>
        <Gap m8 />
        <Text
          style={[FontStyle.headingLarge, {color: Apptheme.color.background}]}>
          Welcome, Vishakha Yadav
        </Text>
        <Gap m5 />
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
          <Text style={[FontStyle.label, {color: Apptheme.color.background}]}>
            OVERALL REPORT
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {['1h', '12h', '24h', '1w'].map((time) => (
              <TouchableOpacity key={time} onPress={() => setSelectedTime(time)}>
                <Text
                  style={[
                    FontStyle.label,
                    {
                      color: selectedTime === time ? Apptheme.color.primary : Apptheme.color.background,
                      paddingHorizontal: 4,
                      backgroundColor: selectedTime === time ? Apptheme.color.background : 'transparent',
                      borderRadius: 2,
                    },
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: Apptheme.color.background,
        }}>
        <Gap m3 />
        <View style={{padding: Apptheme.spacing.marginHorizontal}}>
         <SummaryReportCard title={'Social Share'} count={'0'}/>
         <SummaryReportCard title={'Social Share'} count={'0'}/>
         <SummaryReportCard title={'Social Share'} count={'0'}/>
         <SummaryReportCard title={'Social Share'} count={'0'}/>
        </View>
      </ScrollView>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({});
