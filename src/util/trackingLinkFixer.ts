export const fixTrackingLink = (link: string | null | undefined): string => {
    if (!link) return "";
    if (link.includes('track.delhivery.com')) {
        return link.replace('track.delhivery.com/track/package/', 'www.delhivery.com/track-v2/package/');
    }
    return link;
};
