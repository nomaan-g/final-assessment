import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

const App = () => {
  const [asteroidId, setAsteroidId] = useState('');
  const [asteroidData, setAsteroidData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Replace with your actual NASA API key after signing up
  const API_KEY = 'fckqNibMzVIrgmrOmG8IzX1RJiAiJWAl2T4bHVp6';

  const handleInputChange = (value) => {
    setAsteroidId(value);
  };

  const handleSearch = async () => {
    if (!asteroidId) return;

    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `https://api.nasa.gov/neo/rest/v1/neo/${asteroidId}?api_key=${API_KEY}`
      );
      setAsteroidData(response.data);
    } catch (err) {
      setError('Asteroid not found. Please check the ID.');
      setAsteroidData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRandomAsteroid = async () => {
    setLoading(true);
    setError('');
    try {
      const browseResponse = await axios.get(
        `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${API_KEY}`
      );
      const randomAsteroid = browseResponse.data.near_earth_objects[
        Math.floor(Math.random() * browseResponse.data.near_earth_objects.length)
      ];

      const response = await axios.get(
        `https://api.nasa.gov/neo/rest/v1/neo/${randomAsteroid.id}?api_key=${API_KEY}`
      );
      setAsteroidData(response.data);
    } catch (err) {
      setError('Error fetching random asteroid data.');
      setAsteroidData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Asteroid Information Finder</Text>
      <TextInput
        style={styles.input}
        placeholder="Search Here"
        value={asteroidId}
        onChangeText={handleInputChange}
      />
      <View style={styles.buttonContainer}>
        <Button title="Submit" onPress={handleSearch} disabled={!asteroidId} />
        <Button title="Random Asteroid" onPress={handleRandomAsteroid} />
      </View>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {asteroidData && (
        <View style={styles.asteroidInfo}>
          <Text style={styles.infoText}><Text style={styles.label}>Name:</Text> {asteroidData.name}</Text>
          <Text style={styles.infoText}><Text style={styles.label}>NASA JPL URL:</Text> <Text style={styles.link}>{asteroidData.nasa_jpl_url}</Text></Text>
          <Text style={styles.infoText}><Text style={styles.label}>Potentially Hazardous:</Text> {asteroidData.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    marginBottom: 10,
    paddingLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 10,
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  asteroidInfo: {
    marginTop: 20,
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 16,
    marginVertical: 4,
  },
  label: {
    fontWeight: 'bold',
  },
  link: {
    color: 'blue',
  },
});

export default App;
