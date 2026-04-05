import cron from 'node-cron';
import { getDBConnection } from '@/config/db';
import { CartEntity } from '@/modules/sales/cart/model/cart.entity';

export const initCronJobs = () => {
  // Run every hour: 0 * * * *
  cron.schedule('0 * * * *', async () => {
    console.log('Running Abandoned Cart Check...');
    await checkAbandonedCarts();
  });
};

const checkAbandonedCarts = async () => {
    try {
        const connection = await getDBConnection();
        const cartRepo = connection.getRepository(CartEntity);

        // Calculate 24 hours ago
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        // Find carts updated > 24h ago, and email NOT sent
        const abandonedCarts = await cartRepo
            .createQueryBuilder("cart")
            .leftJoinAndSelect("cart.user", "user")
            .where("cart.updatedAt < :time", { time: twentyFourHoursAgo })
            .andWhere("cart.abandonedEmailSent = :sent", { sent: false })
            .getMany();

        if (abandonedCarts.length === 0) {
            console.log('No abandoned carts found.');
            return;
        }

        console.log(`Found ${abandonedCarts.length} abandoned carts.`);

        for (const cart of abandonedCarts) {
            if (cart.user && cart.user.email) {
                // TODO: Integrate actual Email Service here
                console.log(`[SIMULATION] Sending Abandoned Cart Email to: ${cart.user.email} (Cart ID: ${cart.id})`);
                
                // Mark as sent
                cart.abandonedEmailSent = true;
                await cartRepo.save(cart);
            }
        }

    } catch (error) {
        console.error('Error in Abandoned Cart Cron:', error);
    }
};
