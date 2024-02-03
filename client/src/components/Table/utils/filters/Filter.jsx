export default class Filter {
    constructor(filterKey, value, operation = 'cn', dataOption = 'and') {
        this.filterKey = filterKey;
        this.value = value;
        this.operation = operation;
        this.dataOption = dataOption;
    }
}
