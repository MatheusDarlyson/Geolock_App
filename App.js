import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
const App = () => {

  // Constante das coordenadas do ponto inicial, de onde o frete será calculado
  const MARCO_ZERO_COORDS = {
    latitude: -8.0631667,
    longitude: -34.8711389
  };

  // Calculo da distância (Formula de Haversine)
  const calculateDistance = (coord1, coord2) => {
    const toRad = (value) => (value * Math.PI) / 180;

    const R = 6371; // Raio da Terra em KM
    const dLat = toRad(coord2.latitude - coord1.latitude);
    const dLon = toRad(coord2.longitude - coord1.longitude);
    const lat1 = toRad(coord1.latitude);
    const lat2 = toRad(coord2.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distancia em KM

    return distance;
  };

  // Calculo do valor do frete
  const getFreightPrice = (distance) => {
    const pricePer5Km = 10;
    const maxDistance = 50;

    if (distance > maxDistance) {
      return 'Fora do alcance de entrega';
    }

    const segments = Math.ceil(distance / 5);
    return segments * pricePer5Km;
  };

  // Constante de localizações do usuário
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [freightPrice, setFreightPrice] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão para acessar a localização foi negada');
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);

    })();
  }, []);

  const calculateFreight = () => {
    if (!location) return;

    const distance = calculateDistance(MARCO_ZERO_COORDS, location);
    const price = getFreightPrice(distance);
    setFreightPrice(price);
  };

  return (
    <View style={styles.container}>
      {/* Linha Superior */}
      <View style={styles.header}>
      </View>
      {/* Header */}
      <View style={styles.header}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
          🚚 Calculadora de Frete 🚚
        </Text>
      </View>
      <View>
        {location && (
          <View>
            <Text style={{ marginLeft: 10, fontSize: 18, fontWeight: 'bold' }}>Sua Localização</Text>
            {/* Mostra ao usuário suas coordenadas atuais */}
            {/* <Text>Latitude: {location.latitude}</Text>
            <Text>Longitude: {location.longitude}</Text> */}

            {/* Markpoint do Usuário */}
            <MapView
              style={{ width: '100%', height: 200 }}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title="Sua Localização"
              // coordinate={{
              //   latitude: -8.0631667,
              //   longitude: -34.8711389
              // }}
              />
            </MapView>
            <View style={styles.map}>
            </View>
            {/* Markpoint do MarcoZero */}
            <Text style={{ marginLeft: 10, fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>Local de Saída</Text>
            <MapView
              style={{ width: '100%', height: 200 }}
              initialRegion={{
                latitude: -8.0631667,
                longitude: -34.8711389,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: -8.0631667,
                  longitude: -34.8711389
                }}
                title="Marco Zero do Recife"
              />

            </MapView>
            <View style={styles.map}>
            </View>
            <Button title="Calcular Frete" onPress={calculateFreight} />
            {errorMsg ? <Text>{errorMsg}</Text> : null}
            {freightPrice !== null ? <Text style={{ marginLeft: 10, fontSize: 20, marginTop: 10,}}>
              Preço do Frete: R$ {freightPrice},00</Text> : null}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebc001',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 2,
    backgroundColor: '#00b0e9',
    borderBottomColor: '#09292c',
  },
  map: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#09292c',
  },
});

export default App;