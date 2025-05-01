import {ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, { useEffect, useState } from 'react';
import VectorIcon from '../../assets/vectorIcons';
import FontStyle from '../../assets/theme/FontStyle';
import Gap from '../../components/atoms/Gap';
import Apptheme from '../../assets/theme/Apptheme';
import SummaryReportCard from '../../components/molecules/SummaryReportCard';
import useApi from '../../apiServices/UseApi';
import { CategoryList, ConfigList, LocationList, TagsList } from '../../apiServices/apiHelper';
import { useDispatch } from 'react-redux';
import { setCategories, setConfigs, setLocations, setTags } from '../../redux/reducer/MetaDataSlice';

const Home = () => {

  const [selectedTime, setSelectedTime] = useState('1h');
  const dispatch = useDispatch();

  const {loading, callApi} = useApi({
    method: 'GET',
    url: '',
    manual: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await callApi(null, CategoryList());
      const locationres = await callApi(null, LocationList());
      const Tagsres = await callApi(null,TagsList())
      const Configres = await callApi(null,ConfigList())

      console.log('CategoryList', res);
      console.log('locationres', locationres);
      console.log('Configres', Configres);
      if (res) dispatch(setCategories(res));
      if (locationres) dispatch(setLocations(locationres));
      if (Tagsres) dispatch(setTags(Tagsres));
      if (Configres) dispatch(setConfigs(Configres));
      

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
