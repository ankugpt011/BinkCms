// src/hooks/useApi.js
import {useEffect, useState, useCallback} from 'react';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {PartnerBaseUrl, PartnerSid} from './apiHelper';
import {ToastAndroid} from 'react-native';

const useApi = ({method = 'GET', url = '', manual = false, cmsUrl = false}) => {
  console.log('hello123456789');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const {apiKey, apiEndPoint, partnerData} = useSelector(state => state.login);
  
  const callApi = useCallback(
    async (body = null, customUrl = null, customHeaders = {}) => {
      setLoading(true);
      setError(null);
      console.log('apicall-before');
      console.log('bodyuseCallback', body);

      console.log('apiKey', apiKey);
      const BASE_URL = cmsUrl
        ? partnerData?.cmsUrl
        : apiEndPoint || PartnerBaseUrl();
      console.log('BASE_URL', BASE_URL);
      try {
        const headers = {
          's-id': apiKey || PartnerSid(),
          ...customHeaders,
        };
        console.log('headers', headers);

        const config = {headers};
        const finalUrl = BASE_URL + (customUrl || url);
        console.log('API Final URL:', finalUrl);

        let res;

        switch (method.toUpperCase()) {
          case 'GET':
            console.log('beforepostapiGET', finalUrl,  config);

            res = await axios.get(finalUrl, config);
            console.log('reswe123456yr', res);
            break;
          case 'POST':
            console.log('beforepostapi1', finalUrl, body, config);

            res = await axios.post(finalUrl, body, config);
            // ToastAndroid.show(
            //   'Saved successfully. send successfully to server',
            //   ToastAndroid.SHORT,
            // );
            console.log('Postreswer', res);
            break;
          case 'PUT':
            res = await axios.put(finalUrl, body, config);
            break;
          case 'DELETE':
            res = await axios.delete(finalUrl, config);
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }

        setResponse(res.data); // update state
        return res.data; // return directly
      } catch (err) {
        console.log('API Error:', err);
        const errorResponse = {
          error: true,
          errorMessage: err.response?.data?.errorMessage || err.message,
          ...err.response?.data
        };
        
        // ToastAndroid.show(
        //   errorResponse.errorMessage || 'Something went wrong',
        //   ToastAndroid.SHORT
        // );
        
        setError(errorResponse);
        return errorResponse; // Return error object consistently
      } finally {
        setLoading(false); // done
      }
    },
    [url, method, apiEndPoint, apiKey],
  );

  useEffect(() => {
    if (!manual && method.toUpperCase() === 'GET') {
      callApi();
    }
  }, [callApi, manual, method]);

  return {
    data: response,
    error,
    loading,
    callApi,
    refetch: callApi,
    postData: callApi,
  };
};

export default useApi;


