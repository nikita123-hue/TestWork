from rest_framework import serializers # type: ignore
from django.contrib.auth import get_user_model # type: ignore
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer # type: ignore

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email','phone','city','password')
        extra_kwargs = {'password':{'write_only':True}}
        
    def create(self, validate_data):
        user = User.objects.create_user(
            username = validate_data['username'],
            email=validate_data.get('email', ''),
            password=validate_data['password'],
            phone=validate_data.get('phone', ''),
            city=validate_data.get('city', ''),
        ) 
        return user
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls,user):
        token = super().get_token(user)
        token['username'] = user.username
        return token