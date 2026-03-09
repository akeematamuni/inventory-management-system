import ms from 'ms';

export const parseDurationToSeconds = (duration: string): number => {
    try {
        const milliSeconds = ms(duration as ms.StringValue);

        if (milliSeconds === undefined || isNaN(milliSeconds)) {
            throw new Error(`Invalid duration: ${duration}`);
        }

        return Math.floor(milliSeconds / 1000);

    } catch (error) {
        console.error(error);
        return 1800
    }
}
