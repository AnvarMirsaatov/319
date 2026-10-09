const fs = require('fs');
const path = require('path');

const categoriesData = [
  {
    category: "Sut va sut mahsulotlari",
    image: "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=600&auto=format&fit=crop&q=80",
    items: [
      { title: "Musaffo Sut 3.2% 1L", price: 12000, unit: "litr", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80" },
      { title: "Musaffo Sut 2.5% 1L", price: 11000, unit: "litr", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80" },
      { title: "Kamilka Sut 3.2% 900ml", price: 10500, unit: "litr", image: "https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?w=600&auto=format&fit=crop&q=80" },
      { title: "Nestlé Sut 1L", price: 15000, unit: "litr", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80" },
      { title: "President Sariyog' 82% 200g", price: 34000, unit: "dona", image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80" },
      { title: "Anchor Sariyog' 82.5% 200g", price: 36000, unit: "dona", image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80" },
      { title: "Qaymoq Toshkent 200g", price: 18000, unit: "dona", image: "https://images.unsplash.com/photo-1588710929895-5db468153406?w=600&auto=format&fit=crop&q=80" },
      { title: "Qaymoq Qishloqcha 500g", price: 38000, unit: "dona", image: "https://images.unsplash.com/photo-1588710929895-5db468153406?w=600&auto=format&fit=crop&q=80" },
      { title: "Musaffo Qatiq 3.2% 1L", price: 10000, unit: "litr", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80" },
      { title: "Kamilka Qatiq 1L", price: 9500, unit: "litr", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80" },
      { title: "President Tvorog 9% 200g", price: 22000, unit: "dona", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80" },
      { title: "Domik v Derevne Tvorog 5% 250g", price: 24000, unit: "dona", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80" },
      { title: "Viola Eriydigan pishloq 400g", price: 42000, unit: "dona", image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&auto=format&fit=crop&q=80" },
      { title: "Hochland Pishloq Plastinka 150g", price: 23000, unit: "dona", image: "https://images.unsplash.com/photo-1624806992066-5ffcf7ca186b?w=600&auto=format&fit=crop&q=80" },
      { title: "Rossiyskiy Pishloq 1kg", price: 98000, unit: "kg", image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=600&auto=format&fit=crop&q=80" },
      { title: "Gollandskiy Pishloq 1kg", price: 105000, unit: "kg", image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=600&auto=format&fit=crop&q=80" },
      { title: "Mozzarella Pishloq 250g", price: 32000, unit: "dona", image: "https://images.unsplash.com/photo-1589881133595-a3c085cb731d?w=600&auto=format&fit=crop&q=80" },
      { title: "Suluguni Pishloq 300g", price: 29000, unit: "dona", image: "https://images.unsplash.com/photo-1589881133595-a3c085cb731d?w=600&auto=format&fit=crop&q=80" },
      { title: "Musaffo Smetana 20% 400g", price: 16000, unit: "dona", image: "https://images.unsplash.com/photo-1588710929895-5db468153406?w=600&auto=format&fit=crop&q=80" },
      { title: "Kamilka Smetana 15% 350g", price: 14000, unit: "dona", image: "https://images.unsplash.com/photo-1588710929895-5db468153406?w=600&auto=format&fit=crop&q=80" },
      { title: "Danone Mevali yogurt 115g", price: 7000, unit: "dona", image: "https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=600&auto=format&fit=crop&q=80" },
      { title: "Activia Ichimlik yogurti 290ml", price: 12000, unit: "dona", image: "https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=600&auto=format&fit=crop&q=80" },
      { title: "Rastishka Bolalar yogurti 4x100g", price: 25000, unit: "pachka", image: "https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=600&auto=format&fit=crop&q=80" },
      { title: "Suzma Qishloqcha 500g", price: 15000, unit: "dona", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80" },
      { title: "Quyultirilgan sut Alekseevskoe 380g", price: 21000, unit: "dona", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80" }
    ]
  },
  {
    category: "Non va pishiriqlar",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
    items: [
      { title: "Buxanka non (Qolipli non)", price: 3000, unit: "dona", image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&auto=format&fit=crop&q=80" },
      { title: "Samarqand patir noni", price: 10000, unit: "dona", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80" },
      { title: "Toshkent shirmoy non", price: 8000, unit: "dona", image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&auto=format&fit=crop&q=80" },
      { title: "Jizzax patir noni", price: 12000, unit: "dona", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80" },
      { title: "Tandir noni an'anaviy", price: 4000, unit: "dona", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80" },
      { title: "Yupqa lavash xamiri 5 dona", price: 7000, unit: "pachka", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80" },
      { title: "Dumaloq lavash xamiri 3 dona", price: 6000, unit: "pachka", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80" },
      { title: "Baget non fransuzcha", price: 7500, unit: "dona", image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600&auto=format&fit=crop&q=80" },
      { title: "Toast oq noni kesilgan 400g", price: 11000, unit: "dona", image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&auto=format&fit=crop&q=80" },
      { title: "Qora non (Borodinskiy) 400g", price: 8500, unit: "dona", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80" },
      { title: "Kunjutli bulochka 2 dona", price: 6000, unit: "pachka", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80" },
      { title: "Shokoladli kruassan 2 dona", price: 14000, unit: "pachka", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80" },
      { title: "Vanilli keks 350g", price: 18000, unit: "dona", image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=600&auto=format&fit=crop&q=80" },
      { title: "Choko-pay pechenyesi 12 dona", price: 26000, unit: "pachka", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80" },
      { title: "Yubileynoe sariyog'li pechenye 313g", price: 13000, unit: "pachka", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80" },
      { title: "Oreo pechenyesi 154g", price: 14000, unit: "pachka", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80" },
      { title: "Pryorika qatlama xamiri 500g", price: 16000, unit: "pachka", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80" },
      { title: "Brik xamir yupqa muzlatilgan", price: 15000, unit: "pachka", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80" },
      { title: "Qandolatchilik pryaniklari 400g", price: 12000, unit: "pachka", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80" },
      { title: "Qarsildoq suxarilar mayizli 300g", price: 10000, unit: "pachka", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80" },
      { title: "Baranka vanilli 350g", price: 9500, unit: "pachka", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80" },
      { title: "Medovik pirogi 500g", price: 35000, unit: "dona", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80" },
      { title: "Napoleon pirogi 450g", price: 38000, unit: "dona", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80" },
      { title: "Xachapuri pishloqli 200g", price: 15000, unit: "dona", image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=600&auto=format&fit=crop&q=80" },
      { title: "Somsa go'shtli 1 dona", price: 9000, unit: "dona", image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=600&auto=format&fit=crop&q=80" }
    ]
  },
  {
    category: "Sabzavot va mevalar",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80",
    items: [
      { title: "Qizil kartoshka yangi hosil", price: 6000, unit: "kg", image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80" },
      { title: "Sariq piyoz saralangan", price: 4000, unit: "kg", image: "https://images.unsplash.com/photo-1508747703725-719777637510?w=600&auto=format&fit=crop&q=80" },
      { title: "Qizil sabzi shirin", price: 4500, unit: "kg", image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80" },
      { title: "Sariq sabzi oshpazbop", price: 4000, unit: "kg", image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80" },
      { title: "Qizil pushti pomidor Yusufevski", price: 18000, unit: "kg", image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80" },
      { title: "Bodring mayda bodring", price: 14000, unit: "kg", image: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=600&auto=format&fit=crop&q=80" },
      { title: "Qalampir shirin bolgar", price: 22000, unit: "kg", image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&auto=format&fit=crop&q=80" },
      { title: "Oq karam saralangan", price: 5000, unit: "kg", image: "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=600&auto=format&fit=crop&q=80" },
      { title: "Gulkaram yangi", price: 16000, unit: "kg", image: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600&auto=format&fit=crop&q=80" },
      { title: "Sarimsoqpiyoz tozalangan", price: 35000, unit: "kg", image: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=600&auto=format&fit=crop&q=80" },
      { title: "Ko'katlar to'plami (kashnich, shivit, rayhon)", price: 4000, unit: "dona", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80" },
      { title: "Ismaloq yangi bog'lam", price: 5000, unit: "dona", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80" },
      { title: "Baqlajon saralangan", price: 15000, unit: "kg", image: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=600&auto=format&fit=crop&q=80" },
      { title: "Qovoqcha (Kabachki)", price: 12000, unit: "kg", image: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=600&auto=format&fit=crop&q=80" },
      { title: "Qizil lavlagi", price: 5000, unit: "kg", image: "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=600&auto=format&fit=crop&q=80" },
      { title: "Banan Ekvador Premium", price: 24000, unit: "kg", image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80" },
      { title: "Olma Beshyulduz", price: 16000, unit: "kg", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80" },
      { title: "Olma Semerenko", price: 14000, unit: "kg", image: "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=600&auto=format&fit=crop&q=80" },
      { title: "Nok Nokcha shirin", price: 28000, unit: "kg", image: "https://images.unsplash.com/photo-1514756331096-242fdeb7004a?w=600&auto=format&fit=crop&q=80" },
      { title: "Mandarin Marokash", price: 32000, unit: "kg", image: "https://images.unsplash.com/photo-1557800636-894a64c1696f?w=600&auto=format&fit=crop&q=80" },
      { title: "Apelsin suvli", price: 26000, unit: "kg", image: "https://images.unsplash.com/photo-1547514701-42782101795e?w=600&auto=format&fit=crop&q=80" },
      { title: "Limon Toshkent yangi", price: 30000, unit: "kg", image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=600&auto=format&fit=crop&q=80" },
      { title: "Uzum Qora kishmish", price: 25000, unit: "kg", image: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&auto=format&fit=crop&q=80" },
      { title: "Anor Quva shirin", price: 35000, unit: "kg", image: "https://images.unsplash.com/photo-1541344999736-83eca272f6fc?w=600&auto=format&fit=crop&q=80" },
      { title: "Qulupnay mavsumiy 500g", price: 28000, unit: "dona", image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&auto=format&fit=crop&q=80" }
    ]
  },
  {
    category: "Go'sht va kolbasa mahsulotlari",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&auto=format&fit=crop&q=80",
    items: [
      { title: "Yangi mol go'shti lahm", price: 115000, unit: "kg", image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&auto=format&fit=crop&q=80" },
      { title: "Yangi mol go'shti suyakli", price: 98000, unit: "kg", image: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=600&auto=format&fit=crop&q=80" },
      { title: "Mol go'shti qiymasi saralangan", price: 105000, unit: "kg", image: "https://images.unsplash.com/photo-1551028150-64b9f398f678?w=600&auto=format&fit=crop&q=80" },
      { title: "Qo'y go'shti to'sh qismi", price: 110000, unit: "kg", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80" },
      { title: "Butun tovuq go'shti muzlatilgan", price: 38000, unit: "kg", image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&auto=format&fit=crop&q=80" },
      { title: "Tovuq filesi (ko'krak go'shti)", price: 52000, unit: "kg", image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&auto=format&fit=crop&q=80" },
      { title: "Tovuq sonlari", price: 42000, unit: "kg", image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&auto=format&fit=crop&q=80" },
      { title: "Tovuq qanotlari", price: 39000, unit: "kg", image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600&auto=format&fit=crop&q=80" },
      { title: "Rozmetov Doktorskaya kolbasa 500g", price: 42000, unit: "dona", image: "https://images.unsplash.com/photo-1628102491629-778571d893a3?w=600&auto=format&fit=crop&q=80" },
      { title: "Rozmetov Halol Dudlangan kolbasa 400g", price: 46000, unit: "dona", image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80" },
      { title: "Sagban Halol Servelat 450g", price: 44000, unit: "dona", image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80" },
      { title: "Sherin Halol Mol go'shtli sosiska 500g", price: 38000, unit: "dona", image: "https://images.unsplash.com/photo-1585325701165-351af916e581?w=600&auto=format&fit=crop&q=80" },
      { title: "Rozmetov Bolalar sosiskasi 400g", price: 35000, unit: "dona", image: "https://images.unsplash.com/photo-1585325701165-351af916e581?w=600&auto=format&fit=crop&q=80" },
      { title: "To'xtaniyoz Ota Dudlangan qazi 400g", price: 75000, unit: "dona", image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80" },
      { title: "Uy qazisi an'anaviy 1 dona", price: 85000, unit: "dona", image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80" },
      { title: "Sagban Pishloqli sosiska 450g", price: 39000, unit: "dona", image: "https://images.unsplash.com/photo-1585325701165-351af916e581?w=600&auto=format&fit=crop&q=80" },
      { title: "Tovuqli vetchina Sherin 400g", price: 34000, unit: "dona", image: "https://images.unsplash.com/photo-1628102491629-778571d893a3?w=600&auto=format&fit=crop&q=80" },
      { title: "Dudlangan tovuq go'shti butun", price: 58000, unit: "kg", image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&auto=format&fit=crop&q=80" },
      { title: "Tovuq naggetslari muzlatilgan 400g", price: 26000, unit: "pachka", image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80" },
      { title: "Muzlatilgan chuchvara mol go'shtli 500g", price: 32000, unit: "pachka", image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80" },
      { title: "Muzlatilgan kotlet mol go'shtli 450g", price: 34000, unit: "pachka", image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&auto=format&fit=crop&q=80" },
      { title: "Muzlatilgan manti mol go'shti bilan 800g", price: 45000, unit: "pachka", image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80" },
      { title: "Dudlangan kurka go'shti filesi 300g", price: 48000, unit: "dona", image: "https://images.unsplash.com/photo-1628102491629-778571d893a3?w=600&auto=format&fit=crop&q=80" },
      { title: "Jigar mol go'shti yangi", price: 65000, unit: "kg", image: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=600&auto=format&fit=crop&q=80" },
      { title: "Til mol go'shti saralangan", price: 95000, unit: "kg", image: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=600&auto=format&fit=crop&q=80" }
    ]
  },
  {
    category: "Quruq oziq-ovqatlar",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80",
    items: [
      { title: "Toshkent Un Oliy Nav 1kg", price: 14000, unit: "kg", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80" },
      { title: "Toshkent Un Oliy Nav 2kg", price: 26000, unit: "dona", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80" },
      { title: "Makfa Oliy Nav Bug'doy Uni 2kg", price: 32000, unit: "dona", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80" },
      { title: "Alanga guruchi tozalangan", price: 22000, unit: "kg", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80" },
      { title: "Lazar guruchi a'lo sifat", price: 28000, unit: "kg", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80" },
      { title: "Devzira guruchi Chust", price: 35000, unit: "kg", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80" },
      { title: "Makfa Makaron Spirali 450g", price: 11000, unit: "pachka", image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=600&auto=format&fit=crop&q=80" },
      { title: "Makfa Makaron Spagetti 500g", price: 12000, unit: "pachka", image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281729?w=600&auto=format&fit=crop&q=80" },
      { title: "Barilla Spagetti No.5 500g", price: 22000, unit: "pachka", image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281729?w=600&auto=format&fit=crop&q=80" },
      { title: "Barilla Penne Rigate 500g", price: 22000, unit: "pachka", image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=600&auto=format&fit=crop&q=80" },
      { title: "Oq shakar tozalangan 1kg", price: 14000, unit: "kg", image: "https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=600&auto=format&fit=crop&q=80" },
      { title: "Shakar qand 500g", price: 9000, unit: "pachka", image: "https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=600&auto=format&fit=crop&q=80" },
      { title: "Osh tuzi yodlangan Osh tuzi 1kg", price: 3000, unit: "kg", image: "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=600&auto=format&fit=crop&q=80" },
      { title: "Schedroe Leto Kungaboqar yog'i 1L", price: 18000, unit: "litr", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80" },
      { title: "Oleina Kungaboqar yog'i 1L", price: 19000, unit: "litr", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80" },
      { title: "Zateya Kungaboqar yog'i 1L", price: 18500, unit: "litr", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80" },
      { title: "Paxta yog'i Elita tozalangan 1L", price: 20000, unit: "litr", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80" },
      { title: "Grechka yormasi Makfa 800g", price: 16000, unit: "pachka", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80" },
      { title: "Suli yormasi (Gerkulex) 400g", price: 9000, unit: "pachka", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80" },
      { title: "Mosh saralangan o'zbek", price: 18000, unit: "kg", image: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&auto=format&fit=crop&q=80" },
      { title: "No'xat oshpazbop saralangan", price: 20000, unit: "kg", image: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&auto=format&fit=crop&q=80" },
      { title: "Qizil loviya saralangan", price: 24000, unit: "kg", image: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&auto=format&fit=crop&q=80" },
      { title: "Mannaya yormasi 800g", price: 8500, unit: "pachka", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80" },
      { title: "Kuskus doni 500g", price: 26000, unit: "pachka", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80" },
      { title: "Mayonez Provansal Sloboda 67% 400ml", price: 16000, unit: "dona", image: "https://images.unsplash.com/photo-1528751014936-863e6e7a319c?w=600&auto=format&fit=crop&q=80" }
    ]
  },
  {
    category: "Ichimliklar va sharbatlar",
    image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=600&auto=format&fit=crop&q=80",
    items: [
      { title: "Coca-Cola Classic 1.5L", price: 14000, unit: "dona", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80" },
      { title: "Coca-Cola Zero 1.5L", price: 14000, unit: "dona", image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600&auto=format&fit=crop&q=80" },
      { title: "Fanta Orange 1.5L", price: 14000, unit: "dona", image: "https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=600&auto=format&fit=crop&q=80" },
      { title: "Sprite 1.5L", price: 14000, unit: "dona", image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=600&auto=format&fit=crop&q=80" },
      { title: "Pepsi Cola 1.5L", price: 13000, unit: "dona", image: "https://images.unsplash.com/photo-1567103472667-6898f3a79cf2?w=600&auto=format&fit=crop&q=80" },
      { title: "Nestlé Pure Life Gazsiz suv 1.5L", price: 5000, unit: "dona", image: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80" },
      { title: "Nestlé Pure Life Gazsiz suv 5L", price: 12000, unit: "dona", image: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80" },
      { title: "Chortoq Gazlangan mineral suv 0.5L shisha", price: 7000, unit: "dona", image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600&auto=format&fit=crop&q=80" },
      { title: "Borjomi Gazlangan mineral suv 0.5L shisha", price: 16000, unit: "dona", image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600&auto=format&fit=crop&q=80" },
      { title: "Hydrolife Gazsiz mineral suv 1.5L", price: 4500, unit: "dona", image: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80" },
      { title: "Bliss Olma sharbati 1L", price: 15000, unit: "dona", image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&auto=format&fit=crop&q=80" },
      { title: "Bliss Apelsin sharbati 1L", price: 16000, unit: "dona", image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80" },
      { title: "Dena Olcha sharbati 1L", price: 14000, unit: "dona", image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=600&auto=format&fit=crop&q=80" },
      { title: "Dena Shaftoli sharbati 1L", price: 14000, unit: "dona", image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&auto=format&fit=crop&q=80" },
      { title: "Sandora Pomidor sharbati 1L", price: 21000, unit: "dona", image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=600&auto=format&fit=crop&q=80" },
      { title: "Ahmad Tea Qora choy Ceylon 100g", price: 24000, unit: "pachka", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80" },
      { title: "Greenfield Golden Ceylon 25 paket", price: 22000, unit: "pachka", image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&auto=format&fit=crop&q=80" },
      { title: "Tess Sunrise Qora choy 100 paket", price: 45000, unit: "pachka", image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&auto=format&fit=crop&q=80" },
      { title: "Ahmad Tea Ko'k choy Jasmine 100g", price: 25000, unit: "pachka", image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=600&auto=format&fit=crop&q=80" },
      { title: "Toshkent Choy Ko'k choy 95 100g", price: 7000, unit: "pachka", image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=600&auto=format&fit=crop&q=80" },
      { title: "Nescafé Classic Qahva eruvchan 100g", price: 34000, unit: "dona", image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80" },
      { title: "Jacobs Monarch Qahva eruvchan 95g", price: 48000, unit: "dona", image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80" },
      { title: "MacCoffee 3-in-1 Original 25 dona", price: 32000, unit: "pachka", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80" },
      { title: "Red Bull Energetik ichimlik 250ml", price: 22000, unit: "dona", image: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=600&auto=format&fit=crop&q=80" },
      { title: "Flash Up Energetik ichimlik 450ml", price: 10000, unit: "dona", image: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=600&auto=format&fit=crop&q=80" }
    ]
  },
  {
    category: "Tozalash va maishiy kimyo vositalari",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80",
    items: [
      { title: "Ariel Avtomat Kir yuvish kukuni Tog' havosi 3kg", price: 85000, unit: "pachka", image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&auto=format&fit=crop&q=80" },
      { title: "Tide Avtomat Kir yuvish kukuni Lenor bilan 3kg", price: 78000, unit: "pachka", image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&auto=format&fit=crop&q=80" },
      { title: "Persil Deep Clean Avtomat kukun 3kg", price: 92000, unit: "pachka", image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&auto=format&fit=crop&q=80" },
      { title: "Fairy Limon Idish yuvish suyuqligi 900ml", price: 26000, unit: "dona", image: "https://images.unsplash.com/photo-1585670270608-b4be4fbcfbf5?w=600&auto=format&fit=crop&q=80" },
      { title: "Fairy Olma Idish yuvish suyuqligi 450ml", price: 15000, unit: "dona", image: "https://images.unsplash.com/photo-1585670270608-b4be4fbcfbf5?w=600&auto=format&fit=crop&q=80" },
      { title: "Pril Idish yuvish geli 450ml", price: 14000, unit: "dona", image: "https://images.unsplash.com/photo-1585670270608-b4be4fbcfbf5?w=600&auto=format&fit=crop&q=80" },
      { title: "Domestos Ultra Oqartiruvchi tozalovchi vosita 1L", price: 24000, unit: "dona", image: "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=600&auto=format&fit=crop&q=80" },
      { title: "Cillit Bang Zang va ohak tozalovchi sprey 750ml", price: 36000, unit: "dona", image: "https://images.unsplash.com/photo-1585670270608-b4be4fbcfbf5?w=600&auto=format&fit=crop&q=80" },
      { title: "Cif Universal Tozalovchi krem 500ml", price: 23000, unit: "dona", image: "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=600&auto=format&fit=crop&q=80" },
      { title: "Mr. Proper Pol tozalovchi suyuqlik Limon 1L", price: 25000, unit: "dona", image: "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=600&auto=format&fit=crop&q=80" },
      { title: "Lenor Mato yumshatgich Skandinaviya bahori 1L", price: 32000, unit: "dona", image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&auto=format&fit=crop&q=80" },
      { title: "Vanish Oxi Action Dog' ketkazuvchi 450ml", price: 38000, unit: "dona", image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&auto=format&fit=crop&q=80" },
      { title: "Somat Idish yuvish mashinasi tabletkasi 24 dona", price: 68000, unit: "pachka", image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80" },
      { title: "Finish All in 1 Idish yuvish tabletkalari 30 dona", price: 78000, unit: "pachka", image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80" },
      { title: "Duru Qo'l sovuni 4x90g", price: 18000, unit: "pachka", image: "https://images.unsplash.com/photo-1607006314146-59a8c08ec200?w=600&auto=format&fit=crop&q=80" },
      { title: "Safeguard Antibakterial qattiq sovun 90g", price: 9000, unit: "dona", image: "https://images.unsplash.com/photo-1607006314146-59a8c08ec200?w=600&auto=format&fit=crop&q=80" },
      { title: "Palmolive Suyuq qo'l sovuni 300ml", price: 22000, unit: "dona", image: "https://images.unsplash.com/photo-1608248597359-009772c589b9?w=600&auto=format&fit=crop&q=80" },
      { title: "Head & Shoulders Qazg'oqqa qarshi shampun 400ml", price: 46000, unit: "dona", image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80" },
      { title: "Pantene Pro-V Shampun Oziqlantiruvchi 400ml", price: 44000, unit: "dona", image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80" },
      { title: "Clear Men Erkaklar shampuni Muzdek tetiklik 400ml", price: 45000, unit: "dona", image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80" },
      { title: "Colgate Total Tish pastasi 100ml", price: 19000, unit: "dona", image: "https://images.unsplash.com/photo-1559591937-e1053158c35a?w=600&auto=format&fit=crop&q=80" },
      { title: "Blend-a-med 3D White Tish pastasi 100ml", price: 18000, unit: "dona", image: "https://images.unsplash.com/photo-1559591937-e1053158c35a?w=600&auto=format&fit=crop&q=80" },
      { title: "Clin Oyna tozalovchi sprey 500ml", price: 21000, unit: "dona", image: "https://images.unsplash.com/photo-1585670270608-b4be4fbcfbf5?w=600&auto=format&fit=crop&q=80" },
      { title: "Glade Havo xushbo'ylantiruvchi sprey 300ml", price: 24000, unit: "dona", image: "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=600&auto=format&fit=crop&q=80" },
      { title: "Air Wick Avtomatik havo xushbo'ylantiruvchi balon 250ml", price: 45000, unit: "dona", image: "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=600&auto=format&fit=crop&q=80" }
    ]
  },
  {
    category: "Ro'zg'or buyumlari",
    image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80",
    items: [
      { title: "Paclan Oshxona alyuminiy folgasi 10m", price: 14000, unit: "dona", image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80" },
      { title: "Master FRESH Oziq-ovqat pishirish plyonkasi 20m", price: 11000, unit: "dona", image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80" },
      { title: "Perforatsiyalangan pishirish pergamenti 5m", price: 12000, unit: "dona", image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80" },
      { title: "Chistyulya Oshxona idish gubkasi 5 dona", price: 8000, unit: "pachka", image: "https://images.unsplash.com/photo-1585670270608-b4be4fbcfbf5?w=600&auto=format&fit=crop&q=80" },
      { title: "Profilak metall idish qirg'ichi 2 dona", price: 6000, unit: "pachka", image: "https://images.unsplash.com/photo-1585670270608-b4be4fbcfbf5?w=600&auto=format&fit=crop&q=80" },
      { title: "Mikrofibra oshxona salfetkasi 3 dona", price: 16000, unit: "pachka", image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80" },
      { title: "Selpak 3 qavatli oshxona qog'oz sochiq 2 rulon", price: 22000, unit: "pachka", image: "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=600&auto=format&fit=crop&q=80" },
      { title: "Papia 3 qavatli oshxona sochiq 2 rulon", price: 21000, unit: "pachka", image: "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=600&auto=format&fit=crop&q=80" },
      { title: "Zewa Deluxe 3 qavatli tualet qog'ozi 4 rulon", price: 25000, unit: "pachka", image: "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=600&auto=format&fit=crop&q=80" },
      { title: "Familia Plus 2 qavatli tualet qog'ozi 8 rulon", price: 32000, unit: "pachka", image: "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=600&auto=format&fit=crop&q=80" },
      { title: "Nam salfetkalar antibakterial 72 dona", price: 12000, unit: "pachka", image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80" },
      { title: "Bolalar uchun gipoallergen nam salfetkalar 120 dona", price: 18000, unit: "pachka", image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80" },
      { title: "Axlat qoplari mustahkam 35L 30 dona", price: 11000, unit: "pachka", image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&auto=format&fit=crop&q=80" },
      { title: "Axlat qoplari bog'ichli 60L 20 dona", price: 17000, unit: "pachka", image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&auto=format&fit=crop&q=80" },
      { title: "Axlat qoplari katta hajmli 120L 10 dona", price: 19000, unit: "pachka", image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&auto=format&fit=crop&q=80" },
      { title: "Bir martalik rezina qo'lqoplar L 10 juft", price: 18000, unit: "pachka", image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80" },
      { title: "Oshxona xo'jalik rezina qo'lqopi M 1 juft", price: 9000, unit: "dona", image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80" },
      { title: "Tish tozalagich (zubochistka) qutida 200 dona", price: 6000, unit: "dona", image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80" },
      { title: "Quloq tozalagich paxtali tayoqchalar 200 dona", price: 8000, unit: "dona", image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80" },
      { title: "Kosmetik paxta disklari 100 dona", price: 12000, unit: "pachka", image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80" },
      { title: "Bir martalik qog'oz stakanlar 200ml 50 dona", price: 15000, unit: "pachka", image: "https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?w=600&auto=format&fit=crop&q=80" },
      { title: "Bir martalik plastik likopchalar 10 dona", price: 7000, unit: "pachka", image: "https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?w=600&auto=format&fit=crop&q=80" },
      { title: "Oshxona gugurti 10 quti", price: 5000, unit: "pachka", image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80" },
      { title: "Maishiy oshxona yondirgichi (zajigalka)", price: 12000, unit: "dona", image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80" },
      { title: "Kiyimlar uchun yopishqoq rolik 60 qatlam", price: 16000, unit: "dona", image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80" }
    ]
  }
];

const seedsDir = path.resolve(__dirname);
if (!fs.existsSync(seedsDir)) {
  fs.mkdirSync(seedsDir, { recursive: true });
}

const products = [];
let counter = 1;

for (const group of categoriesData) {
  for (const item of group.items) {
    const id = `prod_${String(counter).padStart(3, '0')}`;
    products.push({
      id,
      title: item.title,
      category: group.category,
      price: item.price,
      unit: item.unit,
      inStock: true,
      image: item.image
    });
    counter++;
  }
}

const jsonPath = path.join(seedsDir, 'products.json');
fs.writeFileSync(jsonPath, JSON.stringify(products, null, 2), 'utf-8');

console.log(`Successfully generated ${products.length} products into ${jsonPath}`);
