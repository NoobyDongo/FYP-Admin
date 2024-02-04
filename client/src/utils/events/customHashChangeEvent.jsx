const customHashChangeEvent = (hash) => new CustomEvent('customhashchange', { detail: hash });
export default customHashChangeEvent;
