import cron from 'node-cron';

cron.schedule('* * * * *', () => {
  // Code to run every minute
  console.log("Hello");
  
});

export default cron