import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const scheduleNotification = async (title: string, body: string, date: Date) => {
    const identifier = await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            sound: true,
            data: { withSound: true },
        },
        trigger: {
            channelId: 'default',
            date: date,
        } as any,
    });
    return identifier;
};

export const registerForPushNotificationsAsync = async () => {
    let token;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        return;
    }

    try {
        token = (await Notifications.getExpoPushTokenAsync()).data;
    } catch (e) {
        console.log('Error getting push token', e);
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#8B5CF6',
        });
    }

    return token;
};
