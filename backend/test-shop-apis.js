// Test script to verify API responses for different shops
const testShops = [
    { name: 'Apollo Pharmacy', id: '68584d885013d3b43cd842c8' },
    { name: 'MedPlus Pharmacy', id: '68584d885013d3b43cd842cd' },
    { name: 'Guardian Pharmacy', id: '68584d885013d3b43cd842d2' },
    { name: 'Netmeds Pharmacy', id: '68584d895013d3b43cd842dc' },
    { name: 'Wellness Forever', id: '68584d895013d3b43cd842d7' }
];

async function testShopAPIs() {
    
    
    for (const shop of testShops) {
        try {

            const response = await fetch(`http://localhost:5000/api/public/shops/${shop.id}`);
            const data = await response.json();
            
            if (data.success) {
                const shopData = data.data;
                
                
                
                
                
                
                
                // Test service structure
                if (shopData.services && shopData.services.length > 0) {
                    const firstService = shopData.services[0];
                    
                    
                    
                    if (firstService.items && firstService.items.length > 0) {
                        
                    }
                }
            } else {
                
            }
            
            
        } catch (error) {
            
            
        }
    }
}

// Run the test
testShopAPIs();
