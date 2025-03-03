export function useFormatter() {
    function userFormat(username: string) {
        const atPosition = username.indexOf("@");
        if (atPosition > 0) {
            return username.slice(0, atPosition);
        }
        return username;
    }

    return {
        userFormat
    }
}