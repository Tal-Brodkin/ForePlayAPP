import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator, TouchableOpacity, Button } from 'react-native';
import { getCurrentUser } from '../services/Databases/users'; // Assuming this is the function to fetch user data
import {useNavigation, useFocusEffect} from '@react-navigation/native';

const UserInfoScreen = () => {

    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState();

    useFocusEffect(
        React.useCallback(() => {
            // Fetch user data here
            fetchUserData();
        }, [])
      );

    const fetchUserData = async () => {
        setLoading(true);
        try {
            const user = await getCurrentUser();
            if (user)
                setUserData(user);
        } catch (error) {
            console.error('Error fetching user info data:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditProfile = () => {
        navigation.navigate("My profile", { userData: userData });
    };

    const handleEditPreferences = () => {
        console.log('1serData');
        console.log(userData);
        navigation.navigate("My Preferences", { userData: userData });
    };

    const calculateCompletionPercentage = () => {
        if (!userData) return 0;
        const totalFields = 7;
        let filledFields = 0;

        if (userData.firstName) filledFields++;
        if (userData.lastName) filledFields++;
        if (userData.age) filledFields++;
        if (userData.sex) filledFields++;
        if (userData.hometown) filledFields++;
        if (userData.occupation) filledFields++;
        if (userData.aboutMe) filledFields++;

        return ((filledFields / totalFields) * 100).toFixed(0);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {userData && (
                <>
                    <View style={styles.header}>
                        <Text style={styles.labels}>My Profile</Text>
                    </View>
                    <View style={[styles.section, { alignItems: 'center' }]}>
                        <View>
                            <View style={[styles.photoBorderContainer, { borderColor: userData.sex === 'Male' ? '#a4cdbd' : '#f06478' }]}>
                                {userData?.images?.length > 0 ? (
                                    <Image source={{ uri: userData.images[0] }} style={styles.photo} />
                                ) : (
                                    <Image source={require('../assets/default_user_icon.jpg')} style={styles.photo} />
                                )}
                            </View>
                            <TouchableOpacity style={styles.edit_profile} onPress={handleEditProfile}>
                                <Image source={require('../assets/edit.png')} style={styles.editIcon} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={styles.name}>{userData.firstName} {userData.lastName}</Text>
                            <Text style={styles.age}>{userData.age}</Text>
                        </View>
                        <View style={styles.progressContainer}>
                            <Text style={styles.progressLabel}>Profile Completion</Text>
                            <View style={styles.progressBar}>
                                <View style={[styles.progressFill, { width: `${calculateCompletionPercentage()}%` }]} />
                            </View>
                            <Text style={styles.progressPercentage}>{calculateCompletionPercentage()}%</Text>
                        </View>
                    </View>

                    <Text style={styles.labels}>My Preferences</Text>

                    <View style={styles.section}>

                        <TouchableOpacity style={styles.edit_preferences} onPress={handleEditPreferences}>
                            <Image source={require('../assets/edit.png')} style={styles.editIcon} />
                        </TouchableOpacity>

                        <View style={styles.row}>
                            <Text style={styles.preferences}>Gender: </Text>
                            <Text style={styles.lable}>{userData.partner_gender}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: "center", marginBottom: 10 }}>
                            <View style={{ flex: 1, height: 1, backgroundColor: 'lightgrey', marginHorizontal: 10 }} />
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.preferences}>Age: </Text>
                            <Text style={styles.lable}>{userData.preferredAgeRange?.[0] ?? ''} - {userData.preferredAgeRange?.[1] ?? ''}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: "center", marginBottom: 10 }}>
                            <View style={{ flex: 1, height: 1, backgroundColor: 'lightgrey', marginHorizontal: 10 }} />
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.preferences}>Radius: </Text>
                            <Text style={styles.lable}>{userData.radius} km</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: "center", marginBottom: 10 }}>
                            <View style={{ flex: 1, height: 1, backgroundColor: 'lightgrey', marginHorizontal: 10 }} />
                        </View>
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10
    },
    labels: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        marginHorizontal: 10
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    section: {
        backgroundColor: 'white',
        paddingVertical: 20,
        margin: 10,
        borderRadius: 10,
    },
    photoBorderContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 3,
        overflow: 'hidden',
        position: 'relative', // Add position relative for absolute positioning of edit icon
    },
    photo: {
        width: '100%',
        height: '100%',
    },
    edit_profile: {
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
        shadowColor: '#000',
        elevation: 5,
        bottom: 1,
        right: 1,
    },
    edit_preferences: {
        position: 'absolute',
        padding: 10,
        top: 1,
        right: 1,
    },
    editIcon: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
    },
    userInfo: {
        alignItems: 'center',
        marginTop: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    age: {
        fontSize: 16,
        marginTop: 5,
    },
    progressContainer: {
        marginTop: 20,
        width: '80%',
    },
    progressLabel: {
        fontSize: 16,
        marginBottom: 5,
        textAlign: 'center',
    },
    progressBar: {
        height: 20,
        backgroundColor: '#ddd',
        borderRadius: 10,
        overflow: 'hidden',
        shadowColor: '#000',
        elevation: 5,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#007AFF',
    },
    progressPercentage: {
        marginTop: 5,
        fontSize: 16,
        textAlign: 'center',
    },
    preferences: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    lable: {
        fontSize: 18,
        paddingHorizontal: 20
    }
});

export default UserInfoScreen;