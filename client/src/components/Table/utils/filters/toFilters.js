import Filter from "@/components/Table/utils/filters/Filter";
import dataOperation from "./dataOperation";
import operation from "./operation";

export default function toFilters(input, lacky = false) {
    return input.map(item => {
        const match = item.value.match(/([|&])?\s*([^ ]+)?\s*(.*)?/);
        let dataOptionSymbol = lacky? 'any' : 'all', operationSymbol = 'cn', value = item.value;
        if (match && operation[match[2]]) {
            dataOptionSymbol = dataOperation[match[1]] || dataOptionSymbol;
            operationSymbol = operation[match[2]] || operationSymbol;
            value = match[3] || '';
        }
        return new Filter(item.id, `${value}`, operationSymbol, dataOptionSymbol);
    });
}
