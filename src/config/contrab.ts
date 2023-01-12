import cron from 'node-cron';
import { HotWireTransaction } from '../models';
import { TRANSACTION_STATE } from '../utils';
import logger from './logger';

const NAMESPACE = "Cronjob"


cron.schedule('* * * * *', async () => {
  // Code to run every minute
  const hotWireTransaction = await HotWireTransaction.query().where("status", TRANSACTION_STATE.PENDING)
  hotWireTransaction.forEach(async (transaction) => {
    const diffMs = transaction.created_at.getTime() - new Date().getDate()
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    if (diffMins > 1) {
      // await HotWireTransaction.query().findById(transaction.id).patch({
      //   status: TRANSACTION_STATE.TIMEOUT
      // }).where("status", TRANSACTION_STATE.PENDING)
    }
  })
});

export default cron