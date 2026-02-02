const mongoose = require('mongoose');
const RoomClass = require('../models/RoomClass');
const RoomInstance = require('../models/RoomInstance');
const Product = require('../models/Product');

/**
 * Migration script to convert existing Product-based rooms to Room Class + Room Instance system
 * 
 * This script will:
 * 1. Create Room Classes from existing room products
 * 2. Create Room Instances for each room class
 * 3. Update existing orders to reference the new system
 */

async function migrateRooms() {
    try {
        console.log('Starting room migration...');
        
        // Get all existing room products
        const roomProducts = await Product.find({ category: 'room' });
        console.log(`Found ${roomProducts.length} room products to migrate`);
        
        if (roomProducts.length === 0) {
            console.log('No room products found. Migration complete.');
            return;
        }
        
        // Group products by subcategory
        const roomGroups = {};
        roomProducts.forEach(product => {
            const key = `${product.subcategory}_${product.title}`;
            if (!roomGroups[key]) {
                roomGroups[key] = [];
            }
            roomGroups[key].push(product);
        });
        
        console.log(`Found ${Object.keys(roomGroups).length} unique room types`);
        
        // Create Room Classes and Instances
        for (const [key, products] of Object.entries(roomGroups)) {
            const firstProduct = products[0];
            const subcategory = firstProduct.subcategory;
            const title = firstProduct.title;
            
            console.log(`\nProcessing ${title} (${subcategory})...`);
            
            // Create Room Class
            const roomClass = new RoomClass({
                name: title,
                slug: `${subcategory}-${title.toLowerCase().replace(/\s+/g, '-')}`,
                description: firstProduct.desc,
                category: 'room',
                subcategory: subcategory,
                capacity: {
                    adults: 2, // Default assumption
                    children: 0
                },
                basePrice: firstProduct.price,
                mrp: firstProduct.mrp,
                discountPercent: firstProduct.discountp || 0,
                amenities: ['Wi-Fi', 'AC', 'TV'], // Default amenities
                features: ['Clean Bedding', 'Private Bathroom'], // Default features
                bedType: 'king', // Default assumption
                roomSize: 'Standard', // Default assumption
                view: 'Standard', // Default assumption
                images: [
                    { url: firstProduct.img1, alt: `${title} - Main View` },
                    { url: firstProduct.img2, alt: `${title} - Secondary View` }
                ].filter(img => img.url),
                totalInventory: products.length,
                createdBy: null, // Will be set to admin user
                lastModifiedBy: null
            });
            
            await roomClass.save();
            console.log(`Created Room Class: ${roomClass.name} (${roomClass._id})`);
            
            // Create Room Instances
            for (let i = 0; i < products.length; i++) {
                const product = products[i];
                const roomNumber = product.title.includes('Room') 
                    ? product.title.split('Room')[1].trim() 
                    : `${subcategory.toUpperCase()}-${i + 1}`;
                
                const roomInstance = new RoomInstance({
                    roomNumber: roomNumber,
                    roomName: product.title,
                    roomClass: roomClass._id,
                    floor: Math.floor(i / 10) + 1, // Distribute across floors
                    building: 'Main Building',
                    status: product.availableQty > 0 ? 'available' : 'maintenance',
                    specialFeatures: [],
                    createdBy: null,
                    lastModifiedBy: null
                });
                
                await roomInstance.save();
                console.log(`  Created Room Instance: ${roomInstance.roomNumber}`);
            }
            
            // Update the room class with actual inventory count
            roomClass.activeRooms = products.length;
            await roomClass.save();
        }
        
        console.log('\n✅ Room migration completed successfully!');
        console.log('Next steps:');
        console.log('1. Review the created Room Classes and Instances');
        console.log('2. Update any hardcoded references to old Product IDs');
        console.log('3. Test the booking system with the new structure');
        console.log('4. Consider archiving old Product records');
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

async function rollbackMigration() {
    try {
        console.log('Rolling back room migration...');
        
        // Delete all Room Classes and Instances
        await RoomClass.deleteMany({});
        await RoomInstance.deleteMany({});
        
        console.log('✅ Rollback completed. All Room Classes and Instances deleted.');
        
    } catch (error) {
        console.error('❌ Rollback failed:', error);
        process.exit(1);
    }
}

// CLI interface
const args = process.argv.slice(2);
const command = args[0];

if (command === 'migrate') {
    migrateRooms();
} else if (command === 'rollback') {
    rollbackMigration();
} else {
    console.log('Usage:');
    console.log('  node migrate-rooms.js migrate   - Run the migration');
    console.log('  node migrate-rooms.js rollback  - Rollback the migration');
    process.exit(1);
}