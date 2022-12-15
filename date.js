const getDate = () => {
    const today = new Date();

    var options = {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    }

    return today.toLocaleDateString('en-US', options);
}

const getDay = () => {
    const today = new Date();

    var options = {
        weekday: 'long',
    }

    return today.toLocaleDateString('en-US', options);
}

module.exports = {getDate, getDay};