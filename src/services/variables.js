var stickersPack = [
  'CAACAgEAAxkBAAICGmMPof1KnHDzTHGx6JBVyxf0hwrNAAIBAAMCE2gfljt0NpaJLAQpBA',
  'CAACAgEAAxkBAAICG2MPogvpCOB5LvRpAf27mv8_KJnAAAIBAAMCE2gfljt0NpaJLAQpBA',
  'CAACAgEAAxkBAAICHGMPoiQ63X1dY9KqlBhBmBZkUG2HAAIDAAMCE2gfN9Ax8Ly5-B4pBA',
  'CAACAgEAAxkBAAICHWMPoidGq7KwU7NBJvXYKTTobPKZAAIFAAMCE2gfNOQ47e11micpBA',
  'CAACAgEAAxkBAAICHmMPoivymrMGNUb8XRNvjwr5jj7FAAIGAAMCE2gfDmcD1-iPWc4pBA',
  'CAACAgEAAxkBAAICH2MPoi5QVnx-AyY4b646VvpLMAuKAAIHAAMCE2gf6CR8y8UV7yspBA',
  'CAACAgEAAxkBAAICIGMPojC_BujczaqGNfnRyyN1rmdNAAIIAAMCE2gfvNFPU3XmJfcpBA',
  'CAACAgEAAxkBAAICIWMPojMVaehMLM_OZF2DaWX8oTOHAAIJAAMCE2gfmbH29LZ2KvQpBA',
  'CAACAgEAAxkBAAICImMPojW4N0XWtsMevs66OkDWEkdvAAIKAAMCE2gfvf0z3FU2CIwpBA',
  'CAACAgEAAxkBAAICI2MPojjzu1xEbHVb4I-6obN9oZ-DAAILAAMCE2gf64ZG0kbKTsUpBA',
  'CAACAgEAAxkBAAICJGMPojvntWPBugccIMonRy-vg_MjAAIMAAMCE2gfHLwEX5C_jO0pBA',
  'CAACAgEAAxkBAAICJWMPoj6I_YrA9yiWuCQsxfIYFRegAAIOAAMCE2gf7NZ7RuNGsWQpBA',
  'CAACAgEAAxkBAAICJmMPokAWtMS20cP1b0eutpb75OcwAAIQAAMCE2gfL_T7ymM72lUpBA',
  'CAACAgEAAxkBAAICJ2MPokRqUNJsY9rbbHEu3Y1jVPmlAAIRAAMCE2gffj6aK0wpayopBA',
  'CAACAgEAAxkBAAICKGMPokakVx4o42mx-HswNoNL2xZ8AAISAAMCE2gfJhvAeY2p7QkpBA',
  'CAACAgEAAxkBAAICKWMPokziC0BqgGR72qjJcZ7Ro6jiAAITAAMCE2gfbxsRuMBfh2kpBA',
  'CAACAgEAAxkBAAICKmMPolLQSHqDHfSWcDMohsY7vh28AAIUAAMCE2gfA-krMUG-SFwpBA',
  'CAACAgEAAxkBAAICK2MPolXCwaBxcSExIO0LoLb9pnjYAAIWAAMCE2gfsktGWSItCRcpBA',
  'CAACAgEAAxkBAAICLGMPolfB7A2ccL4aC-3I05lTwlROAAIXAAMCE2gfrfM4al6kejYpBA',
  'CAACAgEAAxkBAAICLWMPoltlxygh1Hbim7EFYSa5bXl0AAIZAAMCE2gfJfwQn0xoXaYpBA',
  'CAACAgEAAxkBAAICLmMPomDwlx1p_NdX_0XZaA4b61tyAAIaAAMCE2gfHK9ZKkanTBUpBA',
  'CAACAgEAAxkBAAICL2MPomWV9Ij-Gyj6rFO8i1e9Iob6AAIbAAMCE2gf9Y7FkAJMSOkpBA',
  'CAACAgEAAxkBAAICMGMPomzryvFIxSVld11Hg_3vfaIvAAIcAAMCE2gf3dLJHjIMtGYpBA',
  'CAACAgEAAxkBAAICMWMPonIDKXTwST1omsIziUE7zD4aAAIfAAMCE2gfhtEiWen-1ZEpBA',
  'CAACAgEAAxkBAAICMmMPon0iuBxbFE0gWIFI_fwdIA9oAAIgAAMCE2gf5TDv6zVqtuYpBA',
  'CAACAgEAAxkBAAICM2MPooNnjJdMaBLJDVR4N9Ed7_xDAAIhAAMCE2gfquY44Y-EG5gpBA',
  'CAACAgEAAxkBAAICNGMPootTvI-ewm6moaL7ZOv71kjPAAIiAAMCE2gfDRxp-xqwPSMpBA',
  'CAACAgEAAxkBAAICNWMPopHy-o62cCbRWA5exqjTUaqJAAIjAAMCE2gfYH4YFX0eTW0pBA',
  'CAACAgEAAxkBAAICNmMPoprBz-soP_kjsAJFELlI5Tc9AAIkAAMCE2gfUf3droZm4r8pBA',
  'CAACAgEAAxkBAAICN2MPop81MlCJnLGPAm-JJz8YU1UxAAIlAAMCE2gf6DRBJcW-us0pBA',
  'CAACAgEAAxkBAAICOGMPoqMGKDxCQFWATEVWAAHqKGcQjQACJgADAhNoHzM_lzhFTbQiKQQ',
  'CAACAgEAAxkBAAICOWMPoqYu4OgbYUxIpkYlyIvvBz39AAInAAMCE2gfP6j8FC1y30kpBA',
  'CAACAgEAAxkBAAICOmMPoqrz2bGkb3O4qOpLkFT8J4k3AAIoAAMCE2gfHwoBZc19x_gpBA',
  'CAACAgEAAxkBAAICO2MPoq1NFsOnmWzHtYOPMvWG9ndmAAIpAAMCE2gfZEDta3l_ZQgpBA',
  'CAACAgEAAxkBAAICPGMPorGzilzxDkJPMF25uwPpw6gNAAIqAAMCE2gfPSo0X9wg9hopBA',
  'CAACAgEAAxkBAAICPWMPorSuRKq2gmJ53GmkJQ2penQjAAIrAAMCE2gfO6Q9xo-Cto8pBA',
  '',
];
export default {
  stickersPack,
};
