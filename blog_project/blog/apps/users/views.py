from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView  # type: ignore
from .serializers import UserSerializer, CustomTokenObtainPairSerializer

class UserCreateView(generics.CreateAPIView):
    serializer_class = UserSerializer   
    permission_classes = [permissions.AllowAny]
    
    def perform_create(self, serializer):
        user = serializer.save()
        token = CustomTokenObtainPairSerializer.get_token(user)
        self.tokens = {
            'refresh': str(token),
            'access': str(token.access_token),
    }
    
    def create(self, request, *args, **kwargs):
        print("Incoming data:", request.data)  
        response = super().create(request, *args, **kwargs)
        if response.status_code == 201: 
            response.data.update(self.tokens)
            response.set_cookie(
                key='access',
                value=self.tokens['access'],
                httponly=True,
                secure=False, 
                samesite='Lax',
                path='/',
                max_age=60 * 60
            )
            response.set_cookie(
                key='refresh',
                value=self.tokens['refresh'],
                httponly=True,
                secure=False,
                samesite='Lax',
                path='/',
                max_age=60 * 60 * 24 * 7
            )
        return response

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        response.set_cookie(
            key='access',
            value=response.data['access'],
            httponly=False,      
            secure=True,        
            samesite='Lax',  
            path="/", 
            max_age=30 * 60       
        )
        response.set_cookie(
            key='refresh',
            value=response.data['refresh'],
            httponly=False,
            secure=True,
            samesite='Lax',
            path="/",
            max_age=7*24*3600   
        )
        
        return response
