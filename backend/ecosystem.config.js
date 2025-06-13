module.exports = {
  apps: [
    {
      name: 'chicken-backend',
      script: './index.js',
      env: {
        MONGO_URL: 'mongodb+srv://Tguldur:Tuugii0713@cluster0.lsxhbaf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
        PORT: '7000',
        ACCESS_TOKEN_SECRET: '3489f27ba8fe0ad940d43ecc33b5a8d72cc259f6f5154c9b385f966c9502b01ef994171665cad39aeea0d01334fc632896534710777d48c8891c9b69812e971d',
        REFRESH_TOKEN_SECRET: 'c46139e54c284e503140977026c61206186bfb40a5f16607055f6f91199774771f77b820070070862d8f45a2b9d837a96619fb8850ff210c80423078ba918437',
        VONAGE_API_KEY: '083774a6',
        VONAGE_API_SECRET: '2qarLJ2v61m3oVCu',
      },
      env_production: {
        NODE_ENV: 'production',
        MONGO_URL: 'mongodb+srv://Tguldur:Tuugii0713@cluster0.lsxhbaf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
        PORT: '7000',
        ACCESS_TOKEN_SECRET: '3489f27ba8fe0ad940d43ecc33b5a8d72cc259f6f5154c9b385f966c9502b01ef994171665cad39aeea0d01334fc632896534710777d48c8891c9b69812e971d',
        REFRESH_TOKEN_SECRET: 'c46139e54c284e503140977026c61206186bfb40a5f16607055f6f91199774771f77b820070070862d8f45a2b9d837a96619fb8850ff210c80423078ba918437',
        VONAGE_API_KEY: '083774a6',
        VONAGE_API_SECRET: '2qarLJ2v61m3oVCu',
      }
    }
  ]
};
