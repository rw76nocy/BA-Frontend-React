export default function authFileHeader() {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.accessToken) {
        return {
            Authorization: 'Bearer ' + user.accessToken,
            "Content-type": "multipart/form-data"
        };
    } else {
        return {};
    }
}