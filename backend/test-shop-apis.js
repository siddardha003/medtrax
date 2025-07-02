// Test script to verify API responses for different shops
const testShops = [
    { name: 'Apollo Pharmacy', id: '68584d885013d3b43cd842c8' },
    { name: 'MedPlus Pharmacy', id: '68584d885013d3b43cd842cd' },
    { name: 'Guardian Pharmacy', id: '68584d885013d3b43cd842d2' },
    { name: 'Netmeds Pharmacy', id: '68584d895013d3b43cd842dc' },
    { name: 'Wellness Forever', id: '68584d895013d3b43cd842d7' }
];

async function testShopAPIs() {
    console.log('=== TESTING SHOP APIs ===\n');
    
    for (const shop of testShops) {
        try {
            console.log(`Testing ${shop.name} (ID: ${shop.id})...`);
            
            const response = await fetch(`http://localhost:5000/api/public/shops/${shop.id}`);
            const data = await response.json();
            
            if (data.success) {
                const shopData = data.data;
                console.log(`  ✅ Name: ${shopData.name}`);
                console.log(`  ✅ Owner: ${shopData.ownerName || 'Not set'}`);
                console.log(`  ✅ Phone: ${shopData.ownerPhone || shopData.phone || 'Not set'}`);
                console.log(`  ✅ Services: ${shopData.services?.length || 0} categories`);
                console.log(`  ✅ Images: ${shopData.images?.length || 0} images`);
                console.log(`  ✅ Location: ${shopData.location?.coordinates || 'Not set'}`);
                
                // Test service structure
                if (shopData.services && shopData.services.length > 0) {
                    const firstService = shopData.services[0];
                    console.log(`  🔍 First service category: "${firstService.category}"`);
                    console.log(`  🔍 First service items: ${firstService.items?.length || 0}`);
                    
                    if (firstService.items && firstService.items.length > 0) {
                        console.log(`  🔍 First item: "${firstService.items[0].name}" - $${firstService.items[0].price}`);
                    }
                }
            } else {
                console.log(`  ❌ Failed: ${data.message}`);
            }
            
            console.log('---');
        } catch (error) {
            console.log(`  ❌ Error: ${error.message}`);
            console.log('---');
        }
    }
}

// Run the test
testShopAPIs();
