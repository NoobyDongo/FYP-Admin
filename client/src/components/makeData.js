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
const data = [
    {
        "firstName": "Sad",
        "lastName": "Lemon",
        "email": "braveapple82@peach.com",
        "salary": 21499
    },
    {
        "firstName": "Bold",
        "lastName": "Pineapple",
        "email": "exitedstrawberry33@peach.com",
        "salary": 2265
    },
    {
        "firstName": "Fragile",
        "lastName": "Orange",
        "email": "bravelemon72@apple.com",
        "salary": 8993
    },
    {
        "firstName": "Sad",
        "lastName": "Apple",
        "email": "sadpineapple81@fig.com",
        "salary": 15057
    },
    {
        "firstName": "Tough",
        "lastName": "Durian",
        "email": "cunningfig29@orange.com",
        "salary": 13550
    },
    {
        "firstName": "Tough",
        "lastName": "Apple",
        "email": "cunningdurian21@durian.com",
        "salary": 22502
    },
    {
        "firstName": "Sexy",
        "lastName": "Apple",
        "email": "sexydurian13@pineapple.com",
        "salary": 4891
    },
    {
        "firstName": "Tough",
        "lastName": "Fig",
        "email": "bluntlemon81@peach.com",
        "salary": 22645
    },
    {
        "firstName": "Sexy",
        "lastName": "Apple",
        "email": "exitedpineapple21@strawberry.com",
        "salary": 17174
    },
    {
        "firstName": "Blunt",
        "lastName": "Fig",
        "email": "toughfig49@pineapple.com",
        "salary": 20269
    },
    {
        "firstName": "Cunning",
        "lastName": "Lemon",
        "email": "boldpeach63@apple.com",
        "salary": 9783
    },
    {
        "firstName": "Tough",
        "lastName": "Banana",
        "email": "sadapple37@orange.com",
        "salary": 14227
    },
    {
        "firstName": "Brave",
        "lastName": "Lemon",
        "email": "sadstrawberry22@pineapple.com",
        "salary": 11611
    },
    {
        "firstName": "Tough",
        "lastName": "Pineapple",
        "email": "bravestrawberry95@peach.com",
        "salary": 13433
    },
    {
        "firstName": "Fragile",
        "lastName": "Banana",
        "email": "sadpineapple64@peach.com",
        "salary": 635
    },
    {
        "firstName": "Fragile",
        "lastName": "Apple",
        "email": "fragilebanana82@banana.com",
        "salary": 3263
    },
    {
        "firstName": "Sexy",
        "lastName": "Lemon",
        "email": "cunningapple91@strawberry.com",
        "salary": 19919
    },
    {
        "firstName": "Bold",
        "lastName": "Orange",
        "email": "boldlemon46@fig.com",
        "salary": 471
    },
    {
        "firstName": "Brave",
        "lastName": "Strawberry",
        "email": "bravepineapple72@fig.com",
        "salary": 2495
    },
    {
        "firstName": "Fragile",
        "lastName": "Fig",
        "email": "sadpineapple93@orange.com",
        "salary": 13512
    },
    {
        "firstName": "Sexy",
        "lastName": "Banana",
        "email": "fragilelemon66@banana.com",
        "salary": 15484
    },
    {
        "firstName": "Tough",
        "lastName": "Durian",
        "email": "toughlemon28@durian.com",
        "salary": 11581
    },
    {
        "firstName": "Cunning",
        "lastName": "Strawberry",
        "email": "cunningfig34@orange.com",
        "salary": 6587
    },
    {
        "firstName": "Exited",
        "lastName": "Durian",
        "email": "boldpineapple5@strawberry.com",
        "salary": 3605
    },
    {
        "firstName": "Bold",
        "lastName": "Banana",
        "email": "bluntstrawberry83@orange.com",
        "salary": 10920
    },
    {
        "firstName": "Exited",
        "lastName": "Strawberry",
        "email": "boldbanana79@apple.com",
        "salary": 2079
    },
    {
        "firstName": "Exited",
        "lastName": "Fig",
        "email": "exiteddurian29@fig.com",
        "salary": 7870
    },
    {
        "firstName": "Sad",
        "lastName": "Fig",
        "email": "fragiledurian1@peach.com",
        "salary": 14082
    },
    {
        "firstName": "Bold",
        "lastName": "Fig",
        "email": "toughapple0@lemon.com",
        "salary": 6472
    },
    {
        "firstName": "Sexy",
        "lastName": "Strawberry",
        "email": "saddurian49@strawberry.com",
        "salary": 12794
    },
    {
        "firstName": "Bold",
        "lastName": "Apple",
        "email": "toughapple53@peach.com",
        "salary": 19197
    },
    {
        "firstName": "Exited",
        "lastName": "Strawberry",
        "email": "braveorange43@lemon.com",
        "salary": 1323
    },
    {
        "firstName": "Blunt",
        "lastName": "Fig",
        "email": "exitedpineapple75@apple.com",
        "salary": 7299
    },
    {
        "firstName": "Bold",
        "lastName": "Strawberry",
        "email": "bluntstrawberry95@strawberry.com",
        "salary": 16329
    },
    {
        "firstName": "Bold",
        "lastName": "Banana",
        "email": "sexypeach79@orange.com",
        "salary": 13120
    },
    {
        "firstName": "Bold",
        "lastName": "Orange",
        "email": "bluntstrawberry67@apple.com",
        "salary": 20986
    },
    {
        "firstName": "Fragile",
        "lastName": "Durian",
        "email": "bravepeach36@durian.com",
        "salary": 4848
    },
    {
        "firstName": "Brave",
        "lastName": "Fig",
        "email": "bravestrawberry87@pineapple.com",
        "salary": 1654
    },
    {
        "firstName": "Exited",
        "lastName": "Apple",
        "email": "bluntfig46@fig.com",
        "salary": 4759
    },
    {
        "firstName": "Cunning",
        "lastName": "Peach",
        "email": "fragilestrawberry59@pineapple.com",
        "salary": 9096
    },
    {
        "firstName": "Brave",
        "lastName": "Fig",
        "email": "sadpeach80@fig.com",
        "salary": 7822
    },
    {
        "firstName": "Tough",
        "lastName": "Pineapple",
        "email": "sadbanana77@orange.com",
        "salary": 4059
    },
    {
        "firstName": "Sad",
        "lastName": "Peach",
        "email": "exitedpineapple16@pineapple.com",
        "salary": 2637
    },
    {
        "firstName": "Fragile",
        "lastName": "Pineapple",
        "email": "bluntorange18@strawberry.com",
        "salary": 2245
    },
    {
        "firstName": "Bold",
        "lastName": "Lemon",
        "email": "sexyfig23@peach.com",
        "salary": 5348
    },
    {
        "firstName": "Tough",
        "lastName": "Fig",
        "email": "bluntdurian97@fig.com",
        "salary": 18473
    },
    {
        "firstName": "Exited",
        "lastName": "Fig",
        "email": "boldapple21@orange.com",
        "salary": 4777
    },
    {
        "firstName": "Cunning",
        "lastName": "Pineapple",
        "email": "bluntpineapple16@lemon.com",
        "salary": 2404
    },
    {
        "firstName": "Bold",
        "lastName": "Banana",
        "email": "fragilelemon54@peach.com",
        "salary": 19343
    },
    {
        "firstName": "Sad",
        "lastName": "Apple",
        "email": "exiteddurian0@strawberry.com",
        "salary": 5567
    },
    {
        "firstName": "Brave",
        "lastName": "Strawberry",
        "email": "bravepineapple57@durian.com",
        "salary": 10844
    },
    {
        "firstName": "Tough",
        "lastName": "Orange",
        "email": "sadbanana56@orange.com",
        "salary": 11454
    },
    {
        "firstName": "Tough",
        "lastName": "Orange",
        "email": "bluntdurian36@strawberry.com",
        "salary": 4839
    },
    {
        "firstName": "Bold",
        "lastName": "Apple",
        "email": "exitedpineapple99@apple.com",
        "salary": 6406
    },
    {
        "firstName": "Sexy",
        "lastName": "Pineapple",
        "email": "boldlemon42@apple.com",
        "salary": 14028
    },
    {
        "firstName": "Bold",
        "lastName": "Strawberry",
        "email": "cunningfig48@durian.com",
        "salary": 13340
    },
    {
        "firstName": "Cunning",
        "lastName": "Apple",
        "email": "toughapple3@pineapple.com",
        "salary": 19455
    },
    {
        "firstName": "Bold",
        "lastName": "Strawberry",
        "email": "bluntorange86@lemon.com",
        "salary": 1639
    },
    {
        "firstName": "Cunning",
        "lastName": "Lemon",
        "email": "cunningstrawberry95@lemon.com",
        "salary": 9000
    },
    {
        "firstName": "Sad",
        "lastName": "Banana",
        "email": "bluntorange50@orange.com",
        "salary": 6047
    },
    {
        "firstName": "Bold",
        "lastName": "Apple",
        "email": "exitedstrawberry18@lemon.com",
        "salary": 6625
    },
    {
        "firstName": "Cunning",
        "lastName": "Pineapple",
        "email": "exitedfig23@durian.com",
        "salary": 17277
    },
    {
        "firstName": "Cunning",
        "lastName": "Strawberry",
        "email": "fragiledurian13@orange.com",
        "salary": 10059
    },
    {
        "firstName": "Sad",
        "lastName": "Durian",
        "email": "sadlemon90@pineapple.com",
        "salary": 14006
    },
    {
        "firstName": "Sad",
        "lastName": "Lemon",
        "email": "fragilefig83@pineapple.com",
        "salary": 4969
    },
    {
        "firstName": "Blunt",
        "lastName": "Durian",
        "email": "boldapple3@orange.com",
        "salary": 17278
    },
    {
        "firstName": "Tough",
        "lastName": "Orange",
        "email": "bravedurian69@fig.com",
        "salary": 18673
    },
    {
        "firstName": "Exited",
        "lastName": "Strawberry",
        "email": "exitedorange77@strawberry.com",
        "salary": 15757
    },
    {
        "firstName": "Sexy",
        "lastName": "Strawberry",
        "email": "cunningbanana64@fig.com",
        "salary": 18268
    },
    {
        "firstName": "Tough",
        "lastName": "Strawberry",
        "email": "toughorange44@banana.com",
        "salary": 4374
    },
    {
        "firstName": "Exited",
        "lastName": "Durian",
        "email": "boldstrawberry4@durian.com",
        "salary": 7028
    },
    {
        "firstName": "Cunning",
        "lastName": "Banana",
        "email": "sadorange50@orange.com",
        "salary": 3531
    },
    {
        "firstName": "Cunning",
        "lastName": "Banana",
        "email": "fragileorange46@fig.com",
        "salary": 18958
    },
    {
        "firstName": "Sexy",
        "lastName": "Pineapple",
        "email": "toughapple66@lemon.com",
        "salary": 686
    },
    {
        "firstName": "Exited",
        "lastName": "Banana",
        "email": "toughdurian96@banana.com",
        "salary": 11839
    },
    {
        "firstName": "Sad",
        "lastName": "Pineapple",
        "email": "exitedpeach50@pineapple.com",
        "salary": 12162
    },
    {
        "firstName": "Exited",
        "lastName": "Apple",
        "email": "cunningbanana71@apple.com",
        "salary": 15858
    },
    {
        "firstName": "Tough",
        "lastName": "Pineapple",
        "email": "sexyfig26@fig.com",
        "salary": 12011
    },
    {
        "firstName": "Exited",
        "lastName": "Banana",
        "email": "exitedbanana84@durian.com",
        "salary": 8791
    },
    {
        "firstName": "Tough",
        "lastName": "Durian",
        "email": "braveapple90@banana.com",
        "salary": 16276
    },
    {
        "firstName": "Bold",
        "lastName": "Durian",
        "email": "cunningpeach40@apple.com",
        "salary": 5977
    },
    {
        "firstName": "Blunt",
        "lastName": "Orange",
        "email": "bluntfig20@lemon.com",
        "salary": 4497
    },
    {
        "firstName": "Fragile",
        "lastName": "Banana",
        "email": "toughstrawberry78@fig.com",
        "salary": 12667
    },
    {
        "firstName": "Sexy",
        "lastName": "Pineapple",
        "email": "fragilelemon26@pineapple.com",
        "salary": 13943
    },
    {
        "firstName": "Fragile",
        "lastName": "Strawberry",
        "email": "toughpineapple79@apple.com",
        "salary": 17127
    },
    {
        "firstName": "Brave",
        "lastName": "Durian",
        "email": "exitedfig23@orange.com",
        "salary": 16452
    },
    {
        "firstName": "Exited",
        "lastName": "Strawberry",
        "email": "bluntorange73@durian.com",
        "salary": 18834
    },
    {
        "firstName": "Sexy",
        "lastName": "Pineapple",
        "email": "exitedapple32@fig.com",
        "salary": 4779
    },
    {
        "firstName": "Tough",
        "lastName": "Apple",
        "email": "exitedpineapple11@apple.com",
        "salary": 15078
    },
    {
        "firstName": "Bold",
        "lastName": "Fig",
        "email": "cunninglemon20@banana.com",
        "salary": 2891
    },
    {
        "firstName": "Exited",
        "lastName": "Peach",
        "email": "toughpineapple32@apple.com",
        "salary": 467
    },
    {
        "firstName": "Tough",
        "lastName": "Fig",
        "email": "bluntlemon80@lemon.com",
        "salary": 17580
    },
    {
        "firstName": "Sad",
        "lastName": "Peach",
        "email": "exitedpineapple25@banana.com",
        "salary": 9168
    },
    {
        "firstName": "Blunt",
        "lastName": "Strawberry",
        "email": "bluntapple55@pineapple.com",
        "salary": 8456
    },
    {
        "firstName": "Tough",
        "lastName": "Lemon",
        "email": "sadapple14@strawberry.com",
        "salary": 22392
    },
    {
        "firstName": "Blunt",
        "lastName": "Fig",
        "email": "toughorange18@apple.com",
        "salary": 5154
    },
    {
        "firstName": "Tough",
        "lastName": "Peach",
        "email": "sexystrawberry56@banana.com",
        "salary": 17018
    },
    {
        "firstName": "Cunning",
        "lastName": "Lemon",
        "email": "fragileapple82@durian.com",
        "salary": 5565
    },
    {
        "firstName": "Exited",
        "lastName": "Pineapple",
        "email": "boldstrawberry59@peach.com",
        "salary": 7177
    },
    {
        "firstName": "Bold",
        "lastName": "Strawberry",
        "email": "boldlemon49@banana.com",
        "salary": 20965
    },
    {
        "firstName": "Sexy",
        "lastName": "Banana",
        "email": "cunningapple45@apple.com",
        "salary": 18388
    }
]

data.forEach((e, i) => {
    e.id = i
    e.jobTitle = "Human"
})

export { data }