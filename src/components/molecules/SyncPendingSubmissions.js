import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CreateStoryApi } from '../../apiServices/apiHelper';
import useApi from '../../apiServices/UseApi';
import { ToastAndroid } from 'react-native';


export const SyncPendingSubmissions = async (postStoryApi) => {

   
  try {
    const net = await NetInfo.fetch();
    if (!net.isConnected) return;

    const queue =
      JSON.parse(await AsyncStorage.getItem('pendingSubmissions')) || [];
      if (queue.length == 0) {
        console.log('ℹ️ No pending submissions to sync');
        return;
      }

      
    for (const form of queue) {
      await postStoryApi(form, CreateStoryApi(true));
    }

    await AsyncStorage.removeItem('pendingSubmissions');
    ToastAndroid.show('Offline drafts synced successfully.', ToastAndroid.SHORT);
    console.log('✅ Synced all pending submissions');
  } catch (error) {
    console.error('❌ Error syncing pending submissions:', error);
  }
};
