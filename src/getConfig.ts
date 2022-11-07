//setup environment variables here
export const getConfig = () => ({
  DISCORD_TOKEN: process.env.DISCORD_TOKEN || '',
  CLIENT_ID: process.env.CLIENT_ID || ''
});
