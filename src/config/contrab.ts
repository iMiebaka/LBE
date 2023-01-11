import cron from 'node-cron';
import { HotWireTransaction } from '../models';
import { TRANSACTION_STATE } from '../utils';
import logger from './logger';

const NAMESPACE = "Cronjob"


cron.schedule('* * * * *', async () => {
  // Code to run every minute
  const hotWireTransaction = await HotWireTransaction.query().select().where("status", TRANSACTION_STATE.PENDING)
  hotWireTransaction.forEach((transaction) => {
    logger.warn(NAMESPACE, transaction.created_at.toISOString());
  })
});

export default cron