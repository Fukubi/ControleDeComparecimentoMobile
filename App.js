import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNDateTimePicker from '@react-native-community/datetimepicker';

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listDate, setListDate] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);

  useEffect(() => {
    fetchData();
    setLoading(false);
  }, []);

  const fetchData = async () => {
    console.log(`https://projetointroducaoec-default-rtdb.firebaseio.com/pontos/${formatDate(listDate)}/.json`);
    const resp = await fetch(`https://projetointroducaoec-default-rtdb.firebaseio.com/pontos/${formatDate(listDate)}/.json`);
    const data = await resp.json();
    setData(data);

    console.log(data);
  }

  function formatDate(date) {
    let monthFormmated = `${date.getUTCMonth() + 1}`;
    let dateFormmated = `${date.getDate()}`;

    if (parseInt(monthFormmated) < 10) {
      monthFormmated = '0' + monthFormmated;
    }

    if (parseInt(dateFormmated) < 10) {
      dateFormmated = '0' + dateFormmated;
    }

    return `${date.getFullYear()}${monthFormmated}${dateFormmated}`;
  }

  if (loading) {
    return (
      <View style={styles.containerLoading}>
        <Text>Loading...</Text>
        <StatusBar style="auto" />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ backgroundColor: 'FFF' , width: '100%', height: 40, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => setOpenDatePicker(true)}
          style={{
            backgroundColor: '#FFF',
            width: 200, 
            borderRadius: 20,
            borderWidth: 3,
            borderColor: '#FFB30D',
            width: 150,
            height: 30, 
            justifyContent: 'center', 
            alignItems: 'center'
          }}>
          <Text style={{color: '#FFB30D', fontSize: 17}}>Escolher data</Text>
        </TouchableOpacity>
      </View>

      {data && Object.keys(data).map((key, index) => (
        <View 
          key={index}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomColor: '#000',
            borderBottomWidth: 2,
            borderTopColor: '#000',
            borderTopWidth: 2,
            paddingLeft: 10,
            paddingRight: 10,
            marginBottom: 5,
          }}
        >
          <Text style={{ fontSize: 20 }}>{key}</Text>

          <Text style={{ fontSize: 20 }}>{data[key].datetime}</Text>
        </View>
      ))}
      <StatusBar style="auto" />

      {openDatePicker && <RNDateTimePicker
        value={listDate}
        onChange={async (event, date) => {
          setListDate(date);
          await fetchData();
          setOpenDatePicker(false);
        }}
      />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  containerLoading: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
