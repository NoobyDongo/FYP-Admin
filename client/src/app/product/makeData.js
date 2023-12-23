const lname = ["Banana", "Peach", "Fig", "Apple", "Durian", "Strawberry", "Pineapple", "Lemon", "Orange", "Grape", "Blueberry"]
const fname = ["Tough", "Fragile", "Brave", "Sad", "Bold", "Blunt", "Exited", "Sexy", "Cunning"]
/*
const data = [...Array(101).keys()]

data.forEach((e, i) => {
    data[i] = {
        firstName: fname[Math.floor(Math.random() * fname.length)],
        lastName: lname[Math.floor(Math.random() * fname.length)],
        email: (fname[Math.floor(Math.random() * fname.length)] + lname[Math.floor(Math.random() * fname.length)] + Math.floor(Math.random()* 100)  + "@" + lname[Math.floor(Math.random() * fname.length)] + ".com").toLowerCase(),
        salary: Math.floor(Math.random()* 23000)
    }
})
*/

var raw =
    [
        {
            id: "3",
            price: 9432.435,
            image: "",
            name: "Apple",
            desc: "Red Apple.",
            producttype: {
                id: "3",
                name: "Fruit"
            }
        }
    ]

const flattenObject = (input) => {
    let result = {};
    for (const key in input) {
        if (!input.hasOwnProperty(key)) {
            continue;
        }
        if (typeof input[key] === "object" && !Array.isArray(input[key])) {
            var subFlatObject = flattenObject(input[key]);
            for (const subkey in subFlatObject) {
                result[key + "_" + subkey] = subFlatObject[subkey];
            }
        } else {
            result[key] = input[key];
        }
    }
    return result;
}


const data = []
raw.forEach((e) => {
    for (let i = 5; i >= 0; i--){
        e.id = i
        data.push(flattenObject(e))
    }
})
console.log(data)



export { data }