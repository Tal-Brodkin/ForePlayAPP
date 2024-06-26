import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, Pressable, View } from 'react-native';
import { auth, db } from '../services/config';
import { getUser } from "../services/Databases/users";
import { updateConversationOpened } from "../services/Databases/chat"

const ConversationItem = ({ item, navigation }) => {
    const [secondUserProfile, setSecondUserProfile] = useState(null);

    useEffect(() => {
        const fetchSecondUserProfile = async () => {
            const [user1, user2] = item.members;
            const firstUser = auth.currentUser.uid;
            const secondUser = user1 === firstUser ? user2 : user1;
            return await getUser(secondUser);
        };

        fetchSecondUserProfile().then((p) => setSecondUserProfile(p));
    }, [item]);

    const handlePress = async () => {
        navigation.navigate('Chat', { conversationID: item.id });

        await updateConversationOpened(item.id);
    };

    const isNew = !item.openedBy || !item.openedBy.includes(auth.currentUser.uid);


    return (
        
        <Pressable     
            style={({ pressed }) => [
            { backgroundColor: pressed ? 'lightgray' : '#F8F8F8',},
            styles.pressable,
        ]} onPress={handlePress}>
            {secondUserProfile && 
            <View style={styles.conversationItem}>
                <Image
                    source={{ uri: secondUserProfile.images[0] }}
                    style={styles.avatar}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.username}>{secondUserProfile.firstName} {secondUserProfile.lastName}</Text>
                </View>
                {isNew && (
                    <Image
                        source={require('../assets/new.png')} // Replace with the path to your image
                        style={styles.newIndicatorImage}
                    />
                )}
            </View>}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    conversationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        margin: 5,
        backgroundColor: 'white',
        elevation: 3,
        padding: 3

    },
    avatar: {
        width: 55,
        height: 55,
        borderRadius: 20,
    },
    textContainer: {
        flex: 1,
        marginLeft: 20,
    },
    username: {
        fontSize: 18,
        fontWeight: '300'
    },
    newIndicatorImage: {
        width: 45,
        height: 45,
        marginBottom: 10
    },
});

export default ConversationItem;
