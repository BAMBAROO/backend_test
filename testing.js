// const date1 = new Date();
// const date2 = new Date(2024,1,2);
//
// const differenceInMilliseconds = Math.abs(date1.getTime() - date2.getTime());
// const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
//
// console.log(`Selisih dalam hari: ${Math.round(differenceInDays)}`);


// Mendapatkan tanggal hari ini
const today = new Date();

// Menyalin tanggal hari ini ke objek Date baru
const sevenDaysLater = new Date(today);

// Menambahkan 7 hari ke tanggal yang disalin
sevenDaysLater.setDate(today.getDate() + 7);

// Mengonversi hasil ke dalam string tanggal
const formattedDate = sevenDaysLater.toLocaleDateString();

console.log(`Tanggal 7 hari dari hari ini: ${formattedDate}`);
