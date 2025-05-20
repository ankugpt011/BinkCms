// import {ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// import React, { useEffect, useState } from 'react';
// import VectorIcon from '../../assets/vectorIcons';
// import FontStyle from '../../assets/theme/FontStyle';
// import Gap from '../../components/atoms/Gap';
// import Apptheme from '../../assets/theme/Apptheme';
// import SummaryReportCard from '../../components/molecules/SummaryReportCard';
// import useApi from '../../apiServices/UseApi';
// import { CategoryList, ConfigList, LocationList, TagsList } from '../../apiServices/apiHelper';
// import { useDispatch, useSelector } from 'react-redux';
// import { setCategories, setConfigs, setLocations, setTags } from '../../redux/reducer/MetaDataSlice';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import NetInfo from '@react-native-community/netinfo';
// import { SyncPendingSubmissions } from '../../components/molecules/SyncPendingSubmissions';

// const Home = () => {

//   const [selectedTime, setSelectedTime] = useState('1h');
//   const dispatch = useDispatch();
//   const userData = useSelector(state => state.login.userData);

//   const {callApi: postStoryApi} = useApi({
//     method: 'POST',
//     url: '',
//     manual: true,
//     cmsUrl: true,
//   });

//   useEffect(() => {
//     if (userData?.sessionId) {
//       SyncPendingSubmissions(postStoryApi);
//     }
//   }, [userData]);

//   const {loading, callApi} = useApi({
//     method: 'GET',
//     url: '',
//     manual: true,
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const net = await NetInfo.fetch();
//         const isConnected = net.isConnected;

//         if (!isConnected) {
//           // Read from AsyncStorage if offline
//           const [cat, loc, tags, config] = await Promise.all([
//             AsyncStorage.getItem('OfflineCategories'),
//             AsyncStorage.getItem('OfflineLocations'),
//             AsyncStorage.getItem('OfflineTags'),
//             AsyncStorage.getItem('OfflineConfigs'),
//           ]);

//           if (cat) dispatch(setCategories(JSON.parse(cat)));
//           if (loc) dispatch(setLocations(JSON.parse(loc)));
//           if (tags) dispatch(setTags(JSON.parse(tags)));
//           if (config) dispatch(setConfigs(JSON.parse(config)));
//           return;
//         }

//         // Online: fetch from API
//         const [res, locationres, Tagsres, Configres] = await Promise.all([
//           callApi(null, CategoryList()),
//           callApi(null, LocationList()),
//           callApi(null, TagsList()),
//           callApi(null, ConfigList()),
//         ]);

//         if (res) {
//           await AsyncStorage.setItem('OfflineCategories', JSON.stringify(res));
//           dispatch(setCategories(res));
//         }

//         if (locationres) {
//           await AsyncStorage.setItem('OfflineLocations', JSON.stringify(locationres));
//           dispatch(setLocations(locationres));
//         }

//         if (Tagsres) {
//           await AsyncStorage.setItem('OfflineTags', JSON.stringify(Tagsres));
//           dispatch(setTags(Tagsres));
//         }

//         if (Configres) {
//           await AsyncStorage.setItem('OfflineConfigs', JSON.stringify(Configres));
//           dispatch(setConfigs(Configres));
//         }

//       } catch (error) {
//         console.error('Error fetching data with offline fallback:', error);
//       }
//     };

//     fetchData();
//   }, [dispatch]);

