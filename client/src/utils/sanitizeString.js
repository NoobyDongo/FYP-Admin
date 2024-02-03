export default (str) => {
    return str
        .replace(/[^\w\s]/gi, '') // remove special characters
        .replace(/\s+/g, '') // remove spaces
        .toLowerCase(); // convert to lowercase
};
