module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL:
    process.env.DATABASE_URL || 'postgresql://quarto@localhost/quarto',
  TEST_DATABASE_URL: 'postgresql://quarto-test@localhost/quarto-test',
  CLIENT_ORIGIN: 'https://quarto-with-friends.vercel.app/',
};
