from rest_framework import serializers 
from django.contrib.auth import get_user_model 
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer # type: ignore

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email','phone','city','password')
        extra_kwargs = {
            'password':{'write_only':True},
            'phone': {'required': False},  
            'city': {'required': False} 
            }
        
    def create(self, validated_data):
        user = User.objects.create_user(
            username = validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            phone=validated_data.get('phone', ''),
            city=validated_data.get('city', ''),
        ) 
        return user
    
    def validate_email(self,value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Аккаунт с такой почтой уже существует")
        return value
    
    def validate_password(self,value):
        if len(value) < 8:
            raise serializers.ValidationError("Пароль должен быть не менее 8 символов")
        return value
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls,user):
        token = super().get_token(user)
        token['username'] = user.username
        return token 