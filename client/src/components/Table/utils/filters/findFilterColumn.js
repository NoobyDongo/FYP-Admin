export default (str) => {
    const [id, ...rest] = str.split(':');
    const value = rest.join(':');

    return id && value ? { id, value } : { value: str };
}