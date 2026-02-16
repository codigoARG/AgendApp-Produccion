import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Container } from '../components/Container';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { login, register, loginWithGoogleCredential } from '../services/authService';
import { useRouter } from 'expo-router';
import { LogIn, UserPlus, ArrowRight, Chrome } from 'lucide-react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const [request, response, promptAsync] = Google.useAuthRequest({
        // TODO: Remplaza estos Client IDs con los de Google Cloud Console
        androidClientId: 'TU_ANDROID_CLIENT_ID',
        iosClientId: 'TU_IOS_CLIENT_ID',
        webClientId: 'TU_WEB_CLIENT_ID',
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            if (authentication?.idToken) {
                handleGoogleAuth(authentication.idToken);
            }
        }
    }, [response]);

    const handleGoogleAuth = async (idToken: string) => {
        setLoading(true);
        try {
            await loginWithGoogleCredential(idToken);
        } catch (error: any) {
            Alert.alert("Error de Google Auth", error.message);
        } finally {
            setLoading(false); // Changed from true to false to correctly stop loading state
        }
    }

    const handleAuth = async () => {
        if (!form.email || !form.password) return;

        setLoading(true);
        try {
            if (isLogin) {
                await login(form.email, form.password);
            } else {
                await register(form.email, form.password);
            }
            // Routing is handled automatically in _layout by looking at user state
        } catch (error: any) {
            Alert.alert("Error de autenticación", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container safe className="justify-center">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                <View className="items-center mb-10">
                    <View className="bg-primary-600/20 p-6 rounded-full mb-6">
                        {isLogin ? <LogIn color="#8B5CF6" size={40} /> : <UserPlus color="#8B5CF6" size={40} />}
                    </View>
                    <Text className="text-white text-3xl font-extrabold text-center">
                        {isLogin ? 'Bienvenido a AgendApp' : 'Crea tu Cuenta'}
                    </Text>
                    <Text className="text-gray-400 text-center mt-2 px-6">
                        {isLogin
                            ? 'Inicia sesión para sincronizar tus planes en todos tus dispositivos.'
                            : 'Únete hoy y lleva tu productividad al siguiente nivel.'}
                    </Text>
                </View>

                <View className="bg-card p-6 rounded-3xl border border-white/5 shadow-xl">
                    <Input
                        label="Correo Electrónico"
                        placeholder="ejemplo@correo.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={form.email}
                        onChangeText={(text) => setForm({ ...form, email: text })}
                    />

                    <Input
                        label="Contraseña"
                        placeholder="••••••••"
                        secureTextEntry
                        value={form.password}
                        onChangeText={(text) => setForm({ ...form, password: text })}
                    />

                    <Button
                        title={isLogin ? "Iniciar Sesión" : "Registrarse"}
                        onPress={handleAuth}
                        loading={loading}
                        className="mt-4"
                    />

                    <View className="flex-row items-center my-6">
                        <View className="flex-1 h-[1px] bg-gray-800" />
                        <Text className="text-gray-500 mx-4 text-xs uppercase font-bold">O continúa con</Text>
                        <View className="flex-1 h-[1px] bg-gray-800" />
                    </View>

                    <TouchableOpacity
                        onPress={() => promptAsync()}
                        disabled={!request || loading}
                        className="h-14 rounded-2xl border border-white/10 flex-row items-center justify-center space-x-3 bg-white/5"
                    >
                        <Chrome color="white" size={20} />
                        <Text className="text-white font-semibold text-lg ml-2">Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="mt-6 flex-row items-center justify-center"
                        onPress={() => setIsLogin(!isLogin)}
                    >
                        <Text className="text-gray-400 mr-2">
                            {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
                        </Text>
                        <Text className="text-primary-500 font-bold">
                            {isLogin ? "Regístrate" : "Inicia Sesión"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {isLogin && (
                    <TouchableOpacity className="mt-8 self-center">
                        <Text className="text-gray-500 text-sm">¿Olvidaste tu contraseña?</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </Container>
    );
};

export default LoginScreen;
