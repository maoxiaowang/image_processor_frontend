export const BASE_URL = 'http://localhost:8000/api/v1';

const API = {
    auth: {
        obtainToken: '/auth/token/obtain/',
        destroyToken: '/auth/token/destroy/',
        refreshToken: '/auth/token/refresh/',
        whoami: '/auth/whoami/',
    },
    image: {
        imageList: '/image/images/',
        imageUpload: '/image/images/',
        imageDelete: '/image/image/{imageId}/',
        imageDetail: '/image/image/{imageId}',
        imageMultiDelete: '/image/images/{imageIds}/delete/',
        imageProcess: '/image/image/{imageId}/{action}/',
        imageElevate: '/image/generation/{generatedImageId}/elevate/',
    }

};
export default API;
