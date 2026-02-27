import "../../src/config/env.config.js";
import mongoose from "mongoose";
import { connectDB } from "../database.js";
import CategoryShop from "../admin/shop-slot/category-shop.model.js";
import ShopSlot from "../admin/shop-slot/shop-slot.model.js";

const CATEGORIES = [
    { name: "Boutique A-0", rent_price: 3000 },
    { name: "Boutique A-1", rent_price: 2000 },
    { name: "Boutique A-2", rent_price: 1500 },
    { name: "Boutique A-3", rent_price: 1000 },
];

function categoryForSlot(glbNodeName) {
    if (glbNodeName === "Multiplex") return "Boutique A-0";
    if (glbNodeName.startsWith("Multiplex00")) return "Boutique A-1";
    if (glbNodeName === "Hypermarket" || glbNodeName.startsWith("Hypermarket")) return "Boutique A-1";
    if (glbNodeName === "Shop_A1_01" || glbNodeName.startsWith("Shop_A1_01")) return "Boutique A-2";
    if (glbNodeName === "Rest_2" || glbNodeName.startsWith("Rest_2")) return "Boutique A-3";
    return null;
}

const SLOTS_RAW = [
    { glb_node_name: "Shop_A1_01", position: { x: -70.16, y:  3.05, z: -55.18 } },
    { glb_node_name: "Shop_A1_01001", position: { x: -70.16, y: -0.79, z: -16.71 } },
    { glb_node_name: "Shop_A1_01002", position: { x: -70.16, y: -0.79, z:   3.74 } },
    { glb_node_name: "Shop_A1_01003", position: { x: -70.16, y: -0.79, z:  36.82 } },
    { glb_node_name: "Shop_A1_01004", position: { x: -70.16, y: -0.79, z:  54.75 } },
    { glb_node_name: "Shop_A1_01005", position: { x: -70.16, y: -0.79, z:  72.58 } },
    { glb_node_name: "Shop_A1_01006", position: { x:  69.06, y: -0.79, z:  72.58 } },
    { glb_node_name: "Shop_A1_01007", position: { x:  69.06, y: -0.79, z:  54.27 } },
    { glb_node_name: "Shop_A1_01008", position: { x:  29.16, y: -0.79, z:  72.58 } },
    { glb_node_name: "Shop_A1_01009", position: { x:   0.31, y: -0.79, z:  72.58 } },

    { glb_node_name: "Rest_2", position: { x:  15.71, y:  2.75, z: -55.76 } },
    { glb_node_name: "Rest_2001", position: { x:  41.91, y: -1.13, z: -38.23 } },
    { glb_node_name: "Rest_2002", position: { x:  55.25, y: -1.18, z: -38.36 } },
    { glb_node_name: "Rest_2003", position: { x:  68.94, y: -1.21, z: -38.37 } },
    { glb_node_name: "Rest_2004", position: { x:  28.37, y: -1.13, z: -38.25 } },
    { glb_node_name: "Rest_2005", position: { x:  73.36, y: -1.21, z: -16.01 } },
    { glb_node_name: "Rest_2006", position: { x:  73.36, y: -1.21, z:   2.01 } },
    { glb_node_name: "Rest_2007", position: { x:  73.36, y: -1.21, z:  18.97 } },

    { glb_node_name: "Multiplex001", position: { x: -40.00, y: -0.36, z:  45.60 } },
    { glb_node_name: "Multiplex002", position: { x: -10.48, y: -0.19, z: -16.93 } },
    { glb_node_name: "Multiplex003", position: { x: -10.48, y: -0.19, z:  15.50 } },
    { glb_node_name: "Hypermarket", position: { x: -13.06, y:  3.34, z:  27.95 } },

    { glb_node_name: "Multiplex", position: { x: -40.00, y:  3.50, z: -19.31 } },
];

export async function runSeed({ reset = false } = {}) {
    if (reset) {
        await CategoryShop.deleteMany({});
        console.log("CategoryShop collection cleared");
    }

    const existingCategories = await CategoryShop.find({});
    let categoryMap = {};

    if (existingCategories.length === 0 || reset) {
        const inserted = await CategoryShop.insertMany(CATEGORIES);
        inserted.forEach((c) => (categoryMap[c.name] = c._id));
        console.log(`${inserted.length} categories inserted`);
    } else {
        existingCategories.forEach((c) => (categoryMap[c.name] = c._id));
        console.log(`Categories already present (${existingCategories.length}), skipping`);
    }

    if (reset) {
        await ShopSlot.deleteMany({});
        console.log("🗑️  ShopSlot collection cleared");
    }

    const slots = SLOTS_RAW.map((s) => {
        const catName = categoryForSlot(s.glb_node_name);
        if (!catName || !categoryMap[catName]) {
            throw new Error(`No category found for slot "${s.glb_node_name}" (resolved: "${catName}")`);
        }
        return {
            glb_node_name: s.glb_node_name,
            category:      categoryMap[catName],
            status:        "available",
            shop:          null,
            position:      s.position ?? { x: 0, y: 0, z: 0 },
        };
    });

    let insertedSlots = 0;
    for (const slot of slots) {
        await ShopSlot.updateOne(
            { glb_node_name: slot.glb_node_name },
            { $setOnInsert: slot },
            { upsert: true }
        );
        insertedSlots++;
    }
    console.log(`${insertedSlots} shop slots seeded (upsert)`);
}

const isCLI = process.argv[1]?.includes("seed");

if (isCLI) {
    const reset = process.argv.includes("--reset");

    (async () => {
        await connectDB();
        await runSeed({ reset });
        await mongoose.connection.close();
        console.log("Connection closed — seed complete");
    })().catch((err) => {
        console.error("Seed failed:", err);
        process.exit(1);
    });
}
