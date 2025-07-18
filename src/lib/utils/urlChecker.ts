export default function isValidUrl(url: string): boolean {
    try {
        const parsedUrl = new URL(url);
        return (
            (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') &&
            !!parsedUrl.hostname
        );
    } catch {
        return false;
    }
}