//   return (
//     <>
//       <StatusBar backgroundColor={Apptheme.color.primary} />
//       <View
//         style={{
//           backgroundColor: Apptheme.color.primary,
//           padding: Apptheme.spacing.marginHorizontal,
//         }}>
//         <Gap m8 />
//         <Text
//           style={[FontStyle.headingLarge, {color: Apptheme.color.background}]}>
//           Welcome, Vishakha Yadav
//         </Text>
//         <Gap m5 />
//         <View style={{flexDirection:'row',justifyContent:'space-between'}}>
//           <Text style={[FontStyle.label, {color: Apptheme.color.background}]}>
//             OVERALL REPORT
//           </Text>
//           <View style={{ flexDirection: 'row', gap: 12 }}>
//             {['1h', '12h', '24h', '1w'].map((time) => (
//               <TouchableOpacity key={time} onPress={() => setSelectedTime(time)}>
//                 <Text
//                   style={[
//                     FontStyle.label,
//                     {
//                       color: selectedTime === time ? Apptheme.color.primary : Apptheme.color.background,
//                       paddingHorizontal: 4,
//                       backgroundColor: selectedTime === time ? Apptheme.color.background : 'transparent',
//                       borderRadius: 2,
//                     },
//                   ]}
//                 >
//                   {time}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>
//       </View>
//       <ScrollView
//         style={{
//           flex: 1,
//           backgroundColor: Apptheme.color.background,
//         }}>
//         <Gap m3 />
//         <View style={{padding: Apptheme.spacing.marginHorizontal}}>
//          <SummaryReportCard title={'Social Share'} count={'0'}/>
//          <SummaryReportCard title={'Social Share'} count={'0'}/>
//          <SummaryReportCard title={'Social Share'} count={'0'}/>
//          <SummaryReportCard title={'Social Share'} count={'0'}/>
//         </View>
//       </ScrollView>
//     </>
//   );
// };

// export default Home;

// const styles = StyleSheet.create({});

