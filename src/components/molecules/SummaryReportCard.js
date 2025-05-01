import React from 'react';
import { View, Text } from 'react-native';
import Apptheme from '../../assets/theme/Apptheme';
import FontStyle from '../../assets/theme/FontStyle';
import Gap from '../atoms/Gap';


const SummaryReportCard = ({ title, count }) => {
  return (
    <View
      style={{
        height: 160,
        width: '100%',
        backgroundColor: Apptheme.color.background,
        alignItems: 'center',
        borderRadius: Apptheme.spacing.m4,
        borderColor: Apptheme.color.primary,
        elevation: Apptheme.spacing.m2,
        marginBottom:20
      }}>
      <View
        style={{
          height: 6,
          backgroundColor: Apptheme.color.primary,
          width: '100%',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      />
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Gap ml />
        <Text style={FontStyle.headingSmall}>{title}</Text>
        <Gap m7 />
        <Text
          style={[
            FontStyle.headingLarge,
            { color: Apptheme.color.primaryText, fontSize: 28 },
          ]}>
          {count}
        </Text>
      </View>
    </View>
  );
};

export default SummaryReportCard;
