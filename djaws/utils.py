from api.serializers import UserSerializer,ProfileSerializer


def my_jwt_response_handler(token, user=None, request=None):
    return {
        'token': token,
        'user': ProfileSerializer(user.profile, context={'request': request,
            "token":token}).data}