import {
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import VectorIcon from '../../assets/vectorIcons';
import FontStyle from '../../assets/theme/FontStyle';
import Gap from '../../components/atoms/Gap';
import Apptheme from '../../assets/theme/Apptheme';
import SummaryReportCard from '../../components/molecules/SummaryReportCard';
import useApi from '../../apiServices/UseApi';
import {
  CategoryList,
  ConfigList,
  LocationList,
  TagsList,
  Dashboard,
} from '../../apiServices/apiHelper';
import {useDispatch, useSelector} from 'react-redux';
import {
  setCategories,
  setConfigs,
  setLocations,
  setTags,
} from '../../redux/reducer/MetaDataSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {SyncPendingSubmissions} from '../../components/molecules/SyncPendingSubmissions';
import dayjs from 'dayjs';

const Home = () => {
  const [selectedTime, setSelectedTime] = useState('1h');
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState(null);

  const dispatch = useDispatch();
  const userData = useSelector(state => state.login.userData);

  console.log('userSeleteor',userData)

  const {callApi: postStoryApi} = useApi({
    method: 'POST',
    url: '',
    manual: true,
    cmsUrl: true,
  });

  const {loading, callApi} = useApi({
    method: 'GET',
    url: '',
    manual: true,
  });

  // Function to calculate time range based on selection
  const getTimeRange = timePeriod => {
    const now = dayjs();
    let startTime;

    switch (timePeriod) {
      case '1h':
        startTime = now.subtract(1, 'hour');
        break;
      case '12h':
        startTime = now.subtract(12, 'hours');
        break;
      case '24h':
        startTime = now.subtract(24, 'hours');
        break;
      case '1w':
        startTime = now.subtract(1, 'week');
        break;
      default:
        startTime = now.subtract(1, 'hour');
    }

    return {
      startTime: startTime.toISOString(),
      endTime: now.toISOString(),
    };
  };

  // Fetch dashboard data
  const fetchDashboardData = async timePeriod => {
    console.log('hllloooookjihgchvbjk');
    if (!userData?.sessionId) return;

    setDashboardLoading(true);
    setDashboardError(null);

    try {
      const {startTime, endTime} = getTimeRange(timePeriod);
      const url = Dashboard(startTime, endTime, userData.sessionId);
      const data = await callApi(null, url);

      if (data) {
        setDashboardData(data);
        console.log('fetchDashboardDatafetchDashboardData', data);
        await AsyncStorage.setItem(
          'OfflineDashboard',
          JSON.stringify({
            data,
            timestamp: new Date().getTime(),
          }),
        );
      }
    } catch (error) {
      console.error('Dashboard API error:', error);
      setDashboardError(error.message || 'Failed to load dashboard data');

      // Try to load cached data if online fetch fails
      const cached = await AsyncStorage.getItem('OfflineDashboard');
      if (cached) {
        const {data, timestamp} = JSON.parse(cached);
        // Only use cached data if it's less than 1 hour old
        if (new Date().getTime() - timestamp < 3600000) {
          setDashboardData(data);
        }
      }
    } finally {
      setDashboardLoading(false);
    }
  };

  // Handle time period change
  const handleTimeChange = timePeriod => {
    setSelectedTime(timePeriod);
    fetchDashboardData(timePeriod);
  };

  useEffect(() => {
    if (userData?.sessionId) {
      SyncPendingSubmissions(postStoryApi);
      fetchDashboardData(selectedTime); // Initial fetch
    }
  }, [userData?.sessionId]);

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
          await AsyncStorage.setItem(
            'OfflineLocations',
            JSON.stringify(locationres),
          );
          dispatch(setLocations(locationres));
        }

        if (Tagsres) {
          await AsyncStorage.setItem('OfflineTags', JSON.stringify(Tagsres));
          dispatch(setTags(Tagsres));
        }

        if (Configres) {
          await AsyncStorage.setItem(
            'OfflineConfigs',
            JSON.stringify(Configres),
          );
          dispatch(setConfigs(Configres));
        }
      } catch (error) {
        console.error('Error fetching data with offline fallback:', error);
      }
    };

    fetchData();
  }, [dispatch]);

  const renderDashboardCards = () => {
    if (dashboardLoading && !dashboardData) {
      return (
        <>
          <SummaryReportCard title={'Loading...'} count={'0'} loading />
          <SummaryReportCard title={'Loading...'} count={'0'} loading />
          <SummaryReportCard title={'Loading...'} count={'0'} loading />
          <SummaryReportCard title={'Loading...'} count={'0'} loading />
        </>
      );
    }

    if (dashboardError && !dashboardData) {
      return (
        <Text
          style={[
            FontStyle.label,
            {color: Apptheme.color.error, textAlign: 'center'},
          ]}>
          {dashboardError}
        </Text>
      );
    }

    return (
      <>
        <SummaryReportCard
          title={'News Published'}
          count={dashboardData?.['news-published']?.toString() || '0'}
        />
        <SummaryReportCard
          title={'Social Share'}
          count={dashboardData?.['social-share']?.toString() || '0'}
        />
        <SummaryReportCard
          title={'Stories Share'}
          count={dashboardData?.['stories-share']?.toString() || '0'}
        />
        <SummaryReportCard
          title={'Handle Config'}
          count={dashboardData?.['handle-config']?.toString() || '0'}
        />
        <SummaryReportCard
          title={'AMP Error'}
          count={dashboardData?.['amp-error']?.toString() || '0'}
        />
      </>
    );
  };

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
          Welcome, {userData?.name}
        </Text>
        <Gap m5 />
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={[FontStyle.label, {color: Apptheme.color.background}]}>
            OVERALL REPORT
          </Text>
          <View style={{flexDirection: 'row', gap: 12}}>
            {['1h', '12h', '24h', '1w'].map(time => (
              <TouchableOpacity
                key={time}
                onPress={() => handleTimeChange(time)}
                disabled={dashboardLoading}>
                <Text
                  style={[
                    FontStyle.label,
                    {
                      color:
                        selectedTime === time
                          ? Apptheme.color.primary
                          : Apptheme.color.background,
                      paddingHorizontal: 4,
                      backgroundColor:
                        selectedTime === time
                          ? Apptheme.color.background
                          : 'transparent',
                      borderRadius: 2,
                      opacity: dashboardLoading ? 0.5 : 1,
                    },
                  ]}>
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
        }}
        refreshControl={
          <RefreshControl
            refreshing={dashboardLoading && !!dashboardData}
            onRefresh={() => fetchDashboardData(selectedTime)}
          />
        }>
        <Gap m3 />
        <View style={{padding: Apptheme.spacing.marginHorizontal}}>
          {renderDashboardCards()}
        </View>
      </ScrollView>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({});
