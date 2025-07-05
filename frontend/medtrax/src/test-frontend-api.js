// Test the exact API call that the frontend is making
import { getPublicShopDetailsApi } from '../Api';

const testFrontendAPI = async () => {
    
    
    const testShops = [
        { name: 'Apollo Pharmacy', id: '68584d885013d3b43cd842c8' },
        { name: 'MedPlus Pharmacy', id: '68584d885013d3b43cd842cd' },
        { name: 'Guardian Pharmacy', id: '68584d885013d3b43cd842d2' }
    ];
    
    for (const shop of testShops) {
        try {
            
            const response = await getPublicShopDetailsApi(shop.id);
            
            
            const shopData = response.data;
            
            
            
            
            
            
        } catch (error) {
            console.error(`Error testing ${shop.name}:`, error);
        }
    }
};

export default testFrontendAPI;
