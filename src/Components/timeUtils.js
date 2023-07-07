
export function getElapsedTime(lastModifiedDate) {
    const lastModifiedTime = new Date(lastModifiedDate);
    const currentTime = new Date();

    const timeDifference = currentTime - lastModifiedTime;

    const minuteInMillis = 60 * 1000;
    const hourInMillis = 60 * minuteInMillis;
    const dayInMillis = 24 * hourInMillis;
    const weekInMillis = 7 * dayInMillis;
    const monthInMillis = 30 * dayInMillis;
    const yearInMillis = 365 * dayInMillis;

    let elapsedText = '';

    if (timeDifference < minuteInMillis) {
        const seconds = Math.floor(timeDifference / 1000);
        elapsedText = `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    } else if (timeDifference < hourInMillis) {
        const minutes = Math.floor(timeDifference / minuteInMillis);
        elapsedText = `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (timeDifference < dayInMillis) {
        const hours = Math.floor(timeDifference / hourInMillis);
        elapsedText = `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (timeDifference < weekInMillis) {
        const days = Math.floor(timeDifference / dayInMillis);
        elapsedText = `${days} day${days !== 1 ? 's' : ''} ago`;
    } else if (timeDifference < monthInMillis) {
        const weeks = Math.floor(timeDifference / weekInMillis);
        elapsedText = `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
    } else if (timeDifference < yearInMillis) {
        const months = Math.floor(timeDifference / monthInMillis);
        elapsedText = `${months} month${months !== 1 ? 's' : ''} ago`;
    } else {
        const years = Math.floor(timeDifference / yearInMillis);
        elapsedText = `${years} year${years !== 1 ? 's' : ''} ago`;
    }

    return elapsedText;
}


export function getCurrentDateTime() {
    const currentDate = new Date();

    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };

    const dateTime = currentDate.toLocaleString('en-US', options);

    return dateTime;
}

export function getDateOnly(inputDate) {
    const date = new Date(inputDate);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-GB', options);

    return formattedDate;

}


export function convertDate(inputDate) {
    const parts = inputDate.split('-');
    const convertedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

    return convertedDate;
}