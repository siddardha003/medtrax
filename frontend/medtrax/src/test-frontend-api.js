// Test the exact API call that the frontend is making
import { getPublicShopDetailsApi } from '../Api';

const testFrontendAPI = async () => {
    console.log('=== TESTING FRONTEND API CALLS ===');
    
    const testShops = [
        { name: 'Apollo Pharmacy', id: '68584d885013d3b43cd842c8' },
        { name: 'MedPlus Pharmacy', id: '68584d885013d3b43cd842cd' },
        { name: 'Guardian Pharmacy', id: '68584d885013d3b43cd842d2' }
    ];
    
    for (const shop of testShops) {
        try {
            console.log(`\nTesting ${shop.name} (${shop.id})...`);
            
            const response = await getPublicShopDetailsApi(shop.id);
            console.log('Response:', response);
            
            const shopData = response.data;
            console.log(`Name: ${shopData.name}`);
            console.log(`Owner: ${shopData.ownerName}`);
            console.log(`Phone: ${shopData.ownerPhone || shopData.phone}`);
            console.log(`Services: ${shopData.services?.length} categories`);
            console.log('---');
            
        } catch (error) {
            console.error(`Error testing ${shop.name}:`, error);
        }
    }
};

export default testFrontendAPI;
