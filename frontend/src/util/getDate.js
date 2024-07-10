export const getDate = () => {
    let date = new Date();
    let today = date.toISOString().slice(0,10);
    return today + '-' + today;
};

